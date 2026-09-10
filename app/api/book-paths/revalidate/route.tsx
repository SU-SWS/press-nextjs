import {revalidateTag} from "next/cache"
import {NextRequest, NextResponse} from "next/server"
import {bearerMatches} from "@lib/utils/request-guards"

export const GET = async (req: NextRequest) => {
  if (!bearerMatches(req.headers.get("authorization"), process.env.CRON_SECRET)) {
    return new Response("Unauthorized", {status: 401})
  }
  revalidateTag("legacy-books", "max")
  return NextResponse.json({ok: true})
}
