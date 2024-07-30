import Wysiwyg from "@components/elements/wysiwyg"
import View from "@components/views/view"
import {H2} from "@components/elements/headers"
import {cache, ElementType, HtmlHTMLAttributes, JSX} from "react"
import {
  Maybe,
  NodeStanfordCourse,
  NodeStanfordEvent,
  NodeStanfordNews,
  NodeStanfordPage,
  NodeStanfordPerson,
  NodeStanfordPublication,
  NodeSupBook,
  NodeUnion,
  ParagraphStanfordList,
} from "@lib/gql/__generated__/drupal.d"
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors"
import {graphqlClient} from "@lib/gql/gql-client"
import {twMerge} from "tailwind-merge"
import Link from "@components/elements/link"
import {ArrowRightIcon} from "@heroicons/react/16/solid"
import {ListParagraphBehaviors} from "@lib/drupal/drupal-jsonapi.d"
import clsx from "clsx"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordList
}

const loadPage = async (
  viewId: string,
  displayId: string,
  contextualFilter: string[],
  hasHeadline: boolean,
  page: number
): Promise<JSX.Element> => {
  "use server"

  const {items, totalItems} = await getViewItems(viewId, displayId, contextualFilter, page)
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

const ListParagraph = async ({paragraph, ...props}: Props) => {
  const behaviors = getParagraphBehaviors<ListParagraphBehaviors>(paragraph)
  const viewId = paragraph.suListView?.view
  const displayId = paragraph.suListView?.display
  const {items: viewItems, totalItems} =
    viewId && displayId
      ? await getViewItems(viewId, displayId, paragraph.suListView?.contextualFilter, 0, paragraph.suListView?.pageSize)
      : {items: [], totalItems: 0}
  const addLoadMore = (paragraph.suListView?.pageSize || 3) > 99

  if (behaviors.list_paragraph?.hide_empty && viewItems.length === 0) return null

  const ListWrapper: ElementType =
    paragraph.suListHeadline && behaviors.list_paragraph?.heading_behavior !== "remove" ? "section" : "div"

  return (
    <ListWrapper
      {...props}
      className={twMerge(
        "rs-mb-4 centered flex flex-col gap-10 border-t border-press-sand pt-14",
        clsx({
          "border-0": !paragraph.suListHeadline,
        }),
        props.className
      )}
      aria-labelledby={ListWrapper === "section" ? paragraph.id : undefined}
    >
      <div className="flex w-full flex-col justify-between @3xl:flex-row">
        <div className="flex max-w-1000 flex-col">
          {ListWrapper === "section" && (
            <H2
              id={paragraph.id}
              className={twMerge(
                "mb-0 pb-0 font-medium",
                behaviors.list_paragraph?.heading_behavior === "hide" && "sr-only"
              )}
            >
              {paragraph.suListHeadline}
            </H2>
          )}

          {paragraph.supListEyebrow && (
            <div className="rs-mb-neg2 type-0 order-first text-press-sand-dark">{paragraph.supListEyebrow}</div>
          )}
        </div>

        {paragraph.suListButton?.url && (
          <Link href={paragraph.suListButton.url} className="mt-auto flex items-center gap-5 text-archway-dark">
            {paragraph.suListButton.title}
            <ArrowRightIcon width={20} />
          </Link>
        )}
      </div>

      <Wysiwyg className="max-w-1000" html={paragraph.suListDescription?.processed} />

      {viewId && displayId && viewItems && (
        <div className="mx-auto max-w-[1600px]">
          <View
            viewId={viewId}
            displayId={displayId}
            items={viewItems}
            headingLevel={paragraph.suListHeadline ? "h3" : "h2"}
            loadPage={
              addLoadMore
                ? loadPage.bind(
                    null,
                    viewId,
                    displayId,
                    paragraph.suListView?.contextualFilter || [],
                    !!paragraph.suListHeadline
                  )
                : undefined
            }
            totalItems={totalItems}
          />
        </div>
      )}

      {viewItems.length === 0 && behaviors.list_paragraph?.empty_message && (
        <p>{behaviors.list_paragraph.empty_message}</p>
      )}
    </ListWrapper>
  )
}

const getViewItems = cache(
  async (
    viewId: string,
    displayId: string,
    contextualFilter?: Maybe<string[]>,
    page: Maybe<number> = 0,
    limit?: Maybe<number>
  ): Promise<{items: NodeUnion[]; totalItems: number}> => {
    const {items, totalItems} = await getViewPagedItems(viewId, displayId, contextualFilter, 30, page)
    if (limit) {
      return {items: items.slice(0, limit), totalItems}
    }
    return {items, totalItems}
  }
)

const getViewPagedItems = cache(
  async (
    viewId: string,
    displayId: string,
    contextualFilter?: Maybe<string[]>,
    pageSize?: Maybe<number>,
    page?: Maybe<number>,
    offset?: Maybe<number>
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
        tags.push("views:sup_book")
        break
    }

    const client = graphqlClient({next: {tags}})
    let contextualFilters = getContextualFilters(["term_node_taxonomy_name_depth"], contextualFilter)
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
          graphqlResponse = await client.supBooks({contextualFilters, ...queryVariables})
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
          graphqlResponse = await client.supBooksAwardWinners({contextualFilters, ...queryVariables})
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

export default ListParagraph
