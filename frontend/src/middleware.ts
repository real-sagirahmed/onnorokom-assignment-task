import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login'];

const ROLE_ROUTES: Record<string, string[]> = {
  Admin:   ['/admin'],
  Teacher: ['/teacher'],
  Student: ['/student'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Read auth from cookie (set on login)
  const authCookie = request.cookies.get('auth')?.value;
  if (!authCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decodedAuthCookie = decodeURIComponent(authCookie);
    const auth = JSON.parse(decodedAuthCookie) as { role: string };

    // Role-based route protection
    const allowedPrefixes = ROLE_ROUTES[auth.role] ?? [];
    const isAllowed = allowedPrefixes.some((prefix) => pathname.startsWith(prefix));

    if (!isAllowed) {
      const redirectMap: Record<string, string> = {
        Admin:   '/admin',
        Teacher: '/teacher',
        Student: '/student',
      };
      return NextResponse.redirect(new URL(redirectMap[auth.role] ?? '/login', request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
