import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ["/", "/login", "/pricing"];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes
  const protectedRoutes = [
    "/lead-analyzer",
    "/scripts",
    "/library",
    "/dashboard",
    "/testing",
  ];

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtected) return NextResponse.next();

  // Check login
  const token =
    request.cookies.get("sb-access-token")?.value ||
    request.cookies.get("supabase-auth-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
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