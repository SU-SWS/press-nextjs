import {cache, JSX} from "react"
import {
  InputMaybe,
  Maybe,
  NodeStanfordCourse,
  NodeStanfordEvent,
  NodeStanfordNews,
  NodeStanfordPage,
  NodeStanfordPerson,
  NodeStanfordPublication,
  NodeSupBook,
  NodeUnion,
  SupBooksAwardWinnersFilterInput,
  SupBooksViewSortKeys,
  StanfordBasicPagesDocument,
  StanfordBasicPagesQuery,
  StanfordCoursesDocument,
  StanfordCoursesQuery,
  StanfordEventsDocument,
  StanfordEventsQuery,
  StanfordEventsPastEventsDocument,
  StanfordEventsPastEventsQuery,
  StanfordNewsDocument,
  StanfordNewsQuery,
  StanfordPersonDocument,
  StanfordPersonQuery,
  StanfordPublicationsDocument,
  StanfordPublicationsQuery,
  StanfordSharedTagsDocument,
  StanfordSharedTagsQuery,
  SupBooksDocument,
  SupBooksQuery,
  SupBooksAwardWinnersDocument,
  SupBooksAwardWinnersQuery,
  SupBooksBestSellersDocument,
  SupBooksBestSellersQuery,
  SupBooksNewReleasesDocument,
  SupBooksNewReleasesQuery,
} from "@lib/gql/__generated__/graphql"
import {graphqlClient} from "@lib/gql/gql-client"
import View from "@components/views/view"
import {cacheLife, cacheTag} from "next/cache"
import {cacheFailure} from "@lib/gql/gql-queries"
import {verifyViewConfig} from "@lib/utils/view-config"

/** Every view display this site queries. Anything else is rejected before it reaches Drupal or the cache. */
const SUPPORTED_DISPLAYS = new Set([
  "stanford_basic_pages--basic_page_type_list",
  "stanford_basic_pages--viewfield_block_1",
  "stanford_courses--default_list_viewfield_block",
  "stanford_courses--vertical_teaser_viewfield_block",
  "stanford_events--cards",
  "stanford_events--list_page",
  "stanford_events--past_events_list_block",
  "stanford_news--block_1",
  "stanford_news--vertical_cards",
  "stanford_person--grid_list_all",
  "stanford_publications--apa_list",
  "stanford_publications--chicago_list",
  "stanford_shared_tags--card_grid",
  "sup_books--book_list",
  "sup_books--book_list_sortable",
  "sup_books--award_winners",
  "sup_books--seasonal_list",
  "sup_books--new_releases",
  "sup_books--best_sellers",
])

const SORT_KEYS = new Set<unknown>(Object.values(SupBooksViewSortKeys))
const MAX_PAGE = 100
const MAX_CONTEXTUAL_FILTERS = 5
const MAX_TEXT_LENGTH = 100

const toInt = (value: unknown, min: number, max: number) =>
  typeof value === "number" && Number.isFinite(value) ? Math.min(Math.max(Math.trunc(value), min), max) : undefined

/**
 * Server action that fetches one page of a Drupal view and renders it.
 *
 * Bound by list paragraphs to load subsequent pages on the client. Server actions are public POST endpoints that any
 * caller can send any arguments to, and every distinct argument set is a Drupal query and a cache entry. So the list's
 * configuration (view, display, contextual filters, headline) arrives signed by the server (see signViewConfig), and
 * only the page number, filters and sort come from the browser, all of which are validated.
 *
 * @param signedConfig - The list configuration from {@link signViewConfig}.
 * @param page - Zero-based page index to fetch.
 * @param filters - Award winner year range.
 * @param sort - Sort key for sortable book lists.
 * @returns A rendered `<View>` element for the requested page, or nothing for an invalid request.
 */
export const loadViewPage = async (
  signedConfig: string,
  page: number,
  filters?: InputMaybe<SupBooksAwardWinnersFilterInput>,
  sort?: InputMaybe<SupBooksViewSortKeys>
): Promise<JSX.Element> => {
  "use server"

  const config = verifyViewConfig(signedConfig)
  if (!config || !SUPPORTED_DISPLAYS.has(`${config.viewId}--${config.displayId}`)) return <></>

  const contextualFilter = Array.isArray(config.contextualFilter)
    ? config.contextualFilter
        .slice(0, MAX_CONTEXTUAL_FILTERS)
        .filter((value): value is string => typeof value === "string")
        .map(value => value.trim().slice(0, MAX_TEXT_LENGTH))
    : []

  // Only the award winners display takes a year range, and only its two known keys are kept.
  let cleanFilters: SupBooksAwardWinnersFilterInput | undefined
  if (config.displayId === "award_winners" && filters && typeof filters === "object") {
    const yearMin = toInt(filters.year_min, 0, 9999)
    const yearMax = toInt(filters.year_max, 0, 9999)
    cleanFilters = {}
    if (yearMin !== undefined) cleanFilters.year_min = yearMin
    if (yearMax !== undefined) cleanFilters.year_max = yearMax
  }

  const {items, totalItems} = await getViewItems(
    config.viewId,
    config.displayId,
    contextualFilter,
    toInt(page, 0, MAX_PAGE) ?? 0,
    undefined,
    cleanFilters,
    SORT_KEYS.has(sort) ? sort : undefined
  )
  return (
    <View
      viewId={config.viewId}
      displayId={config.displayId}
      items={items}
      headingLevel={config.hasHeadline ? "h3" : "h2"}
      totalItems={totalItems}
    />
  )
}

export const getViewItems = cache(
  async (
    viewId: string,
    displayId: string,
    contextualFilter?: Maybe<string[]>,
    page: Maybe<number> = 0,
    limit?: Maybe<number>,
    filters?: InputMaybe<SupBooksAwardWinnersFilterInput>,
    sort?: InputMaybe<SupBooksViewSortKeys>
  ): Promise<{items: NodeUnion[]; totalItems: number}> => {
    const {items, totalItems} = await getViewPagedItems(viewId, displayId, contextualFilter, 30, page, 0, filters, sort)
    if (limit) {
      return {items: items.slice(0, limit), totalItems}
    }
    return {items, totalItems}
  }
)

export const getViewPagedItems = cache(
  async (
    viewId: string,
    displayId: string,
    contextualFilter?: Maybe<string[]>,
    pageSize?: Maybe<number>,
    page?: Maybe<number>,
    offset?: Maybe<number>,
    filters?: InputMaybe<SupBooksAwardWinnersFilterInput>,
    sort?: InputMaybe<SupBooksViewSortKeys>
  ): Promise<{items: NodeUnion[]; totalItems: number}> => {
    "use cache: remote"
    let items: NodeUnion[] = []
    let totalItems = 0
    // View filters allow multiples of 3 for page sizes. If the user wants 4, we'll fetch 6 and then slice it at the end.
    const itemsPerPage = pageSize ? Math.min(Math.ceil(pageSize / 3) * 3, 99) : undefined
    const queryVariables = {pageSize: itemsPerPage, page, offset}

    const tags = ["views"]
    switch (`${viewId}--${displayId}`) {
      case "stanford_shared_tags--card_grid":
        tags.push("views:all")
        break

      case "stanford_basic_pages--basic_page_type_list":
      case "stanford_basic_pages--viewfield_block_1":
        tags.push("views:stanford_page")
        break

      case "stanford_courses--default_list_viewfield_block":
      case "stanford_courses--vertical_teaser_viewfield_block":
        tags.push("views:stanford_course")
        break

      case "stanford_events--cards":
      case "stanford_events--list_page":
      case "stanford_events--past_events_list_block":
        tags.push("views:stanford_event")
        break

      case "stanford_news--block_1":
      case "stanford_news--vertical_cards":
        tags.push("views:stanford_news")
        break

      case "stanford_person--grid_list_all":
        tags.push("views:stanford_person")
        break

      case "stanford_publications--apa_list":
      case "stanford_publications--chicago_list":
        tags.push("views:stanford_publication")
        break

      case "sup_books--book_list":
      case "sup_books--award_winners":
      case "sup_books--seasonal_list":
      case "sup_books--new_releases":
      case "sup_books--best_sellers":
      case "sup_books--book_list_sortable":
        tags.push("views:sup_book")
        break
    }

    cacheTag(...tags)

    const client = graphqlClient()
    let contextualFilters = getContextualFilters(["term_node_taxonomy_name_depth"], contextualFilter)
    let fieldFilters: Record<string, string | number | Array<string | number> | undefined> = {}
    let graphqlResponse

    try {
      switch (`${viewId}--${displayId}`) {
        case "stanford_basic_pages--basic_page_type_list":
        case "stanford_basic_pages--viewfield_block_1":
          contextualFilters = getContextualFilters(["term_node_taxonomy_name_depth"], contextualFilter)
          graphqlResponse = await client.request<StanfordBasicPagesQuery>(StanfordBasicPagesDocument, {
            contextualFilters,
            ...queryVariables,
          })
          items = graphqlResponse.stanfordBasicPages?.results as unknown as NodeStanfordPage[]
          totalItems = graphqlResponse.stanfordBasicPages?.pageInfo.total || 0
          break

        case "stanford_courses--default_list_viewfield_block":
        case "stanford_courses--vertical_teaser_viewfield_block":
          graphqlResponse = await client.request<StanfordCoursesQuery>(StanfordCoursesDocument, {
            contextualFilters,
            ...queryVariables,
          })
          items = graphqlResponse.stanfordCourses?.results as unknown as NodeStanfordCourse[]
          totalItems = graphqlResponse.stanfordCourses?.pageInfo.total || 0
          break

        case "stanford_events--cards":
        case "stanford_events--list_page":
          contextualFilters = getContextualFilters(
            [
              "term_node_taxonomy_name_depth",
              "term_node_taxonomy_name_depth_1",
              "term_node_taxonomy_name_depth_2",
              "term_node_taxonomy_name_depth_3",
            ],
            contextualFilter
          )
          graphqlResponse = await client.request<StanfordEventsQuery>(StanfordEventsDocument, {
            contextualFilters,
            ...queryVariables,
          })
          items = graphqlResponse.stanfordEvents?.results as unknown as NodeStanfordEvent[]
          totalItems = graphqlResponse.stanfordEvents?.pageInfo.total || 0
          break

        case "stanford_events--past_events_list_block":
          graphqlResponse = await client.request<StanfordEventsPastEventsQuery>(StanfordEventsPastEventsDocument, {
            contextualFilters,
            ...queryVariables,
          })
          items = graphqlResponse.stanfordEventsPastEvents?.results as unknown as NodeStanfordEvent[]
          totalItems = graphqlResponse.stanfordEventsPastEvents?.pageInfo.total || 0
          break

        case "stanford_news--block_1":
        case "stanford_news--vertical_cards":
          graphqlResponse = await client.request<StanfordNewsQuery>(StanfordNewsDocument, {
            contextualFilters,
            ...queryVariables,
          })
          items = graphqlResponse.stanfordNews?.results as unknown as NodeStanfordNews[]
          totalItems = graphqlResponse.stanfordNews?.pageInfo.total || 0
          break

        case "stanford_person--grid_list_all":
          graphqlResponse = await client.request<StanfordPersonQuery>(StanfordPersonDocument, {
            contextualFilters,
            ...queryVariables,
          })
          items = graphqlResponse.stanfordPerson?.results as unknown as NodeStanfordPerson[]
          totalItems = graphqlResponse.stanfordPerson?.pageInfo.total || 0
          break

        case "stanford_publications--apa_list":
        case "stanford_publications--chicago_list":
          graphqlResponse = await client.request<StanfordPublicationsQuery>(StanfordPublicationsDocument, {
            contextualFilters,
            ...queryVariables,
          })
          items = graphqlResponse.stanfordPublications?.results as unknown as NodeStanfordPublication[]
          totalItems = graphqlResponse.stanfordPublications?.pageInfo.total || 0
          break

        case "stanford_shared_tags--card_grid":
          contextualFilters = getContextualFilters(["term_node_taxonomy_name_depth", "type"], contextualFilter)
          graphqlResponse = await client.request<StanfordSharedTagsQuery>(StanfordSharedTagsDocument, {
            contextualFilters,
            ...queryVariables,
          })
          items = graphqlResponse.stanfordSharedTags?.results as unknown as NodeUnion[]
          totalItems = graphqlResponse.stanfordSharedTags?.pageInfo.total || 0
          break

        case "sup_books--new_releases":
          graphqlResponse = await client.request<SupBooksNewReleasesQuery>(SupBooksNewReleasesDocument, {
            ...queryVariables,
          })
          items = graphqlResponse.supBooksNewReleases?.results as unknown as NodeSupBook[]
          totalItems = graphqlResponse.supBooksNewReleases?.pageInfo.total || 0
          break

        case "sup_books--best_sellers":
          graphqlResponse = await client.request<SupBooksBestSellersQuery>(SupBooksBestSellersDocument, {
            ...queryVariables,
          })
          items = graphqlResponse.supBooksBestSellers?.results as unknown as NodeSupBook[]
          totalItems = graphqlResponse.supBooksBestSellers?.pageInfo.total || 0
          break

        case "sup_books--seasonal_list":
          fieldFilters = {season: contextualFilter?.[0]}
          contextualFilter = []

        case "sup_books--book_list_sortable":
        case "sup_books--book_list":
          contextualFilters = getContextualFilters(
            [
              "term_node_taxonomy_name_depth",
              "term_node_taxonomy_name_depth_2",
              "term_node_taxonomy_name_depth_1",
              "term_node_taxonomy_name_depth_3",
              "sup_book_work_id_number_value",
            ],
            contextualFilter
          )
          graphqlResponse = await client.request<SupBooksQuery>(SupBooksDocument, {
            contextualFilters,
            filters: fieldFilters,
            sortKey: sort,
            ...queryVariables,
          })
          items = graphqlResponse.supBooksView?.results as unknown as NodeSupBook[]
          totalItems = graphqlResponse.supBooksView?.pageInfo.total || 0
          break

        case "sup_books--award_winners":
          contextualFilters = getContextualFilters(
            [
              "term_node_taxonomy_name_depth",
              "term_node_taxonomy_name_depth_2",
              "term_node_taxonomy_name_depth_1",
              "term_node_taxonomy_name_depth_3",
              "sup_book_work_id_number_value",
            ],
            contextualFilter
          )
          graphqlResponse = await client.request<SupBooksAwardWinnersQuery>(SupBooksAwardWinnersDocument, {
            contextualFilters,
            filters,
            ...queryVariables,
          })
          items = graphqlResponse.supBooksAwardWinners?.results as unknown as NodeSupBook[]
          totalItems = graphqlResponse.supBooksAwardWinners?.pageInfo.total || 0
          break

        default:
          console.warn(`Unable to find query for view: ${viewId} display: ${displayId}`)
          break
      }
    } catch (e) {
      cacheFailure(`Unable to fetch view ${viewId}--${displayId}`, e)
      return {items: [], totalItems: 0}
    }

    // A visitor's year range choices have too many combinations to keep forever: cache them for hours.
    if (filters?.year_min || filters?.year_max) cacheLife("hours")
    return {items, totalItems}
  }
)

const getContextualFilters = (
  keys: string[],
  values?: Maybe<string[]>,
  defaults: Record<string, string | undefined> = {}
) => {
  if (!keys || !values) return
  const filters: Record<string, string | undefined> = keys.reduce(
    (obj, key, index) => ({
      ...obj,
      [key]: values[index]?.trim(),
    }),
    {}
  )
  Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key])
  return {...defaults, ...filters}
}
