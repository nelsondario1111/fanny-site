import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const protectedPaths = ["/en/account", "/es/cuenta"];
  const needsAuth = protectedPaths.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  const hasSession = req.cookies.get("fs_session")?.value;
  if (hasSession) return NextResponse.next();

  const redirectTo = pathname.startsWith("/es") ? "/es/iniciar-sesion" : "/en/login";
  const url = req.nextUrl.clone();
  url.pathname = redirectTo;
  url.searchParams.set("redirect", pathname + (search || ""));
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/en/account/:path*", "/es/cuenta/:path*"],
};
