import {NextResponse} from "next/server"
import type {NextRequest} from "next/server"

export const proxy = (req: NextRequest) => {
  if (!isAuthenticated(req)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {"WWW-Authenticate": "Basic"},
    })
  }

  return NextResponse.next()
}

const isAuthenticated = (req: NextRequest) => {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")

  if (!authHeader) return false

  const [user, pass] = Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":")

  // Check for cache-clear specific route
  if (req.nextUrl.pathname.startsWith("/system/cache-clear")) {
    return checkCacheClearAuth(user, pass)
  }

  const acceptedCredentials = process.env.HTTP_BASIC_AUTH?.split("|").map(cred => cred.split(":")) || []
  return !!acceptedCredentials.find(
    creds => req.nextUrl.pathname.indexOf(`/${creds[0]}/`) > 0 && creds[1] === user && creds[2] === pass
  )
}

export const checkCacheClearAuth = (username: string, password: string): boolean => {
  const validUsername = process.env.CACHE_CLEAR_USERNAME
  const validPassword = process.env.CACHE_CLEAR_PASSWORD

  if (!validUsername || !validPassword) {
    console.error("CACHE_CLEAR_USERNAME or CACHE_CLEAR_PASSWORD not set")
    return false
  }

  return username === validUsername && password === validPassword
}

// Step 3. Configure "Matching Paths" below to protect routes with HTTP Basic Auth
export const config = {
  matcher: "/system/:path*",
}
