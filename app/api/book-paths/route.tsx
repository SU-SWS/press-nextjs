import {NextResponse} from "next/server"
import {getLegacyBookPaths} from "@lib/utils/getLegacyBookPaths"

// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 60

export const GET = async () => {
  return NextResponse.json(await getLegacyBookPaths())
}
