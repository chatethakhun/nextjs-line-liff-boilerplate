// src/components/providers/LiffProvider.tsx

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import type { Liff } from '@line/liff';
import type { LiffContextValue, LiffProfile } from '@/lib/liff/types';
import {
  initializeLiff,
  getLiffProfile,
  liffLogin as liffLoginFn,
  liffLogout as liffLogoutFn,
  setRedirectUrl,
  getRedirectUrl,
  clearRedirectUrl,
} from '@/lib/liff/client';
import { getLiffIdByPath, isLiffPath } from '@/lib/liff/config';

const LiffContext = createContext<LiffContextValue | null>(null);

interface LiffProviderProps {
  children: ReactNode;
  /**
   * Override LIFF ID (ถ้าไม่ส่ง จะใช้ตาม path)
   */
  liffId?: string;
  /**
   * Auto login ถ้ายังไม่ได้ login
   */
  autoLogin?: boolean;
  /**
   * Auto authenticate กับ Auth.js หลัง LIFF login
   */
  autoAuthJs?: boolean;
}

export function LiffProvider({
  children,
  liffId: propLiffId,
  autoLogin = false,
  autoAuthJs = true,
}: LiffProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [liff, setLiff] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [isLiffInitialized, setIsLiffInitialized] = useState(false);
  const [isLiffLoggedIn, setIsLiffLoggedIn] = useState(false);
  const [isInLiffClient, setIsInLiffClient] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [currentLiffId, setCurrentLiffId] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // คำนวณ LIFF ID จาก props หรือ path
  const effectiveLiffId = useMemo(() => {
    // ถ้ามี liffId จาก searchParams (จาก middleware redirect)
    const liffIdFromParams = searchParams.get('liffId');
    if (liffIdFromParams) return liffIdFromParams;

    // ถ้ามี liffId จาก props
    if (propLiffId) return propLiffId;

    // ถ้าไม่มี ใช้ตาม path
    return getLiffIdByPath(pathname);
  }, [propLiffId, pathname, searchParams]);

  // Initialize LIFF
  useEffect(() => {
    // ไม่ต้อง init ถ้าไม่ใช่ LIFF path และไม่มี propLiffId
    if (!effectiveLiffId) {
      return;
    }

    // ถ้า init แล้วด้วย ID เดียวกัน ไม่ต้อง init ใหม่
    if (isLiffInitialized && currentLiffId === effectiveLiffId) {
      return;
    }

    let mounted = true;

    const init = async () => {
      try {
        setLiffError(null);
        setIsLiffInitialized(false);

        const liffInstance = await initializeLiff(effectiveLiffId);

        if (!mounted) return;

        setLiff(liffInstance);
        setCurrentLiffId(effectiveLiffId);
        setIsLiffInitialized(true);
        setIsLiffLoggedIn(liffInstance.isLoggedIn());
        setIsInLiffClient(liffInstance.isInClient());

        // ถ้า login แล้ว ดึง profile
        if (liffInstance.isLoggedIn()) {
          const liffProfile = await getLiffProfile(liffInstance);
          if (mounted && liffProfile) {
            setProfile(liffProfile);

            // Auto authenticate กับ Auth.js
            if (autoAuthJs && !isAuthenticating) {
              setIsAuthenticating(true);
              await authenticateWithAuthJs(liffProfile, liffInstance);
              setIsAuthenticating(false);
            }
          }
        } else if (autoLogin) {
          // Auto login ถ้าต้องการ
          setRedirectUrl(window.location.href);
          liffLoginFn(liffInstance);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('LIFF init error:', error);
        setLiffError(
          error instanceof Error ? error.message : 'Failed to initialize LIFF'
        );
        setIsLiffInitialized(true); // Mark as initialized even on error
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [effectiveLiffId, autoLogin, autoAuthJs, isLiffInitialized, currentLiffId, isAuthenticating]);

  // Authenticate กับ Auth.js หลัง LIFF login
  const authenticateWithAuthJs = async (
    liffProfile: LiffProfile,
    liffInstance: Liff
  ) => {
    try {
      const accessToken = liffInstance.getAccessToken();

      // Get callback URL
      const callbackUrl =
        searchParams.get('callbackUrl') || getRedirectUrl() || pathname;

      const result = await signIn('liff', {
        lineUserId: liffProfile.userId,
        displayName: liffProfile.displayName,
        pictureUrl: liffProfile.pictureUrl || '',
        accessToken: accessToken || '',
        redirect: false,
      });

      if (result?.ok) {
        clearRedirectUrl();
        // Redirect ไปหน้าเดิม
        router.replace(callbackUrl);
      } else {
        console.error('Auth.js sign in failed:', result?.error);
      }
    } catch (error) {
      console.error('Failed to authenticate with Auth.js:', error);
    }
  };

  // Login function
  const login = useCallback(() => {
    if (liff && !isLiffLoggedIn) {
      // เก็บ URL ปัจจุบันไว้ redirect กลับ
      setRedirectUrl(window.location.href);
      liffLoginFn(liff);
    }
  }, [liff, isLiffLoggedIn]);

  // Logout function
  const logout = useCallback(() => {
    if (liff && isLiffLoggedIn) {
      liffLogoutFn(liff);
      setProfile(null);
      setIsLiffLoggedIn(false);
    }
  }, [liff, isLiffLoggedIn]);

  // Context value
  const value = useMemo<LiffContextValue>(
    () => ({
      liff,
      liffError,
      isLiffInitialized,
      isLiffLoggedIn,
      isInLiffClient,
      profile,
      currentLiffId,
      login,
      logout,
    }),
    [
      liff,
      liffError,
      isLiffInitialized,
      isLiffLoggedIn,
      isInLiffClient,
      profile,
      currentLiffId,
      login,
      logout,
    ]
  );

  return <LiffContext.Provider value={value}>{children}</LiffContext.Provider>;
}

// Hook to use LIFF context
export function useLiff(): LiffContextValue {
  const context = useContext(LiffContext);

  if (!context) {
    throw new Error('useLiff must be used within a LiffProvider');
  }

  return context;
}

// Export context for advanced use cases
export { LiffContext };
