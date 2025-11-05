import {revalidateTag} from "next/cache"
import {NextRequest, NextResponse} from "next/server"

export const GET = async (req: NextRequest) => {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {status: 401})
  }
  revalidateTag("legacy-books", "max")
  return NextResponse.json({ok: true})
}
