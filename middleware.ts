import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Create a response object
  const response = NextResponse.next()
  const requestUrl = new URL(request.url)

  // For development purposes, we'll allow access to admin routes
  // In production, this should be properly secured
  if (process.env.NODE_ENV === "development" && requestUrl.pathname.startsWith("/admin")) {
    return response
  }

  // If trying to access protected routes, redirect to login
  if (requestUrl.pathname.startsWith("/admin")) {
    const redirectUrl = new URL("/auth/login", requestUrl.origin)
    redirectUrl.searchParams.set("redirectedFrom", requestUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
}
