import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes and non-dashboard routes
  if (pathname.startsWith("/api") || !pathname.startsWith("/dashboard")) {
    return NextResponse.next()
  }

  try {
    // Get the session token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // If there's no token and the path is protected, redirect to login
    if (!token) {
      const url = new URL("/", request.url)
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)

    // On error, redirect to login
    return NextResponse.redirect(new URL("/", request.url))
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
}

