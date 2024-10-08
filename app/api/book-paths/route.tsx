import {NextRequest, NextResponse} from "next/server"
import {revalidateTag, unstable_cache as nextCache} from "next/cache"
import {getEntityFromPath} from "@lib/gql/gql-queries"
import {getLegacyBookPaths} from "@lib/utils/getLegacyBookPaths"

export const revalidate = 86400

export const GET = async () => {
  return NextResponse.json(await getLegacyBookPaths())
}
