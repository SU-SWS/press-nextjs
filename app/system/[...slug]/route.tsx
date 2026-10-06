import {NextRequest, NextResponse} from "next/server"
import {buildHeaders} from "@lib/drupal/utils"

export const GET = async (request: NextRequest) => {
  const headers = buildHeaders()

  const drupalFilePath = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + request.nextUrl.pathname
  const res = await fetch(drupalFilePath, {headers})

  // Missing and forbidden files both report 404, so crawlers stop requesting them and private file names aren't
  // confirmed to exist.
  if (res.status === 403 || res.status === 404) {
    return new NextResponse("File not found.", {status: 404})
  }

  if (!res.ok || !res.body) {
    console.warn(`Unable to fetch file at ${drupalFilePath}`)
    return new NextResponse("Unable to fetch file at this time.", {status: 500})
  }

  const filename = request.nextUrl.pathname.split("/").pop()
  const responseHeaders = new Headers({
    "Content-Disposition": `attachment; filename=${filename}`,
    "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
  })
  // fetch() decodes compressed bodies, so the upstream length only matches what's sent when there was no encoding.
  const contentLength = res.headers.get("Content-Length")
  if (contentLength && !res.headers.get("Content-Encoding")) responseHeaders.set("Content-Length", contentLength)

  // Stream the body through rather than buffering it with `res.blob()`, so memory use and time to first byte don't
  // grow with the file size.
  return new NextResponse(res.body, {status: 200, statusText: "OK", headers: responseHeaders})
}
