import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const path = request.nextUrl.pathname;

  // Paths that don't require authentication
  if (path === '/' || path === '/login' || path.startsWith('/api/auth') || path.startsWith('/results') || path.startsWith('/manual')) {
    // If logged in and at login page, redirect away
    if (token && path === '/login') {
      const payload = await verifyToken(token);
      if (payload) {
        if (payload.role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
        if (payload.role === 'teacher') return NextResponse.redirect(new URL('/teacher', request.url));
        if (payload.role === 'student') return NextResponse.redirect(new URL('/student', request.url));
      }
    }
    return NextResponse.next();
  }

  // If no token on a protected route
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = await verifyToken(token);

  if (!payload) {
    // Invalid token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based access control
  if (path.startsWith('/admin') && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (path.startsWith('/teacher') && payload.role !== 'teacher') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (path.startsWith('/student') && payload.role !== 'student') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
