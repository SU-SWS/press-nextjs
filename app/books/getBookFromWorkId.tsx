import {BooksQuery, NodeSupBook} from "@lib/gql/__generated__/drupal";
import {graphqlClient} from "@lib/gql/gql-client";

export const getBookFromWorkId = async (workId: number): Promise<NodeSupBook | undefined> => {
  let fetchMore = true;
  let query: BooksQuery;
  let afterCursor = null;
  let desiredNode: NodeSupBook | undefined;
  while (fetchMore) {
    query = await graphqlClient({next: {tags: ["views:sup_books"]}}).Books({after: afterCursor})

    desiredNode = query.nodeSupBooks.nodes.find(node => node.supBookWorkIdNumber === workId) as NodeSupBook | undefined;

    fetchMore = query.nodeSupBooks.pageInfo.hasNextPage && !desiredNode
    afterCursor = query.nodeSupBooks.pageInfo.endCursor;
  }
  return desiredNode;
}
