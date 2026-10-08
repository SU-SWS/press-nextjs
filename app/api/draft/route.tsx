import {NextRequest, NextResponse} from "next/server"

/**
 * Legacy preview entry point. Forward Drupal's `/api/draft?secret=...&slug=...` link to `/preview`, where proxy.ts
 * checks the secret and the slug before sending the editor to the page.
 */
export const GET = (request: NextRequest) => {
  const destination = new URL("/preview", request.url)
  // Set the parameters rather than interpolating them so they are always escaped.
  destination.searchParams.set("secret", request.nextUrl.searchParams.get("secret") || "")
  destination.searchParams.set("slug", request.nextUrl.searchParams.get("slug") || "")

  const response = NextResponse.redirect(destination)
  // The url carries the preview secret, so keep it out of caches and outbound Referer headers.
  response.headers.set("Cache-Control", "no-store, max-age=0")
  response.headers.set("Referrer-Policy", "no-referrer")
  return response
}
