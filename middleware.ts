import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  // Token nathi to pan redirect nathi karvano
  if (!token) {
    return NextResponse.next();
  }

  // Token chhe to continue
  return NextResponse.next();
}

// Only Dashboard routes ma middleware apply thase
export const config = {
  matcher: [
    '/dashboard/:path*',   // /dashboard and all nested routes
  ],
};