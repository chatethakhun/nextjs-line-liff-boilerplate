// src/app/auth/liff-callback/page.tsx

'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import {
  initializeLiff,
  getLiffProfile,
  clearRedirectUrl,
  getRedirectUrl,
  setRedirectUrl,
} from '@/lib/liff/client';

// Storage keys
const LIFF_ID_STORAGE_KEY = 'liff_pending_id';
const LIFF_CALLBACK_STORAGE_KEY = 'liff_callback_url';

function LiffCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // ป้องกัน double execution จาก React StrictMode
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // ดึง liffId จาก query params หรือ sessionStorage
    const liffIdFromParams = searchParams.get('liffId');
    const liffIdFromStorage = sessionStorage.getItem(LIFF_ID_STORAGE_KEY);
    const liffId = liffIdFromParams || liffIdFromStorage;

    // ดึง callbackUrl จาก query params หรือ sessionStorage
    const callbackUrlFromParams = searchParams.get('callbackUrl');
    const callbackUrlFromStorage = sessionStorage.getItem(LIFF_CALLBACK_STORAGE_KEY) || getRedirectUrl();
    const callbackUrl = callbackUrlFromParams || callbackUrlFromStorage || '/';

    // เก็บค่าไว้ใน sessionStorage สำหรับหลัง LINE redirect กลับมา
    if (liffIdFromParams) {
      sessionStorage.setItem(LIFF_ID_STORAGE_KEY, liffIdFromParams);
    }
    if (callbackUrlFromParams) {
      sessionStorage.setItem(LIFF_CALLBACK_STORAGE_KEY, callbackUrlFromParams);
      setRedirectUrl(callbackUrlFromParams);
    }

    setDebugInfo(`Status: ${status}, LIFF ID: ${liffId}, Callback: ${callbackUrl}`);

    // ถ้า login กับ Auth.js แล้ว redirect ไปหน้าเดิม
    if (status === 'authenticated') {
      setDebugInfo('Already authenticated, redirecting...');
      clearAllStorage();
      router.replace(callbackUrl);
      return;
    }

    // รอ session check เสร็จก่อน
    if (status === 'loading') {
      setDebugInfo('Checking session...');
      return;
    }

    if (!liffId) {
      setError('LIFF ID is required. Please try again from the beginning.');
      setIsProcessing(false);
      return;
    }

    const handleLiffAuth = async () => {
      try {
        setDebugInfo('Initializing LIFF...');

        // Initialize LIFF
        const liff = await initializeLiff(liffId);

        setDebugInfo(`LIFF initialized. isLoggedIn: ${liff.isLoggedIn()}, isInClient: ${liff.isInClient()}`);

        // ถ้ายังไม่ได้ login กับ LIFF
        if (!liff.isLoggedIn()) {
          setDebugInfo('Not logged in, redirecting to LINE login...');
          
          // Redirect ไป LINE login
          // LIFF จะ redirect กลับมาที่ Endpoint URL ที่ตั้งไว้ใน LINE Developer Console
          liff.login({
            redirectUri: window.location.origin + '/auth/liff-callback',
          });
          return;
        }

        setDebugInfo('LIFF logged in, getting profile...');

        // ดึง profile
        const profile = await getLiffProfile(liff);

        if (!profile) {
          throw new Error('Failed to get LIFF profile');
        }

        setDebugInfo(`Got profile: ${profile.displayName}, signing in to Auth.js...`);

        // Authenticate กับ Auth.js
        const accessToken = liff.getAccessToken();

        const result = await signIn('liff', {
          lineUserId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl || '',
          accessToken: accessToken || '',
          redirect: false,
        });

        if (result?.ok) {
          setDebugInfo('Auth.js sign in successful, redirecting...');
          clearAllStorage();
          router.replace(callbackUrl);
        } else {
          throw new Error(result?.error || 'Authentication failed');
        }
      } catch (err) {
        console.error('LIFF callback error:', err);
        setDebugInfo(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsProcessing(false);
      }
    };

    handleLiffAuth();
  }, [router, searchParams, status]);

  // Clear all LIFF-related storage
  const clearAllStorage = () => {
    sessionStorage.removeItem(LIFF_ID_STORAGE_KEY);
    sessionStorage.removeItem(LIFF_CALLBACK_STORAGE_KEY);
    clearRedirectUrl();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-gray-600 mb-4">{error}</p>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-xs text-gray-400 mb-4 break-all">{debugInfo}</p>
            )}
            <div className="space-y-2">
              <button
                onClick={() => {
                  clearAllStorage();
                  window.location.reload();
                }}
                className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                ลองใหม่อีกครั้ง
              </button>
              <button
                onClick={() => {
                  clearAllStorage();
                  router.push('/');
                }}
                className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                กลับหน้าแรก
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              กำลังเข้าสู่ระบบ
            </h1>
            <p className="text-gray-600">กรุณารอสักครู่...</p>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-xs text-gray-400 mt-4 break-all">{debugInfo}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function LiffCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      }
    >
      <LiffCallbackContent />
    </Suspense>
  );
}
