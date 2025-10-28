import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isPublicPath(pathname: string): boolean {
  const publicPaths = [
    '/login',
    '/forgot-password',
    '/reset-password',
    '/favicon.ico',
  ];
  if (publicPaths.includes(pathname)) return true;
  // Static and image assets
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/public')) return true;
  // API routes should bypass auth guard
  if (pathname.startsWith('/api')) return true;
  return false;
}

function addSecurityHeaders(res: NextResponse) {
  // Note: Adjust CSP as needed for your app (inline scripts/styles if required)
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://api.tritechtechnologyllc.com; frame-ancestors 'none'; base-uri 'self'"
  );
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'no-referrer');
  // HSTS only effective over HTTPS
  res.headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  return res;
}

export function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const pathname = nextUrl.pathname;

  // Bypass for public & API routes
  if (isPublicPath(pathname)) {
    const res = NextResponse.next();
    return addSecurityHeaders(res);
  }

  // Check for a valid session token (cookie-based)
  const token = cookies.get('accessToken')?.value;

  if (!token) {
    // Preserve originally requested URL via next parameter
    const loginUrl = new URL('/login', nextUrl.origin);
    const nextParam = `${pathname}${nextUrl.search}`;
    loginUrl.searchParams.set('next', nextParam);
    const res = NextResponse.redirect(loginUrl);
    return addSecurityHeaders(res);
  }

  // Optionally: Verify token or profile call here

  const res = NextResponse.next();
  return addSecurityHeaders(res);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};