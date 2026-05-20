import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

export const config = {
  matcher: ["/admin/:path*"],
};

export function proxy(req: NextRequest): NextResponse {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    const redirectTo = url.pathname + url.search;
    url.pathname = "/login";
    url.searchParams.set("redirect", redirectTo);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
