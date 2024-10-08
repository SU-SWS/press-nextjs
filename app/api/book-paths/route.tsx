import {NextResponse} from "next/server"
import {getLegacyBookPaths} from "@lib/utils/getLegacyBookPaths"

export const revalidate = 86400

export const GET = async () => {
  return NextResponse.json(await getLegacyBookPaths())
}
