import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = { 
  matcher: ["/admin/:path*"] 
};

export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_BASIC_USER || "";
  const pass = process.env.ADMIN_BASIC_PASS || "";
  
  if (!user || !pass) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
  }

  const auth = req.headers.get("authorization");
  
  if (!auth?.startsWith("Basic ")) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  const [u, p] = Buffer.from(auth.split(" ")[1], "base64").toString("utf8").split(":");
  
  if (u === user && p === pass) {
    return NextResponse.next();
  }

  return new NextResponse("Forbidden", { status: 403 });
}
