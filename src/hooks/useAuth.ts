// src/hooks/useAuth.ts

'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useCallback } from 'react';

/**
 * Custom hook wrapper for Auth.js
 * Provides simplified auth state and actions
 */
export function useAuth() {
  const { data: session, status, update } = useSession();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  // Current user
  const user = session?.user ?? null;

  // Check login type
  const isLiffUser = user?.loginType === 'liff';
  const isCredentialsUser = user?.loginType === 'credentials';

  // LINE User ID (only available for LIFF users)
  const lineUserId = user?.lineUserId ?? null;

  // Login with credentials
  const loginWithCredentials = useCallback(
    async (username: string, password: string) => {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      return {
        ok: result?.ok ?? false,
        error: result?.error ?? null,
      };
    },
    []
  );

  // Login with LIFF (redirect to LIFF callback)
  const loginWithLiff = useCallback(
    (liffId: string, callbackUrl?: string) => {
      const url = new URL('/auth/liff-callback', window.location.origin);
      url.searchParams.set('liffId', liffId);
      if (callbackUrl) {
        url.searchParams.set('callbackUrl', callbackUrl);
      }
      window.location.href = url.toString();
    },
    []
  );

  // Logout
  const logout = useCallback(async (callbackUrl?: string) => {
    await signOut({
      callbackUrl: callbackUrl || '/',
    });
  }, []);

  return {
    // State
    user,
    session,
    status,
    isAuthenticated,
    isLoading,
    isLiffUser,
    isCredentialsUser,
    lineUserId,

    // Actions
    loginWithCredentials,
    loginWithLiff,
    logout,
    updateSession: update,
  };
}

/**
 * Hook to get LINE User ID from session
 * Useful for API calls that require lineUserId
 */
export function useLineUserIdFromSession(): string | null {
  const { user } = useAuth();
  return user?.lineUserId ?? null;
}
