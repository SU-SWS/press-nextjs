"use cache: remote"

import {NodeInterface} from "@lib/gql/__generated__/drupal.d"
import {graphqlClient} from "@lib/gql/gql-client"
import {cacheTag} from "next/cache"

/**
 * The books view only honors specific page sizes. Asking for anything else silently falls back to a handful of
 * results per page, so this value cannot be tuned without checking the view configuration in Drupal.
 */
const PAGE_SIZE = 1000

export const getLegacyBookPaths = async () => {
  cacheTag("legacy-books")
  const nodes: Array<{uuid: number; path: NodeInterface["path"]}> = []

  // A single cheap request establishes how many pages there are. Cursor pagination forced every page to wait on the
  // one before it; the view exposes a total up front, so the pages can all be in flight at once.
  const countQuery = await graphqlClient().BooksWorkId({pageSize: 1})
  const total = countQuery.supBooksView?.pageInfo.total || 0
  const pages = Math.ceil(total / PAGE_SIZE)

  const results = await Promise.all(
    Array.from({length: pages}, (_, page) => graphqlClient().BooksWorkId({page, pageSize: PAGE_SIZE}))
  )

  results.forEach(result =>
    result.supBooksView?.results.forEach(node => {
      if (node.__typename !== "NodeSupBook" || !node.supBookWorkIdNumber) return
      nodes.push({uuid: node.supBookWorkIdNumber, path: node.path})
    })
  )

  return nodes
}

/**
 * How far past the highest known work id a lookup is still considered plausible. Work ids are assigned in a roughly
 * ascending sequence, so anything well beyond the current maximum belongs to no book and only exists to make the site
 * query Drupal.
 */
const WORK_ID_LOOKAHEAD = 5000

export const getNewBookPath = async (workId: string, suffix?: string): Promise<string | undefined> => {
  cacheTag("legacy-books")
  // Reject anything that is not a plain positive integer. This route is reachable unauthenticated through the
  // /books/title?id= rewrite, and every distinct value becomes its own cache entry.
  if (!/^\d{1,7}$/.test(workId)) return

  const requestedId = parseInt(workId)
  const legacyPaths = await getLegacyBookPaths()
  const legacyBook = legacyPaths.find(book => book.uuid === requestedId)
  if (legacyBook?.path) return legacyBook.path + (suffix || "")

  // Not in the cached mapping. It may be a book added since the last refresh, but only within reach of the ids we
  // already know about. Anything further out is not worth a Drupal round trip.
  const highestKnownId = legacyPaths.reduce((highest, book) => Math.max(highest, book.uuid), 0)
  if (requestedId > highestKnownId + WORK_ID_LOOKAHEAD) return

  // New work id, look up to see if one exists.
  const bookData = await graphqlClient().supBooks({
    filters: {work_id: requestedId},
  })
  if (bookData.supBooksView?.results[0]?.__typename === "NodeSupBook" && bookData.supBooksView.results[0].path)
    return bookData.supBooksView.results[0].path + (suffix || "")
}
