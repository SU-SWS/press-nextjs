import {BooksQuery} from "@lib/gql/__generated__/drupal";
import {graphqlClient} from "@lib/gql/gql-client";
import {notFound, redirect} from "next/navigation";

const LegacyBookPage = async ({searchParams}: { searchParams?: { [_key: string]: string } }) => {
  // Fetch all the books, sort by authors, and then build pagination and side alpha selection.
  let fetchMore = true;
  let query: BooksQuery;
  let afterCursor = null;
  let destinationUrl: string | undefined;

  if (!searchParams || !searchParams.id) notFound();
  const workId = parseInt(searchParams.id);

  while (fetchMore) {
    query = await graphqlClient({next: {tags: ["views:sup_books"]}}).Books({after: afterCursor})

    destinationUrl = query.nodeSupBooks.nodes.find(node => node.supBookWorkIdNumber && node.supBookWorkIdNumber === workId)?.path;

    fetchMore = query.nodeSupBooks.pageInfo.hasNextPage && !destinationUrl
    afterCursor = query.nodeSupBooks.pageInfo.endCursor;
  }
  if (destinationUrl) redirect(destinationUrl);
  notFound();
}

export default LegacyBookPage;