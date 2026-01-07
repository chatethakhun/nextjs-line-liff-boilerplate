// src/app/(liff)/setting/page.tsx

'use client';

import { useAuth } from '@/hooks/useAuth';

export default function SettingPage() {
  const { user, logout, isLiffUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Setting</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            {user?.image && (
              <img
                src={user.image}
                alt={user.name || 'User'}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.name || 'ผู้ใช้'}
              </h2>
              <p className="text-gray-600 text-sm">
                {isLiffUser ? 'LINE Account' : 'Email Account'}
              </p>
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="bg-white rounded-lg shadow-md divide-y">
          <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <span className="text-gray-900">การแจ้งเตือน</span>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <span className="text-gray-900">ภาษา</span>
            <span className="text-gray-400">ไทย ›</span>
          </button>
          <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <span className="text-gray-900">ความเป็นส่วนตัว</span>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <span className="text-gray-900">เกี่ยวกับ</span>
            <span className="text-gray-400">›</span>
          </button>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            onClick={() => logout()}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition font-medium"
          >
            ออกจากระบบ
          </button>
        </div>
      </main>
    </div>
  );
}
