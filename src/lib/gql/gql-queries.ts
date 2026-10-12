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
  AllNodesDocument,
  ConfigPagesDocument,
  MenuDocument,
  MenuQuery,
  RouteDocument,
  SupBookAncillaryDocument,
  SupBookAncillaryQuery,
} from "@lib/gql/__generated__/graphql"
import {describeError, graphqlClient} from "@lib/gql/gql-client"
import {cacheLife, cacheTag} from "next/cache"

/**
 * Log a failed Drupal request from inside a `use cache` function and keep its fallback short-lived.
 *
 * A failure is not a real answer, so it must not be cached for as long as one. Pages that render the fallback also take
 * this shorter lifetime, so they try Drupal again within minutes. Only call this inside a cache scope, and only once per
 * invocation (it sets the scope's cacheLife).
 */
export const cacheFailure = (context: string, error: unknown) => {
  console.warn(`${context}: ${describeError(error)}`)
  cacheLife("minutes")
}

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
 *
 * @returns `{entity}` for real pages, `{redirect}` for redirects, or `{}` when the path doesn't exist. A teaser or
 *   preview lookup also returns `{}` when Drupal fails, so one card can't break the page around it.
 * @throws {ClientError} When a full (non-teaser, non-preview) lookup fails. The page render fails with it, so a cached
 *   copy of the page keeps being served instead of being replaced by a "not found".
 */
export const getEntityFromPath = async <T extends NodeUnion>(
  path: string,
  previewMode?: boolean,
  teaser?: boolean
): Promise<RouteResult<T>> => {
  if (!previewMode) return getCachedEntityFromPath<T>(path, teaser)

  try {
    return await requestEntityFromPath<T>(path, true, teaser)
  } catch (e) {
    console.warn(`Unable to fetch preview of ${path}: ${describeError(e)}`)
    return {}
  }
}

const getCachedEntityFromPath = async <T extends NodeUnion>(
  path: string,
  teaser?: boolean
): Promise<RouteResult<T>> => {
  "use cache: remote"

  cacheTag("all-entities", `paths:${path}`)
  try {
    // A path Drupal doesn't know resolves without an error, so a real "not found" is cached normally.
    return await requestEntityFromPath<T>(path, false, teaser)
  } catch (e) {
    // A teaser is a card within some other page: show the page without it, and retry soon.
    if (teaser) {
      cacheFailure(`Unable to fetch teaser of ${path}`, e)
      return {}
    }

    // A failure is not a "not found". Rendering a 404 here would replace a good cached page indefinitely, and tell
    // search engines the page is gone. Failing the render instead keeps the last good copy in the cache (or returns an
    // error status when there isn't one). A thrown error is never cached.
    console.warn(`Unable to fetch ${path}: ${describeError(e)}`)
    throw e
  }
}

const requestEntityFromPath = async <T extends NodeUnion>(
  path: string,
  previewMode: boolean,
  teaser?: boolean
): Promise<RouteResult<T>> => {
  // Paths that start with /node/ should not be used.
  if (path.startsWith("/node/")) return {}

  // Errors are left to the caller: only a cached caller can shorten the cache lifetime.
  const query = await graphqlClient(undefined, previewMode).request<RouteQuery>(RouteDocument, {
    path,
    teaser: !!teaser,
  })

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
    return await graphqlClient().request<ConfigPagesQuery>(ConfigPagesDocument)
  } catch (e) {
    cacheFailure("Unable to fetch config pages", e)
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
  try {
    const menu = await graphqlClient().request<MenuQuery>(MenuDocument, {name})
    return (menu.menu?.items || []) as MenuItem[]
  } catch (e) {
    cacheFailure(`Unable to fetch the ${name?.toLowerCase() || "main"} menu`, e)
    return []
  }
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
    try {
      nodeQuery = await graphqlClient().request<AllNodesQuery>(AllNodesDocument, {
        first: 500,
        ...cursors,
      })
    } catch (e) {
      // A partial list would drop nodes from static generation and the sitemap, so fall back to none at all.
      cacheFailure("Unable to fetch all nodes", e)
      return []
    }
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

  // Only the per-book tag. Book pages render this to decide whether to link to excerpts, so a broad tag here would let
  // one invalidation mark every book page stale. Drupal sends `excerpts:<book uuid>` when an ancillary page is saved.
  cacheTag(`excerpts:${uuid}`)
  try {
    const ancillaryPages = await graphqlClient().request<SupBookAncillaryQuery>(SupBookAncillaryDocument, {
      contextualFilters: {uuid},
    })
    return (ancillaryPages.supBookAncillary?.results as NodeSupBookAncillary[]) || []
  } catch (e) {
    cacheFailure(`Unable to fetch excerpts for book ${uuid}`, e)
    return []
  }
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
