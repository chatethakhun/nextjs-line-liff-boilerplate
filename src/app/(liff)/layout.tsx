// src/app/(liff)/layout.tsx

"use client";

import { useEffect, useState, useCallback, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { initializeLiff, getLiffProfile } from "@/lib/liff/client";
import { getLiffIdByPath } from "@/lib/liff/config";

interface LiffLayoutProps {
  children: ReactNode;
}

type AuthState = "loading" | "authenticated" | "error";

export default function LiffLayout({ children }: LiffLayoutProps) {
  const pathname = usePathname();
  const { status: sessionStatus, update: updateSession } = useSession();
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("Initializing...");

  const initLiffAndAuth = useCallback(async () => {
    try {
      const liffId = getLiffIdByPath(pathname);

      if (!liffId) {
        throw new Error(`No LIFF ID configured for path: ${pathname}`);
      }

      setDebugInfo(`Initializing LIFF: ${liffId}`);

      // Init LIFF
      const liff = await initializeLiff(liffId);

      setDebugInfo(
        `LIFF ready. isLoggedIn: ${liff.isLoggedIn()}, isInClient: ${liff.isInClient()}`,
      );

      // เช็คว่า login แล้วหรือยัง
      if (!liff.isLoggedIn()) {
        if (liff.isInClient()) {
          setDebugInfo(
            "In LINE client but not logged in, calling liff.login()...",
          );
          liff.login();
          return;
        } else {
          throw new Error("กรุณาเปิดหน้านี้ผ่าน LINE app");
        }
      }

      // ดึง LIFF profile
      setDebugInfo("Getting LIFF profile...");
      const profile = await getLiffProfile(liff);

      if (!profile) {
        throw new Error("Failed to get LIFF profile");
      }

      setDebugInfo(`Got profile: ${profile.displayName}, signing in...`);

      // Sign in กับ Auth.js
      const accessToken = liff.getAccessToken();

      const result = await signIn("liff", {
        lineUserId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl || "",
        accessToken: accessToken || "",
        redirect: false,
      });

      if (result?.ok) {
        router.refresh();
        setDebugInfo("Auth successful!");
        await updateSession();
        setAuthState("authenticated");
      } else {
        throw new Error(result?.error || "Authentication failed");
      }
    } catch (err) {
      console.error("LIFF auth error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setDebugInfo(`Error: ${errorMessage}`);
      setError(errorMessage);
      setAuthState("error");
    }
  }, [pathname, updateSession]);

  useEffect(() => {
    // ถ้า Auth.js session พร้อมแล้ว ไม่ต้องทำอะไร
    if (sessionStatus === "authenticated") {
      setAuthState("authenticated");
      return;
    }

    // รอ session check เสร็จก่อน
    if (sessionStatus === "loading") {
      return;
    }

    // Session ยังไม่มี - ต้อง init LIFF และ login
    initLiffAndAuth();
  }, [sessionStatus, initLiffAndAuth]);

  // Loading state
  if (authState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4" />
          <p className="text-gray-600">กำลังเข้าสู่ระบบ...</p>
          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-gray-400 mt-2 max-w-xs break-all">
              {debugInfo}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (authState === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-gray-600 mb-4">{error}</p>
            {process.env.NODE_ENV === "development" && (
              <p className="text-xs text-gray-400 mb-4 break-all">
                {debugInfo}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated - render children (can be Server Components)
  return <>{children}</>;
}
