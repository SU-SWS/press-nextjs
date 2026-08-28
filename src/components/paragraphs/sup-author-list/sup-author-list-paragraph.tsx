import {HTMLAttributes, Suspense} from "react"
import {graphqlClient} from "@lib/gql/gql-client"
import {NodeSupBook} from "@lib/gql/__generated__/drupal.d"
import FilteringAuthorList from "@components/paragraphs/sup-author-list/filtering-author-list"
import {cacheLife, cacheTag} from "next/cache"
import * as DrupalTypes from "@lib/gql/__generated__/drupal.d"

type Props = HTMLAttributes<HTMLDivElement>

export type AuthorBook = Pick<NodeSupBook, "uuid" | "path" | "title" | "supBookSubtitle">

const getBookAuthorsData = async () => {
  "use cache: remote"
  cacheTag("author-list")
  cacheLife("months")

  const pageSize = 1000
  const firstPage = await graphqlClient().BooksAuthors({pageSize, page: 0})
  const total = firstPage.supBooksView?.pageInfo.total || 0
  const pages = Math.ceil(total / pageSize)
  const requests: Array<Promise<DrupalTypes.BooksAuthorsQuery>> = []
  for (let page = 0; page < pages; page++) {
    requests.push(graphqlClient().BooksAuthors({pageSize, page}))
  }
  const results = await Promise.all(requests)
  return results.flatMap(result => (result.supBooksView?.results || []) as NodeSupBook[])
}

const SupAuthorListParagraph = async ({...props}: Props) => {
  const books = await getBookAuthorsData()
  const authors = new Map<string, AuthorBook[]>()

  books.forEach(book => {
    book.supBookAuthors?.forEach(author => {
      if (author.credentials && author.credentials.length > 0) {
        const authorName = (
          [author.family, author.given + " " + author.middle].filter(a => !!a).join(", ") + ` [${author.credentials}]`
        ).trim()

        const newBook: AuthorBook = {
          uuid: book.uuid,
          path: book.path,
          title: book.title,
          supBookSubtitle: book.supBookSubtitle,
        }

        const authorsBooks = authors.get(authorName) || []
        authorsBooks.push(newBook)
        authors.set(authorName, authorsBooks)
      }
    })
  })

  return (
    <Suspense>
      <FilteringAuthorList authors={authors} {...props} />
    </Suspense>
  )
}
export default SupAuthorListParagraph
