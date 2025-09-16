import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl
  const host = request.headers.get("host") || ""

  // Optional: Support admin subdomain (e.g., admin.localhost:3000 ⇒ /admin)
  const isAdminSubdomain = host.split(":")[0].startsWith("admin.")
  if (isAdminSubdomain && !pathname.startsWith("/admin")) {
    const url = new URL(`/admin${pathname}`, origin)
    url.search = request.nextUrl.search
    return NextResponse.rewrite(url)
  }

  const isAdminPath = pathname.startsWith("/admin")
  const isAdminApi = pathname.startsWith("/api/admin")

  // Redirect admins away from public login to admin login
  if (pathname === "/login") {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (token?.role === "admin") {
      const url = new URL("/admin/login", request.url)
      url.search = request.nextUrl.search
      return NextResponse.redirect(url)
    }
  }

  if (isAdminPath || isAdminApi) {
    // Allow admin login page without admin token
    if (pathname === "/admin/login") {
      return NextResponse.next()
    }
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token || token.role !== "admin") {
      // API requests return 401 JSON
      if (isAdminApi) {
        return new NextResponse(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { "content-type": "application/json" } },
        )
      }
      // For non-admin, redirect to homepage
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/login"],
}
