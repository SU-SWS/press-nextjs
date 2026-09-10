import {NextRequest, NextResponse} from "next/server"
import {revalidatePath} from "next/cache"
import {secretMatches} from "@lib/utils/request-guards"

export const GET = async (request: NextRequest) => {
  const secret = request.nextUrl.searchParams.get("secret")
  if (!secretMatches(secret, process.env.DRUPAL_REVALIDATE_SECRET))
    return NextResponse.json({message: "Invalid token"}, {status: 403})

  const path = request.nextUrl.searchParams.get("slug")
  if (!path || path.startsWith("/node/")) return NextResponse.json({message: "Invalid slug"}, {status: 400})
  revalidatePath(path)

  return NextResponse.json({revalidated: true, path})
}
