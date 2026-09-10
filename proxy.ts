import {NextResponse} from "next/server"
import type {NextRequest} from "next/server"
import {parseBasicAuth, secretMatches} from "@lib/utils/request-guards"

export const proxy = (req: NextRequest) => {
  const pathname = req.nextUrl.pathname

  if (pathname.startsWith("/preview")) {
    if (!secretMatches(req.cookies.get("preview")?.value, process.env.DRUPAL_PREVIEW_SECRET)) {
      return NextResponse.rewrite(new URL("/404", req.url))
    }
    return NextResponse.next()
  }

  if (!isAuthenticated(req)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {"WWW-Authenticate": "Basic"},
    })
  }

  return NextResponse.next()
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
