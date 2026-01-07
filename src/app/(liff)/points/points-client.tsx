// src/app/(liff)/points/points-client.tsx

'use client';

import { signOut } from 'next-auth/react';

// Logout Button Component
export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-sm text-gray-600 hover:text-gray-900"
    >
      ออกจากระบบ
    </button>
  );
}

// Actions Component
export function PointsActions({ lineUserId }: { lineUserId?: string | null }) {
  const handleRedeem = async () => {
    // TODO: Call API to redeem points
    alert(`Redeeming points for user: ${lineUserId}`);
  };

  const handleHistory = () => {
    // TODO: Navigate to history page
    alert('Show history');
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={handleRedeem}
        className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition"
      >
        <div className="text-2xl mb-2">🎁</div>
        <p className="font-medium text-gray-900">แลกของรางวัล</p>
      </button>
      <button
        onClick={handleHistory}
        className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition"
      >
        <div className="text-2xl mb-2">📋</div>
        <p className="font-medium text-gray-900">ประวัติ</p>
      </button>
    </div>
  );
}
