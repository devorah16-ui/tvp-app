import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/", "/login", "/pricing"];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

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

  if (!isProtected) return NextResponse.next();

  const token =
    request.cookies.get("sb-access-token")?.value ||
    request.cookies.get("supabase-auth-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔥 TEMP: Fake subscription check (we'll replace this next)
  const hasAccess = request.cookies.get("has-access")?.value;

  if (!hasAccess) {
    return NextResponse.redirect(new URL("/pricing", request.url));
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