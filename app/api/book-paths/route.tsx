import {NextResponse} from "next/server"
import {getLegacyBookPaths} from "@lib/utils/getLegacyBookPaths"

// Kept at 60s: a cold cache walks every book in pages of 1000, each with its own 10s timeout.
// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 60

// The payload is a ~300KB dump of public book urls. Without a CDN window every caller pays for a function invocation
// and the full egress. The cron at /api/book-paths/revalidate refreshes the underlying data twice a week.
const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400"

export const GET = async () => {
  return NextResponse.json(await getLegacyBookPaths(), {headers: {"Cache-Control": CACHE_CONTROL}})
}
