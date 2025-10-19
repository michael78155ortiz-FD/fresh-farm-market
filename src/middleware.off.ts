// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/admin/:path*'],
}

export function middleware(request: NextRequest) {
  // For now, just let everything through - client-side protection will handle it
  return NextResponse.next()
}