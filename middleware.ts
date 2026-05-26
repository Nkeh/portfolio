import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = pathname.startsWith("/admin/dashboard");
  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
});

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
