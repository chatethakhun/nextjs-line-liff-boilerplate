// src/app/(liff)/profile/profile-client.tsx

'use client';

import { signOut } from 'next-auth/react';

// Logout Button
export function LogoutButton() {
  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-600 hover:text-gray-900"
    >
      ออกจากระบบ
    </button>
  );
}

// Actions (Share, Logout, etc.)
export function ProfileActions({ userName }: { userName?: string | null }) {
  const handleShare = async () => {
    // Share functionality - ต้องใช้ LIFF SDK จาก client
    if (typeof window !== 'undefined' && (window as any).liff) {
      const liff = (window as any).liff;
      if (liff.isInClient()) {
        try {
          await liff.shareTargetPicker([
            {
              type: 'text',
              text: `ดูโปรไฟล์ของฉัน: ${userName}`,
            },
          ]);
        } catch (error) {
          console.error('Share failed:', error);
        }
      }
    }
  };

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <div className="mt-6 space-y-3">
      <button
        onClick={handleShare}
        className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition font-medium"
      >
        แชร์โปรไฟล์
      </button>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition font-medium"
      >
        ออกจากระบบ
      </button>
    </div>
  );
}
