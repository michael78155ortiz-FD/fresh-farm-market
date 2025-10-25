import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Scope middleware ONLY to protected areas.
 * Public pages like /, /market, /vendor, /vendor/signup remain untouched.
 */
export const config = {
  matcher: ['/admin/:path*', '/vendor-hub/:path*'],
};

export function middleware(_req: NextRequest) {
  // Pass-through for now; add auth checks later if you want.
  return NextResponse.next();
}
