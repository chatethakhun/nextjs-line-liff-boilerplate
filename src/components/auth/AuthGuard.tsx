// src/components/auth/AuthGuard.tsx

'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { isLiffPath, getLiffIdByPath } from '@/lib/liff/config';

interface AuthGuardProps {
  children: ReactNode;
  /**
   * Custom loading component
   */
  loadingComponent?: ReactNode;
  /**
   * Redirect URL if not authenticated (default: based on path)
   */
  redirectUrl?: string;
}

/**
 * Client-side auth guard component
 * ใช้เป็น backup นอกจาก middleware
 */
export function AuthGuard({
  children,
  loadingComponent,
  redirectUrl,
}: AuthGuardProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      // สร้าง redirect URL
      let url: string;

      if (redirectUrl) {
        url = redirectUrl;
      } else if (isLiffPath(pathname)) {
        // LIFF path -> redirect ไป liff-callback
        const params = new URLSearchParams({
          callbackUrl: pathname,
          liffId: getLiffIdByPath(pathname),
        });
        url = `/auth/liff-callback?${params.toString()}`;
      } else {
        // Non-LIFF path -> redirect ไป login
        url = `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`;
      }

      router.replace(url);
    }
  }, [status, router, pathname, redirectUrl]);

  // Loading state
  if (status === 'loading') {
    return (
      loadingComponent ?? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )
    );
  }

  // Not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  // Authenticated
  return <>{children}</>;
}

/**
 * HOC version of AuthGuard
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<AuthGuardProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
