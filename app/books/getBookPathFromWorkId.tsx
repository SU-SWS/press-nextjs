import {BooksWorkIdQuery, BooksWorkIdQueryVariables, Maybe, NodeSupBook} from "@lib/gql/__generated__/drupal"
import {graphqlClient} from "@lib/gql/gql-client"
import {unstable_cache as nextCache} from "next/cache"

export const getBookPathFromWorkId = nextCache(
  async (workId: number): Promise<string | undefined> => {
    const contextualFilters = {
      term_node_taxonomy_name_depth: '""',
      term_node_taxonomy_name_depth_2: '""',
      term_node_taxonomy_name_depth_1: '""',
      term_node_taxonomy_name_depth_3: '""',
      sup_book_work_id_number_value: workId.toString(),
    }

    const graphqlResponse = await graphqlClient({cache: "no-cache"}).supBooks({contextualFilters})
    const book = graphqlResponse.supBooksView?.results.pop() as Maybe<NodeSupBook>
    return book?.path
  },
  ["legacy-book"],
  {tags: ["legacy-books"]}
)

export const getAllLegacyPaths = nextCache(
  async () => {
    const nodes: Array<{id: number; path: string}> = []
    let fetchMore = true
    let nodeQuery: BooksWorkIdQuery
    const cursors: Omit<BooksWorkIdQueryVariables, "first"> = {}

    while (fetchMore) {
      nodeQuery = await graphqlClient({cache: "no-cache"}).BooksWorkId({first: 1000, ...cursors})
      nodeQuery.nodeSupBooks.nodes
        .filter(node => !!node.supBookWorkIdNumber)
        .map(node =>
          nodes.push({
            id: node.supBookWorkIdNumber as number,
            path: node.path,
          })
        )
      cursors.after = nodeQuery.nodeSupBooks.pageInfo.endCursor
      fetchMore = nodeQuery.nodeSupBooks.pageInfo.hasNextPage
    }

    return nodes
  },
  [],
  {tags: ["legacy-books"]}
)
