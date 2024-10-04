import {Maybe, NodeSupBook} from "@lib/gql/__generated__/drupal"
import {graphqlClient} from "@lib/gql/gql-client"
import {unstable_cache as nextCache} from "next/cache"

export const getBookPathFromWorkId = nextCache(
  async (workId: number): Promise<string | undefined> => {
    const contextualFilters = {
      term_node_taxonomy_name_depth: '""',
      term_node_taxonomy_name_depth_2: '""',
      term_node_taxonomy_name_depth_1: '""',
      term_node_taxonomy_name_depth_3: '""',
      sup_book_work_id_number_value: `${workId}`,
    }

    const graphqlResponse = await graphqlClient({cache: "no-store"}).supBooks({contextualFilters})
    const book = graphqlResponse.supBooksView?.results.pop() as Maybe<NodeSupBook>
    return book?.path
  },
  ["legacy-book"],
  {tags: ["legacy-books"]}
)
