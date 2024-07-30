import {NodeSupBook} from "@lib/gql/__generated__/drupal"
import {graphqlClient} from "@lib/gql/gql-client"

export const getBookFromWorkId = async (workId: number): Promise<NodeSupBook | undefined> => {
  const contextualFilters = {
    term_node_taxonomy_name_depth: '""',
    term_node_taxonomy_name_depth_2: '""',
    term_node_taxonomy_name_depth_1: '""',
    term_node_taxonomy_name_depth_3: '""',
    sup_book_work_id_number_value: `${workId}`,
  }

  const graphqlResponse = await graphqlClient().supBooks({contextualFilters})
  return graphqlResponse.supBooksView?.results.pop() as NodeSupBook
}
