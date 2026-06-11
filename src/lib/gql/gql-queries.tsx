"use cache: remote"

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
  StanfordBasicSiteSetting,
} from "@lib/gql/__generated__/drupal.d"
import {graphqlClient} from "@lib/gql/gql-client"
import {ClientError} from "graphql-request"
import {GraphQLError} from "graphql/error"
import {cacheLife, cacheTag} from "next/cache"

type DrupalGraphqlError = GraphQLError & {debugMessage: string}

export const getEntityFromPath = async <T extends NodeUnion>(
  path: string,
  previewMode?: boolean,
  teaser?: boolean
): Promise<{
  entity?: T
  redirect?: RouteRedirect["url"]
}> => {
  cacheTag("all-entities", `paths:${path}`)

  // Paths that start with /node/ should not be used.
  if (path.startsWith("/node/")) return {}

  let query: RouteQuery

  try {
    query = await graphqlClient(undefined, previewMode).Route({
      path,
      teaser: !!teaser,
    })
  } catch (e) {
    if (e instanceof ClientError) {
      // @ts-expect-error Client error type doesn't define the debugMessage, but it's there.
      const messages = e.response.errors?.map((error: DrupalGraphqlError) => error.debugMessage || error.message)
      console.warn([...new Set(messages)].join(" "))
    } else {
      console.warn(e instanceof Error ? e.message : "An error occurred")
    }
    return {}
  }

  if (query.route?.__typename === "RouteRedirect") return {redirect: query.route.url}
  const entity: T | undefined =
    query.route?.__typename === "RouteInternal" && query.route.entity ? (query.route.entity as T) : undefined
  return {entity}
}

export const getConfigPage = async <T extends ConfigPagesUnion>(
  configPageType: ConfigPagesUnion["__typename"]
): Promise<T | undefined> => {
  cacheTag("config-pages")
  let query: ConfigPagesQuery
  try {
    query = await graphqlClient().ConfigPages()
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
}

export const getConfigPageField = async <T extends ConfigPagesUnion, F>(
  configPageType: ConfigPagesUnion["__typename"],
  fieldName: keyof T
) => {
  cacheTag("config-pages")
  const configPage = await getConfigPage<T>(configPageType)
  return configPage?.[fieldName] as F
}

export const getMenu = async (name?: MenuAvailable): Promise<MenuItem[]> => {
  const menuName = name?.toLowerCase() || "main"
  cacheTag("menus", `menu:${menuName}`)

  const menu = await graphqlClient().Menu({name})
  const menuItems = (menu.menu?.items || []) as MenuItem[]

  const filterInaccessible = (items: MenuItem[]): MenuItem[] => {
    items = items.filter(item => item.title !== "Inaccessible")
    items.map(item => (item.children = filterInaccessible(item.children)))
    return items
  }
  return filterInaccessible(menuItems)
}

export const getAllNodes = async () => {
  cacheLife("weeks")

  const nodes: NodeUnion[] = []
  let fetchMore = true
  let nodeQuery: AllNodesQuery
  let queryKeys: (keyof AllNodesQuery)[] = []
  const cursors: Omit<AllNodesQueryVariables, "first"> = {}

  while (fetchMore) {
    nodeQuery = await graphqlClient().AllNodes({first: 1000, ...cursors})
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
}

/**
 * Get a list of ancillary excerpt pages for the give book node.
 *
 * @param uuid
 *   Parent book node UUID.
 */
export const getBookAncillaryContents = async (uuid: string): Promise<NodeSupBookAncillary[]> => {
  cacheTag("ancillary-pages", `excerpts:${uuid}`)
  const ancillaryPages = await graphqlClient().supBookAncillary({
    contextualFilters: {uuid},
  })
  return (ancillaryPages.supBookAncillary?.results as NodeSupBookAncillary[]) || []
}

/**
 * If environment variables are available, return those. If not, fetch from the config page.
 */
export const getAlgoliaCredential = async (): Promise<[string, string, string, boolean] | []> => {
  cacheTag("algolia")
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
  const indexName = await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteAlgoliaIndex"]>(
    "StanfordBasicSiteSetting",
    "suSiteAlgoliaIndex"
  )
  const apiKey = await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteAlgoliaSearch"]>(
    "StanfordBasicSiteSetting",
    "suSiteAlgoliaSearch"
  )
  return appId && indexName && apiKey ? [appId, indexName, apiKey, process.env.ALGOLIA_RECOMMENDATIONS === "true"] : []
}

export const getHomePagePath = async () => {
  cacheTag("paths:/")
  const {entity} = await getEntityFromPath("/")
  return entity?.path
}
