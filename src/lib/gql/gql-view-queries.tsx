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
} from "@lib/gql/__generated__/drupal.d"
import {graphqlClient} from "@lib/gql/gql-client"
import View from "@components/views/view"

export const loadViewPage = async (
  viewId: string,
  displayId: string,
  contextualFilter: string[],
  hasHeadline: boolean,
  page: number,
  filters?: InputMaybe<SupBooksAwardWinnersFilterInput>
): Promise<JSX.Element> => {
  "use server"

  const {items, totalItems} = await getViewItems(viewId, displayId, contextualFilter, filters, page)
  return (
    <View
      viewId={viewId}
      displayId={displayId}
      items={items}
      headingLevel={hasHeadline ? "h3" : "h2"}
      totalItems={totalItems}
    />
  )
}

export const getViewItems = cache(
  async (
    viewId: string,
    displayId: string,
    contextualFilter?: Maybe<string[]>,
    filters?: InputMaybe<SupBooksAwardWinnersFilterInput>,
    page: Maybe<number> = 0,
    limit?: Maybe<number>
  ): Promise<{items: NodeUnion[]; totalItems: number}> => {
    const {items, totalItems} = await getViewPagedItems(viewId, displayId, contextualFilter, 30, page, 0, filters)
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
    filters?: InputMaybe<SupBooksAwardWinnersFilterInput>
  ): Promise<{items: NodeUnion[]; totalItems: number}> => {
    let items: NodeUnion[] = []
    let totalItems = 0
    // View filters allow multiples of 3 for page sizes. If the user wants 4, we"ll fetch 6 and then slice it at the end.
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
        tags.push("views:sup_book")
        break
    }

    const client = graphqlClient({next: {tags}})
    let contextualFilters = getContextualFilters(["term_node_taxonomy_name_depth"], contextualFilter)
    let fieldFilters: Record<string, string | number | Array<string | number> | undefined> = {}
    let graphqlResponse

    try {
      switch (`${viewId}--${displayId}`) {
        case "stanford_basic_pages--basic_page_type_list":
        case "stanford_basic_pages--viewfield_block_1":
          contextualFilters = getContextualFilters(["term_node_taxonomy_name_depth"], contextualFilter)
          graphqlResponse = await client.stanfordBasicPages({contextualFilters, ...queryVariables})
          items = graphqlResponse.stanfordBasicPages?.results as unknown as NodeStanfordPage[]
          totalItems = graphqlResponse.stanfordBasicPages?.pageInfo.total || 0
          break

        case "stanford_courses--default_list_viewfield_block":
        case "stanford_courses--vertical_teaser_viewfield_block":
          graphqlResponse = await client.stanfordCourses({contextualFilters, ...queryVariables})
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
          graphqlResponse = await client.stanfordEvents({contextualFilters, ...queryVariables})
          items = graphqlResponse.stanfordEvents?.results as unknown as NodeStanfordEvent[]
          totalItems = graphqlResponse.stanfordEvents?.pageInfo.total || 0
          break

        case "stanford_events--past_events_list_block":
          graphqlResponse = await client.stanfordEventsPastEvents({contextualFilters, ...queryVariables})
          items = graphqlResponse.stanfordEventsPastEvents?.results as unknown as NodeStanfordEvent[]
          totalItems = graphqlResponse.stanfordEventsPastEvents?.pageInfo.total || 0
          break

        case "stanford_news--block_1":
        case "stanford_news--vertical_cards":
          graphqlResponse = await client.stanfordNews({contextualFilters, ...queryVariables})
          items = graphqlResponse.stanfordNews?.results as unknown as NodeStanfordNews[]
          totalItems = graphqlResponse.stanfordNews?.pageInfo.total || 0
          break

        case "stanford_person--grid_list_all":
          graphqlResponse = await client.stanfordPerson({contextualFilters, ...queryVariables})
          items = graphqlResponse.stanfordPerson?.results as unknown as NodeStanfordPerson[]
          totalItems = graphqlResponse.stanfordPerson?.pageInfo.total || 0
          break

        case "stanford_publications--apa_list":
        case "stanford_publications--chicago_list":
          graphqlResponse = await client.stanfordPublications({contextualFilters, ...queryVariables})
          items = graphqlResponse.stanfordPublications?.results as unknown as NodeStanfordPublication[]
          totalItems = graphqlResponse.stanfordPublications?.pageInfo.total || 0
          break

        case "stanford_shared_tags--card_grid":
          contextualFilters = getContextualFilters(["term_node_taxonomy_name_depth", "type"], contextualFilter)
          graphqlResponse = await client.stanfordSharedTags({contextualFilters, ...queryVariables})
          items = graphqlResponse.stanfordSharedTags?.results as unknown as NodeUnion[]
          totalItems = graphqlResponse.stanfordSharedTags?.pageInfo.total || 0
          break

        case "sup_books--new_releases":
          graphqlResponse = await client.supBooksNewReleases({...queryVariables})
          items = graphqlResponse.supBooksNewReleases?.results as unknown as NodeSupBook[]
          totalItems = graphqlResponse.supBooksNewReleases?.pageInfo.total || 0
          break

        case "sup_books--best_sellers":
          graphqlResponse = await client.supBooksBestSellers({...queryVariables})
          items = graphqlResponse.supBooksBestSellers?.results as unknown as NodeSupBook[]
          totalItems = graphqlResponse.supBooksBestSellers?.pageInfo.total || 0
          break

        case "sup_books--seasonal_list":
          fieldFilters = {season: contextualFilter?.[0]}
          contextualFilter = []

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
          graphqlResponse = await client.supBooks({contextualFilters, filters: fieldFilters, ...queryVariables})
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
          graphqlResponse = await client.supBooksAwardWinners({contextualFilters, filters, ...queryVariables})
          items = graphqlResponse.supBooksAwardWinners?.results as unknown as NodeSupBook[]
          totalItems = graphqlResponse.supBooksAwardWinners?.pageInfo.total || 0
          break

        default:
          console.warn(`Unable to find query for view: ${viewId} display: ${displayId}`)
          break
      }
    } catch (e) {
      if (e instanceof Error) console.warn(e.message)
      return {items: [], totalItems: 0}
    }
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
