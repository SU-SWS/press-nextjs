import {HTMLAttributes} from "react"
import {graphqlClient} from "@lib/gql/gql-client"
import {BooksAuthorsQuery, NodeSupBook} from "@lib/gql/__generated__/drupal.d"
import FilteringAuthorList from "@components/paragraphs/sup-author-list/filtering-author-list"
import {unstable_cache as nextCache} from "next/cache"

type Props = HTMLAttributes<HTMLDivElement>

const getBookAuthorsData = nextCache(
  async () => {
    // Fetch all the books, sort by authors, and then build pagination and side alpha selection.
    let fetchMore = true
    let query: BooksAuthorsQuery
    let afterCursor = null
    let books: NodeSupBook[] = []

    while (fetchMore) {
      try {
        query = await graphqlClient({
          cache: "no-cache",
          signal: AbortSignal.timeout(5000),
        }).BooksAuthors({after: afterCursor})
        fetchMore = query.nodeSupBooks.pageInfo.hasNextPage
        afterCursor = query.nodeSupBooks.pageInfo.endCursor
        books = [...books, ...(query.nodeSupBooks.nodes as NodeSupBook[])]
      } catch (e) {
        if (e instanceof Error) console.warn(e.message)
        fetchMore = false
      }
    }
    return books.filter(book => !!book.supBookAuthors)
  },
  ["author-list"],
  {revalidate: 60 * 60 * 24 * 30, tags: ["author-list"]}
)

const SupAuthorListParagraph = async ({...props}: Props) => {
  const books = await getBookAuthorsData()
  const authors = new Map<string, [NodeSupBook]>()

  books.map(book => {
    book.supBookAuthors?.map(author => {
      if (author.credentials && author.credentials.length > 0) {
        const authorName = (
          [author.family, author.given + " " + author.middle].filter(a => !!a).join(", ") + ` [${author.credentials}]`
        ).trim()

        const newBook = {
          id: book.id,
          path: book.path,
          title: book.title,
          supBookSubtitle: book.supBookSubtitle,
        } as NodeSupBook

        const authorsBooks = authors.get(authorName) || ([] as unknown as [NodeSupBook])
        authorsBooks.push(newBook)
        authors.set(authorName, authorsBooks)
      }
    })
  })

  return <FilteringAuthorList authors={authors} {...props} />
}
export default SupAuthorListParagraph
