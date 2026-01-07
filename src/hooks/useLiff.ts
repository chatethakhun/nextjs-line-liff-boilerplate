// src/hooks/useLiff.ts

'use client';

import { useContext } from 'react';
import { LiffContext } from '@/components/providers/LiffProvider';
import type { LiffContextValue } from '@/lib/liff/types';

/**
 * Hook to access LIFF context
 * Must be used within LiffProvider
 */
export function useLiff(): LiffContextValue {
  const context = useContext(LiffContext);

  if (!context) {
    throw new Error('useLiff must be used within a LiffProvider');
  }

  return context;
}

/**
 * Hook to get LINE User ID
 * Returns null if not logged in via LIFF
 */
export function useLineUserId(): string | null {
  const { profile } = useLiff();
  return profile?.userId ?? null;
}

/**
 * Hook to check if user is in LINE client
 */
export function useIsInLineClient(): boolean {
  const { isInLiffClient } = useLiff();
  return isInLiffClient;
}

/**
 * Hook to check LIFF login status
 */
export function useLiffLoginStatus() {
  const { isLiffInitialized, isLiffLoggedIn, liffError } = useLiff();

  return {
    isInitialized: isLiffInitialized,
    isLoggedIn: isLiffLoggedIn,
    error: liffError,
    isLoading: !isLiffInitialized,
  };
}
