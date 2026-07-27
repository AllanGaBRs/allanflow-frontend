import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/login", "/register", "/forgot-password"];

export function proxy(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const pathname = req.nextUrl.pathname;

  const isInvitationRoute = pathname.startsWith("/invitations/");
  const isPublicAsset = pathname.startsWith("/img/");
  const isPublicRoute = publicRoutes.includes(pathname) || isInvitationRoute;

  if (!token && !isPublicRoute && !isPublicAsset) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/workspaces", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
