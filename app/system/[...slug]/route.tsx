import {NextRequest, NextResponse} from "next/server"
import {buildHeaders} from "@lib/drupal/utils"

export const revalidate = 0

export const GET = async (request: NextRequest) => {
  const headers = buildHeaders()

  const drupalFilePath = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + request.nextUrl.pathname
  const res = await fetch(drupalFilePath, {headers, cache: "no-cache"})

  if (!res.ok) {
    console.warn(`Unable to fetch file at ${drupalFilePath}`)
    return new NextResponse("Unable to fetch file at this time.", {status: 500})
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
