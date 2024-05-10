import {HTMLAttributes, JSX} from "react";
import {graphqlClient} from "@lib/gql/gql-client";
import {BooksQuery, NodeSupBook} from "@lib/gql/__generated__/drupal";
import Link from "@components/elements/link";
import FilteringAuthorList from "@components/paragraphs/sup-author-list/filtering-author-list";

type Props = HTMLAttributes<HTMLDivElement>;

const SupAuthorListParagraph = async ({...props}: Props) => {
  // Fetch all the books, sort by authors, and then build pagination and side alpha selection.
  let fetchMore = true;
  let query: BooksQuery;
  let afterCursor = null;
  let books: NodeSupBook[] = [];

  while (fetchMore) {
    query = await graphqlClient({next: {tags: ["views:sup_books"]}}).Books({after: afterCursor})
    fetchMore = query.nodeSupBooks.pageInfo.hasNextPage
    afterCursor = query.nodeSupBooks.pageInfo.endCursor;
    books = [...books, ...query.nodeSupBooks.nodes as NodeSupBook[]];
  }

  const authors = new Map<string, JSX.Element[]>();

  books.map(book => {
    book.supBookAuthors?.map(author => {
      if (author.credentials && author.credentials.length > 0) {
        const authorName = ([author.family, author.given + " " + author.middle].filter(a => !!a).join(", ") + ` [${author.credentials}]`).trim()

        const authorsBooks = authors.get(authorName) || [];
        authors.set(authorName, [...authorsBooks, <Link className="block font-normal text-digital-red" key={book.id} prefetch={false} href={book.path}>{book.title}{book.supBookSubtitle && `: ${book.supBookSubtitle}`}</Link>]);
      }
    })
  })

  return (
    <FilteringAuthorList authors={authors} {...props}/>
  )
}
export default SupAuthorListParagraph;