import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const role = request.cookies.get("ffm_role")?.value;
  const wantsBootstrap = url.searchParams.get("admin") === "1";

  const cleanUrl = () => {
    const clone = url.clone();
    clone.searchParams.delete("admin");
    return clone;
  };

  const setAdminCookie = (res: NextResponse) => {
    const host = url.hostname;
    const isLocalhost = host === "localhost" || host === "127.0.0.1";

    res.cookies.set("ffm_role", "admin", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: !isLocalhost,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  };

  if (role === "admin") {
    if (wantsBootstrap) {
      const res = NextResponse.redirect(cleanUrl());
      setAdminCookie(res);
      return res;
    }
    const res = NextResponse.next();
    setAdminCookie(res);
    return res;
  }

  if (wantsBootstrap) {
    const res = NextResponse.redirect(cleanUrl());
    setAdminCookie(res);
    return res;
  }

  const signin = url.clone();
  signin.pathname = "/auth/sign-in";
  signin.searchParams.set("next", url.pathname + url.search);
  return NextResponse.redirect(signin);
}