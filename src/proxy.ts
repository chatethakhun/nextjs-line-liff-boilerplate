// src/proxy.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy (เดิมคือ Middleware)
 * 
 * ใน Next.js 16 - Proxy ควรใช้สำหรับ routing เท่านั้น
 * ไม่ควรใส่ auth logic หนักๆ ใน proxy
 * Auth ควรจัดการใน Layout หรือ Server Actions แทน
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API routes - skip
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Auth routes - skip
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // LIFF routes - ปล่อยผ่าน (Layout จะ handle LIFF auth)
  const liffRoutes = ['/points', '/coupon', '/profile', '/setting'];
  const isLiffRoute = liffRoutes.some((route) => pathname.startsWith(route));
  if (isLiffRoute) {
    return NextResponse.next();
  }

  // Web protected routes - ปล่อยผ่าน (Layout จะ handle auth)
  // Auth check จะทำใน (web-protected)/layout.tsx แทน
  const webProtectedRoutes = ['/dashboard', '/admin'];
  const isWebProtectedRoute = webProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isWebProtectedRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Export as default (recommended in Next.js 16)
export default proxy;

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
