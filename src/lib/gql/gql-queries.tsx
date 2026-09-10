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

type RouteResult<T extends NodeUnion> = {
  entity?: T
  redirect?: RouteRedirect["url"]
}

/**
 * Resolve a Drupal path to its entity or a redirect.
 *
 * Preview renders draft content, which changes on every editor save. Caching it would leave an editor looking at the
 * revision they previewed first until Drupal happened to fire a revalidation for that path, so preview requests go
 * straight to Drupal and only published content is cached.
 */
export const getEntityFromPath = async <T extends NodeUnion>(
  path: string,
  previewMode?: boolean,
  teaser?: boolean
): Promise<RouteResult<T>> =>
  previewMode ? requestEntityFromPath<T>(path, true, teaser) : getCachedEntityFromPath<T>(path, teaser)

const getCachedEntityFromPath = async <T extends NodeUnion>(
  path: string,
  teaser?: boolean
): Promise<RouteResult<T>> => {
  "use cache: remote"

  cacheTag("all-entities", `paths:${path}`)
  return requestEntityFromPath<T>(path, false, teaser)
}

const requestEntityFromPath = async <T extends NodeUnion>(
  path: string,
  previewMode: boolean,
  teaser?: boolean
): Promise<RouteResult<T>> => {
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

/**
 * Fetch every config page bundle in one request.
 *
 * Deliberately takes no arguments: the ConfigPages query takes none either, so keying a cache entry per bundle or per
 * field would issue the same request repeatedly and store near duplicate copies of the response. Callers pick the
 * bundle they want out of the shared result.
 */
const getAllConfigPages = async (): Promise<ConfigPagesQuery | undefined> => {
  "use cache: remote"

  cacheTag("config-pages")
  try {
    return await graphqlClient().ConfigPages()
  } catch (e) {
    console.warn("Unable to fetch config pages: " + (e instanceof Error && e.stack))
  }
}

export const getConfigPage = async <T extends ConfigPagesUnion>(
  configPageType: ConfigPagesUnion["__typename"]
): Promise<T | undefined> => {
  const query = await getAllConfigPages()
  if (!query) return

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
  const configPage = await getConfigPage<T>(configPageType)
  return configPage?.[fieldName] as F
}

const fetchMenu = async (name?: MenuAvailable): Promise<MenuItem[]> => {
  "use cache: remote"

  cacheTag("menu", `menu:${name?.toLowerCase() || "main"}`)
  const menu = await graphqlClient().Menu({name})
  return (menu.menu?.items || []) as MenuItem[]
}

export const getMenu = async (name?: MenuAvailable): Promise<MenuItem[]> => {
  const menuItems = await fetchMenu(name)

  // Rebuild the tree instead of mutating it in place. These items come straight out of a cache entry, and the
  // in-memory tier can hand the same objects to every caller.
  const filterInaccessible = (items: MenuItem[]): MenuItem[] =>
    items
      .filter(item => item.title !== "Inaccessible")
      .map(item => ({...item, children: filterInaccessible(item.children)}))

  return filterInaccessible(menuItems)
}

export const getAllNodes = async () => {
  "use cache: remote"

  cacheLife("months")

  const nodes: NodeUnion[] = []
  let fetchMore = true
  let nodeQuery: AllNodesQuery
  let queryKeys: (keyof AllNodesQuery)[] = []
  const cursors: Omit<AllNodesQueryVariables, "first"> = {}

  while (fetchMore) {
    nodeQuery = await graphqlClient().AllNodes({
      first: 500,
      ...cursors,
    })
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
  "use cache: remote"

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
  if (process.env.ALGOLIA_ID && process.env.ALGOLIA_INDEX && process.env.ALGOLIA_KEY) {
    return [
      process.env.ALGOLIA_ID,
      process.env.ALGOLIA_INDEX,
      process.env.ALGOLIA_KEY,
      process.env.ALGOLIA_RECOMMENDATIONS === "true",
    ]
  }
  // All three values live on the same config page, so read it once rather than resolving it per field.
  const siteSettings = await getConfigPage<StanfordBasicSiteSetting>("StanfordBasicSiteSetting")
  const appId = siteSettings?.suSiteAlgoliaId
  const indexName = siteSettings?.suSiteAlgoliaIndex
  const apiKey = siteSettings?.suSiteAlgoliaSearch

  return appId && indexName && apiKey ? [appId, indexName, apiKey, process.env.ALGOLIA_RECOMMENDATIONS === "true"] : []
}

export const getHomePagePath = async () => {
  const {entity} = await getEntityFromPath("/")
  return entity?.path
}
