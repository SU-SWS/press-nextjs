import {NextRequest, NextResponse} from "next/server"
import {buildHeaders} from "@lib/drupal/utils"
import {getAccessToken} from "@lib/drupal/get-access-token"

export const revalidate = 0

export const GET = async (request: NextRequest) => {
  const accessToken = await getAccessToken(true)
  const headers = await buildHeaders({accessToken})

  const res = await fetch(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + request.nextUrl.pathname, {
    headers,
    cache: "no-cache",
  })

  if (!res.ok) {
    return NextResponse.json({message: "Unauthorized"}, {status: 401})
  }

  const filename = request.nextUrl.pathname.split("/").pop()
  return new NextResponse(await res.blob(), {
    status: 200,
    statusText: "OK",
    headers: {
      "Content-Disposition": `attachment; filename=${filename}`,
      "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
    },
  })
}
