import {BooksWorkIdQuery, BooksWorkIdQueryVariables} from "@lib/gql/__generated__/drupal.d"
import {graphqlClient} from "@lib/gql/gql-client"
import {unstable_cache as nextCache} from "next/cache"

export const getLegacyBookPaths = nextCache(
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
