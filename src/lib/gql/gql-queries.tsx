import {
  NodeSupBookAncillary,
  AllNodesQuery,
  AllNodesQueryVariables,
  ConfigPagesQuery,
  ConfigPagesUnion,
  MenuAvailable,
  MenuItem,
  NodeUnion,
  RouteQuery,
  RouteRedirect,
  TermUnion,
  StanfordBasicSiteSetting,
} from "@lib/gql/__generated__/drupal.d"
import {cache} from "react"
import {graphqlClient} from "@lib/gql/gql-client"
import {unstable_cache as nextCache} from "next/cache"

export const getEntityFromPath = cache(
  async <T extends NodeUnion | TermUnion>(
    path: string,
    previewMode?: boolean
  ): Promise<{
    entity?: T
    redirect?: RouteRedirect
    error?: string
  }> => {
    "use server"

    const getData = nextCache(
      async () => {
        let entity: T | undefined
        let query: RouteQuery

        try {
          query = await graphqlClient({next: {tags: ["all-entities", `paths:${path}`]}}, previewMode).Route({path})
        } catch (e) {
          console.warn(e instanceof Error ? e.message : "An error occurred")
          return {entity: undefined, redirect: undefined, error: e instanceof Error ? e.message : "An error occurred"}
        }

        if (query.route?.__typename === "RouteRedirect") return {redirect: query.route, entity: undefined}
        entity =
          query.route?.__typename === "RouteInternal" && query.route.entity ? (query.route.entity as T) : undefined
        return {entity, redirect: undefined, error: undefined}
      },
      ["entities", path],
      {tags: ["all-entities", `paths:${path}`]}
    )

    return getData()
  }
)

export const getConfigPage = async <T extends ConfigPagesUnion>(
  configPageType: ConfigPagesUnion["__typename"]
): Promise<T | undefined> => {
  "use server"

  const getData = nextCache(
    async () => {
      let query: ConfigPagesQuery
      try {
        query = await graphqlClient({next: {tags: ["config-pages"]}}).ConfigPages()
      } catch (e) {
        console.warn("Unable to fetch config pages: " + (e instanceof Error && e.stack))
        return
      }

      const queryKeys = Object.keys(query) as (keyof ConfigPagesQuery)[]
      for (let i = 0; i < queryKeys.length; i++) {
        const queryKey = queryKeys[i]
        if (queryKey !== "__typename" && query[queryKey]?.nodes[0]?.__typename === configPageType) {
          return query[queryKey].nodes[0] as T
        }
      }
    },
    [configPageType || "config-pages"],
    {tags: ["config-pages"]}
  )
  return getData()
}

export const getMenu = cache(async (name?: MenuAvailable): Promise<MenuItem[]> => {
  "use server"
  const menuName = name?.toLowerCase() || "main"

  const getData = nextCache(
    async () => {
      const menu = await graphqlClient({cache: "no-store"}).Menu({name})
      const menuItems = (menu.menu?.items || []) as MenuItem[]

      const filterInaccessible = (items: MenuItem[]): MenuItem[] => {
        items = items.filter(item => item.title !== "Inaccessible")
        items.map(item => (item.children = filterInaccessible(item.children)))
        return items
      }
      return filterInaccessible(menuItems)
    },
    ["menus", menuName],
    {tags: ["menus", `menu:${menuName}`]}
  )

  return getData()
})

export const getAllNodes = nextCache(
  cache(async () => {
    "use server"

    const nodes: NodeUnion[] = []
    let fetchMore = true
    let nodeQuery: AllNodesQuery
    let queryKeys: (keyof AllNodesQuery)[] = []
    const cursors: Omit<AllNodesQueryVariables, "first"> = {}

    while (fetchMore) {
      nodeQuery = await graphqlClient({cache: "no-store"}).AllNodes({first: 1000, ...cursors})
      queryKeys = Object.keys(nodeQuery) as (keyof AllNodesQuery)[]
      fetchMore = false

      queryKeys.map(queryKey => {
        if (queryKey === "__typename") return

        nodeQuery[queryKey]?.nodes.map(node => nodes.push(node as NodeUnion))

        if (nodeQuery[queryKey].pageInfo.endCursor) cursors[queryKey] = nodeQuery[queryKey].pageInfo.endCursor
        if (nodeQuery[queryKey].pageInfo.hasNextPage) fetchMore = true
      })
    }

    return nodes
  }),
  ["node-paths"],
  {revalidate: 60 * 60 * 7}
)

export const getBookAncillaryContents = async (uuid: string): Promise<NodeSupBookAncillary[]> => {
  const ancillaryPages = await graphqlClient({next: {tags: [uuid, "ancillary-pages"]}}).supBookAncillary({
    filters: {uuid},
  })
  return (ancillaryPages.supBookAncillary?.results as NodeSupBookAncillary[]) || []
}

/**
 * If environment variables are available, return those. If not, fetch from the config page.
 */
export const getAlgoliaCredential = nextCache(
  async () => {
    if (process.env.ALGOLIA_ID && process.env.ALGOLIA_INDEX && process.env.ALGOLIA_KEY) {
      return [process.env.ALGOLIA_ID, process.env.ALGOLIA_INDEX, process.env.ALGOLIA_KEY]
    }
    const configPage = await getConfigPage<StanfordBasicSiteSetting>("StanfordBasicSiteSetting")
    if (configPage?.suSiteAlgoliaId && configPage.suSiteAlgoliaIndex && configPage.suSiteAlgoliaSearch) {
      return [configPage.suSiteAlgoliaId, configPage.suSiteAlgoliaIndex, configPage.suSiteAlgoliaSearch]
    }
    return []
  },
  ["algolia"],
  {tags: ["algolia"]}
)
