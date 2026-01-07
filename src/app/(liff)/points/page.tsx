// src/app/(liff)/points/page.tsx

import { auth } from '@/lib/auth';
import { LogoutButton, PointsActions } from './points-client';

// Server Component - ดึงข้อมูลฝั่ง server
export default async function PointsPage() {
  const session = await auth();
  const user = session?.user;

  // TODO: ดึงข้อมูล points จาก API ฝั่ง server
  // const points = await fetchPoints(user?.lineUserId);
  const points = 1250; // Mock data

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Points</h1>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* User Info Card - Server rendered */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
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
              <p className="text-gray-600">
                Login Type: {user?.loginType === 'liff' ? 'LINE LIFF' : 'Credentials'}
              </p>
              {user?.lineUserId && (
                <p className="text-sm text-gray-500">
                  LINE User ID: {user.lineUserId}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Points Card - Server rendered */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg shadow-md p-6 text-white mb-6">
          <p className="text-sm opacity-80 mb-1">คะแนนสะสม</p>
          <p className="text-4xl font-bold">{points.toLocaleString()}</p>
          <p className="text-sm opacity-80 mt-2">พอยท์</p>
        </div>

        {/* Actions - Client Component */}
        <PointsActions lineUserId={user?.lineUserId} />

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
