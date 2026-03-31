import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin pages (except login)
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Basic JWT structure check (full verification happens in API routes)
    const parts = token.split(".");
    if (parts.length !== 3) {
      const response = NextResponse.redirect(new URL("/admin", req.url));
      response.cookies.delete("admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
