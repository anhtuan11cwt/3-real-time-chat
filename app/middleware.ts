import { NextResponse } from "next/server";
import { auth } from "@/app/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  const protectedRoutes = ["/chat", "/setup-profile"];

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route),
  );

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/chat/:path*", "/setup-profile"],
};
