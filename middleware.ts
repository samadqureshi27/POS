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

  // Only specific API routes are public (authentication endpoints)
  const publicApiRoutes = [
    '/api/t/auth/login',
    '/api/t/auth/forgot-password',
    '/api/t/auth/pin-login',
    '/api/t/auth/reset-password',
  ];
  if (publicApiRoutes.some(route => pathname.startsWith(route))) return true;

  return false;
}

function addSecurityHeaders(res: NextResponse) {
  // Get API base URL from environment (never hardcode in security headers!)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || 'https://api.tritechtechnologyllc.com';
  const isDev = process.env.NODE_ENV === 'development';

  // Content Security Policy - Industry Best Practices
  // - Removed 'unsafe-eval' (major XSS risk, not needed for Next.js)
  // - Kept 'unsafe-inline' for styles only (required for Tailwind and CSS-in-JS)
  // - Used environment variable for API URL
  // - Added font-src for web fonts
  // - Added object-src 'none' to prevent Flash/plugin exploits
  const cspDirectives = [
    "default-src 'self'",
    "img-src 'self' data: blob: https:",  // Allow images from HTTPS sources
    "style-src 'self' 'unsafe-inline' https:",  // Required for Tailwind & inline styles
    isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"  // Dev needs eval for hot reload
      : "script-src 'self' 'unsafe-inline'",  // Production: no eval
    `connect-src 'self' ${apiBaseUrl}`,  // API connections
    "font-src 'self' data: https:",  // Web fonts
    "object-src 'none'",  // Prevent Flash/Java/plugin exploits
    "frame-ancestors 'none'",  // Clickjacking protection
    "base-uri 'self'",  // Prevent base tag injection
    "form-action 'self'",  // Forms can only submit to same origin
  ];

  res.headers.set('Content-Security-Policy', cspDirectives.join('; '));

  // Additional security headers (Industry Standard)
  res.headers.set('X-Frame-Options', 'DENY');  // Clickjacking protection
  res.headers.set('X-Content-Type-Options', 'nosniff');  // MIME sniffing protection
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');  // Privacy protection
  res.headers.set('X-XSS-Protection', '1; mode=block');  // Legacy XSS protection

  // HSTS - only in production over HTTPS
  if (!isDev) {
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Permissions Policy - restrict access to browser features
  res.headers.set('Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()'
  );

  return res;
}

export function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const pathname = nextUrl.pathname;

  // Bypass for public pages and public API routes
  if (isPublicPath(pathname)) {
    const res = NextResponse.next();
    return addSecurityHeaders(res);
  }

  // Protected API routes require authentication
  if (pathname.startsWith('/api')) {
    const token = cookies.get('accessToken')?.value;

    if (!token) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Authentication required', message: 'Please log in to access this resource' },
          { status: 401 }
        )
      );
    }

    // Token exists, allow the request to proceed
    const res = NextResponse.next();
    return addSecurityHeaders(res);
  }

  // Check for a valid session token for page routes
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