import {NextResponse} from "next/server"
import type {NextRequest} from "next/server"
import {parseBasicAuth, secretMatches} from "@lib/utils/request-guards"

// Draft content must never be indexed or held in a shared cache, and the preview url carries the shared secret in its
// query string, so keep that url out of any outbound Referer header.
const PREVIEW_HEADERS: Record<string, string> = {
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Cache-Control": "no-store, max-age=0",
}

export const proxy = (req: NextRequest) => {
  const pathname = req.nextUrl.pathname

  if (pathname.startsWith("/preview")) return handlePreview(req)

  if (!isAuthenticated(req)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {"WWW-Authenticate": "Basic"},
    })
  }

  return NextResponse.next()
}

/**
 * Gate the editor preview routes on the secret shared with Drupal.
 *
 * Every response here is a dead end for crawlers and caches, and an unauthorized request is rewritten to the 404 page
 * rather than redirected so it is indistinguishable from a missing page.
 */
const handlePreview = (req: NextRequest) => {
  const notFound = () => withPreviewHeaders(NextResponse.rewrite(new URL("/404", req.url)))

  // Fail closed. Without a configured secret there is nothing to authorize against.
  if (!process.env.DRUPAL_PREVIEW_SECRET) {
    console.error("DRUPAL_PREVIEW_SECRET is not set. Preview routes are disabled.")
    return notFound()
  }

  const secret = req.nextUrl.searchParams.get("secret")
  if (!secretMatches(secret, process.env.DRUPAL_PREVIEW_SECRET)) return notFound()

  // Drupal links to `/preview?secret=...&slug=/path`. Send the editor to the page with the secret carried along.
  if (req.nextUrl.pathname === "/preview") {
    const slug = req.nextUrl.searchParams.get("slug")
    if (!isSafePreviewSlug(slug)) return notFound()

    const destination = new URL(`/preview${slug}`, req.url)
    // Set the parameter rather than interpolating it so the secret is always escaped.
    destination.searchParams.set("secret", secret)
    return withPreviewHeaders(NextResponse.redirect(destination))
  }

  return withPreviewHeaders(NextResponse.next())
}

const withPreviewHeaders = (response: NextResponse) => {
  Object.entries(PREVIEW_HEADERS).forEach(([header, value]) => response.headers.set(header, value))
  return response
}

/**
 * Drupal sends the page to preview as a `slug` query parameter, which is pasted straight into the redirect location.
 * Accept only a plain, relative path: an authority (`//host`), a backslash (which some browsers normalize to `/`), or a
 * `..` segment would all walk the editor off `/preview` and carry the secret along in the query string. The decoded
 * form is checked too, so a `%2e%2e` or `%5c` cannot smuggle the same characters past these checks.
 */
const isSafePreviewSlug = (slug: string | null): slug is string => {
  if (!slug) return false

  let decoded: string
  try {
    decoded = decodeURIComponent(slug)
  } catch {
    // Malformed percent encoding.
    return false
  }

  return [slug, decoded].every(
    value =>
      value.startsWith("/") &&
      !value.startsWith("//") &&
      !value.includes("\\") &&
      !value.includes("?") &&
      !value.includes("#") &&
      !value.split("/").includes("..")
  )
}

const isAuthenticated = (req: NextRequest) => {
  const credentials = parseBasicAuth(req.headers.get("authorization") || req.headers.get("Authorization"))

  if (!credentials) return false
  const {user, pass} = credentials

  // Check for cache-clear specific route
  if (req.nextUrl.pathname.startsWith("/system/cache-clear")) {
    return checkCacheClearAuth(user, pass)
  }

  const acceptedCredentials = process.env.HTTP_BASIC_AUTH?.split("|").map(cred => cred.split(":")) || []
  return !!acceptedCredentials.find(
    creds =>
      req.nextUrl.pathname.indexOf(`/${creds[0]}/`) > 0 &&
      secretMatches(user, creds[1]) &&
      secretMatches(pass, creds[2])
  )
}

export const checkCacheClearAuth = (username: string, password: string): boolean => {
  const validUsername = process.env.CACHE_CLEAR_USERNAME
  const validPassword = process.env.CACHE_CLEAR_PASSWORD

  if (!validUsername || !validPassword) {
    console.error("CACHE_CLEAR_USERNAME or CACHE_CLEAR_PASSWORD not set")
    return false
  }

  return secretMatches(username, validUsername) && secretMatches(password, validPassword)
}

// Step 3. Configure "Matching Paths" below to protect routes with HTTP Basic Auth
export const config = {
  matcher: ["/preview/:path*", "/system/:path*"],
}
