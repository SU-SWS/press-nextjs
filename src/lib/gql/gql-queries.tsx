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

        // Paths that start with /node/ should not be used.
        if (path.startsWith("/node/")) return {}

        try {
          query = await graphqlClient({cache: "no-cache"}, previewMode).Route({path})
        } catch (e) {
          console.warn(e instanceof Error ? e.message : "An error occurred")
          return {entity: undefined, redirect: undefined, error: e instanceof Error ? e.message : "An error occurred"}
        }

        if (query.route?.__typename === "RouteRedirect") return {redirect: query.route, entity: undefined}
        entity =
          query.route?.__typename === "RouteInternal" && query.route.entity ? (query.route.entity as T) : undefined
        return {entity, redirect: undefined, error: undefined}
      },
      ["entities", path, previewMode ? "preview" : "anonymous"],
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

export const getConfigPageField = async <T extends ConfigPagesUnion, F>(
  configPageType: ConfigPagesUnion["__typename"],
  fieldName: keyof T
): Promise<F | undefined> => {
  const getData = nextCache(
    async () => {
      const configPage = await getConfigPage<T>(configPageType)
      return configPage?.[fieldName] as F
    },
    [fieldName.toString()],
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

/**
 * Get a list of ancillary excerpt pages for the give book node.
 *
 * @param uuid
 *   Parent book node UUID.
 * @param bookPath
 *   Path of book node for cache invalidation.
 */
export const getBookAncillaryContents = async (uuid: string, bookPath: string): Promise<NodeSupBookAncillary[]> => {
  const getData = nextCache(
    async () => {
      const ancillaryPages = await graphqlClient({cache: "no-cache"}).supBookAncillary({
        contextualFilters: {uuid},
      })
      return (ancillaryPages.supBookAncillary?.results as NodeSupBookAncillary[]) || []
    },
    ["ancillary-pages", uuid],
    {tags: [`excerpts:${bookPath}`, "ancillary-pages"]}
  )
  return getData()
}

/**
 * If environment variables are available, return those. If not, fetch from the config page.
 */
export const getAlgoliaCredential = nextCache(
  async (): Promise<[string, string, string, boolean] | []> => {
    if (process.env.ALGOLIA_ID && process.env.ALGOLIA_INDEX && process.env.ALGOLIA_KEY) {
      return [
        process.env.ALGOLIA_ID,
        process.env.ALGOLIA_INDEX,
        process.env.ALGOLIA_KEY,
        process.env.ALGOLIA_RECOMMENDATIONS === "true",
      ]
    }
    const appId = await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteAlgoliaId"]>(
      "StanfordBasicSiteSetting",
      "suSiteAlgoliaId"
    )
    const indexName = await getConfigPageField<
      StanfordBasicSiteSetting,
      StanfordBasicSiteSetting["suSiteAlgoliaIndex"]
    >("StanfordBasicSiteSetting", "suSiteAlgoliaIndex")
    const apiKey = await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteAlgoliaSearch"]>(
      "StanfordBasicSiteSetting",
      "suSiteAlgoliaSearch"
    )
    return appId && indexName && apiKey
      ? [appId, indexName, apiKey, process.env.ALGOLIA_RECOMMENDATIONS === "true"]
      : []
  },
  ["algolia"],
  {tags: ["algolia"]}
)
