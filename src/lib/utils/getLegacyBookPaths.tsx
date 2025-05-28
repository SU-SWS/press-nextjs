import {BooksWorkIdQuery, BooksWorkIdQueryVariables, NodeInterface} from "@lib/gql/__generated__/drupal.d"
import {graphqlClient} from "@lib/gql/gql-client"
import {unstable_cache as nextCache} from "next/cache"
import {cache} from "react"

export const getLegacyBookPaths = cache(
  nextCache(
    async () => {
      const nodes: Array<{id: number; path: NodeInterface["path"]}> = []
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
)

export const getNewBookPath = nextCache(
  async (workId: string, suffix?: string): Promise<string | undefined> => {
    if (!/^-?\d+(\.\d+)?$/.test(workId)) {
      return
    }
    const legacyPaths = await getLegacyBookPaths()
    const legacyBook = legacyPaths.find(book => book.id === parseInt(workId))
    if (legacyBook?.path) return legacyBook.path + (suffix || "")

    // New work id, look up to see if one exists.
    const bookData = await graphqlClient({cache: "no-cache"}).supBooks({filters: {work_id: parseInt(workId)}})
    if (bookData.supBooksView?.results[0]?.__typename === "NodeSupBook" && bookData.supBooksView.results[0].path)
      return bookData.supBooksView.results[0].path + (suffix || "")
  },
  [],
  {tags: ["legacy-books"]}
)
