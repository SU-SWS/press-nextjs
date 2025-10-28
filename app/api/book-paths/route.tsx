import {NextResponse} from "next/server"
import {getLegacyBookPaths} from "@lib/utils/getLegacyBookPaths"

export const revalidate = 31536000
export const maxDuration = 60

export const GET = async () => {
  return NextResponse.json(await getLegacyBookPaths())
}
