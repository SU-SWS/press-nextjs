import {NextResponse} from "next/server"
import {getLegacyBookPaths} from "@lib/utils/getLegacyBookPaths"

// Kept at 60s: a cold cache walks every book in pages of 1000, each with its own 10s timeout.
// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 60

export const GET = async () => {
  return NextResponse.json(await getLegacyBookPaths())
}
