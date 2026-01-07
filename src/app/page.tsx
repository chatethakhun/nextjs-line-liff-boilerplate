// src/app/page.tsx

'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">My LIFF App</h1>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{user?.name}</span>
                <button
                  onClick={() => logout()}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to My LIFF App
          </h2>
          <p className="text-xl text-gray-600">
            Next.js + LINE LIFF + Auth.js Integration
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* LIFF Features */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-green-500">📱</span>
              LIFF Features (เปิดจาก LINE app)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/points"
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition text-center"
              >
                <div className="text-2xl mb-2">🎯</div>
                <p className="font-medium text-gray-900">Points</p>
              </Link>
              <Link
                href="/coupon"
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition text-center"
              >
                <div className="text-2xl mb-2">🎫</div>
                <p className="font-medium text-gray-900">Coupon</p>
              </Link>
              <Link
                href="/profile"
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition text-center"
              >
                <div className="text-2xl mb-2">👤</div>
                <p className="font-medium text-gray-900">Profile</p>
              </Link>
              <Link
                href="/setting"
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition text-center"
              >
                <div className="text-2xl mb-2">⚙️</div>
                <p className="font-medium text-gray-900">Setting</p>
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              * หน้าเหล่านี้ต้องเปิดจาก LINE app เท่านั้น
            </p>
          </div>

          {/* Web Features */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-blue-500">💻</span>
              Web Features (Login ด้วย Username/Password)
            </h3>
            <Link
              href="/dashboard"
              className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">📊</div>
                <div>
                  <p className="font-medium text-gray-900">Dashboard</p>
                  <p className="text-sm text-gray-500">จัดการระบบหลังบ้าน</p>
                </div>
              </div>
            </Link>
            <p className="text-xs text-gray-500 mt-3">
              * ต้อง Login ด้วย Username/Password
            </p>
          </div>
        </div>

        {/* Auth Status */}
        {!isLoading && (
          <div className="mt-12 text-center">
            {isAuthenticated ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
                <p className="text-green-800">
                  ✓ เข้าสู่ระบบแล้วในชื่อ <strong>{user?.name}</strong>
                  {user?.lineUserId && (
                    <span className="text-sm text-green-600 block mt-1">
                      (LINE User)
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
                <p className="text-yellow-800">
                  กรุณาเข้าสู่ระบบเพื่อใช้งานฟีเจอร์ต่างๆ
                </p>
                <Link
                  href="/auth/login"
                  className="inline-block mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  เข้าสู่ระบบ
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
