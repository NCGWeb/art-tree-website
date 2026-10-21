import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

// Note: middleware runs on the Edge runtime. lib/auth.ts only depends on
// `jose`, which supports Edge/Workers runtimes, so it's safe to import here.
async function hasValidSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === '/admin/login';
  const isLoginApi = pathname === '/api/admin/login';

  if (isLoginPage || isLoginApi) {
    return NextResponse.next();
  }

  const protectedAdmin = pathname.startsWith('/admin');
  const protectedApi = pathname.startsWith('/api/admin');

  if (!protectedAdmin && !protectedApi) {
    return NextResponse.next();
  }

  const authed = await hasValidSession(req);
  if (authed) {
    return NextResponse.next();
  }

  if (protectedApi) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = new URL('/admin/login', req.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
