// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME, INACTIVITY_LIMIT_SECONDS, signToken, setSessionCookie } from '@/lib/auth';

const PROTECTED_PAGES = ['/dashboard', '/settings'];
const PROTECTED_APIS = ['/api/private'];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedPage = PROTECTED_PAGES.some((p) => pathname.startsWith(p));
  const isProtectedApi = PROTECTED_APIS.some((p) => pathname.startsWith(p));

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  let response: NextResponse;

  // 1. Block unauthenticated API calls with 401 JSON
  if (isProtectedApi && !session) {
    response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // 2. Redirect unauthenticated page requests to /login
  else if (isProtectedPage && !session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    response = NextResponse.redirect(loginUrl);
  }
  // 3. Redirect already-logged-in users away from /login
  else if (pathname === '/login' && session) {
    response = NextResponse.redirect(new URL('/dashboard', req.url));
  }
  else {
    response = NextResponse.next();
  }

  // 1. Delete cookie if invalid or revoked
  if (token && !session) {
    response.cookies.delete(COOKIE_NAME);
  }

  // 2. Sliding 7-day inactivity window: reset the 7-day timer on active requests
  if (session) {
    const refreshedToken = await signToken({
      userId: session.userId,
      email: session.email,
    });
    await setSessionCookie(refreshedToken);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};