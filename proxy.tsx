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

  const acceptedCredentials = process.env.HTTP_BASIC_AUTH?.split("|").map(cred => cred.split(":")) || []
  return !!acceptedCredentials.find(
    creds => req.nextUrl.pathname.indexOf(`/${creds[0]}/`) > 0 && creds[1] === user && creds[2] === pass
  )
}

// Step 3. Configure "Matching Paths" below to protect routes with HTTP Basic Auth
export const config = {
  matcher: "/system/:path*",
}
