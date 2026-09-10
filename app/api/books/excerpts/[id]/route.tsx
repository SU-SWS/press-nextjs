import {NextRequest, NextResponse} from "next/server"
import {getBookAncillaryContents} from "@lib/gql/gql-queries"
import {isUuid} from "@lib/utils/request-guards"

// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 15

// Ancillary pages change rarely. Letting the CDN answer keeps this off the function budget: it is requested by every
// book page view. On demand revalidation cannot purge a CDN response, so staleness is bounded by s-maxage instead.
const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400"

export const GET = async (_request: NextRequest, {params}: {params: Promise<{id: string}>}) => {
  const bookId = (await params).id

  // Reject malformed ids before the lookup. Each distinct id is its own cache entry and its own Drupal query.
  if (!isUuid(bookId)) return NextResponse.json({message: "Invalid book id"}, {status: 400})

  return NextResponse.json(await getBookAncillaryContents(bookId), {headers: {"Cache-Control": CACHE_CONTROL}})
}
