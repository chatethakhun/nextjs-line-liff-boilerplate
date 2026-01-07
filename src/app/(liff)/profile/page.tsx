// src/app/(liff)/profile/page.tsx

import { auth } from '@/lib/auth';
import { LogoutButton, ProfileActions } from './profile-client';

// Server Component
export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Card - Server rendered */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />

          {/* Avatar & Name */}
          <div className="px-6 pb-6">
            <div className="flex flex-col items-center -mt-16">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || 'User'}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-gray-300 flex items-center justify-center">
                  <span className="text-4xl text-gray-600">👤</span>
                </div>
              )}

              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                {user?.name || 'ผู้ใช้'}
              </h2>

              {user?.email && (
                <p className="text-gray-600">{user.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards - Server rendered */}
        <div className="grid gap-4 mt-6">
          {/* Login Type */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              ประเภทการเข้าสู่ระบบ
            </h3>
            <div className="flex items-center gap-2">
              {user?.loginType === 'liff' ? (
                <>
                  <span className="text-2xl">📱</span>
                  <span className="font-semibold text-green-600">LINE LIFF</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">🔐</span>
                  <span className="font-semibold text-blue-600">Username/Password</span>
                </>
              )}
            </div>
          </div>

          {/* LINE User ID */}
          {user?.lineUserId && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                LINE User ID
              </h3>
              <p className="font-mono text-sm text-gray-800 break-all">
                {user.lineUserId}
              </p>
            </div>
          )}

          {/* User ID */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">User ID</h3>
            <p className="font-mono text-sm text-gray-800 break-all">
              {user?.id}
            </p>
          </div>
        </div>

        {/* Actions - Client Component */}
        <ProfileActions userName={user?.name} />

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Debug Info (Server)
            </h3>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify({ user }, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
