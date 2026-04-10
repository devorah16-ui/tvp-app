import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/pricing"
  ) {
    return NextResponse.next();
  }

  // Protected routes (based on your actual folders)
  const protectedRoutes = [
    "/lead-analyzer",
    "/scripts",
    "/library",
    "/dashboard",
    "/testing",
  ];

  const isProtected = protectedRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const token =
    request.cookies.get("sb-access-token")?.value ||
    request.cookies.get("supabase-auth-token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/lead-analyzer/:path*",
    "/scripts/:path*",
    "/library/:path*",
    "/dashboard/:path*",
    "/testing/:path*",
  ],
};