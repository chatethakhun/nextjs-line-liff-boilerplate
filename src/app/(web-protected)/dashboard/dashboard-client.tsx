// src/app/(web-protected)/dashboard/dashboard-client.tsx

'use client';

import { signOut } from 'next-auth/react';

// Logout Button
export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-sm text-red-600 hover:text-red-800"
    >
      ออกจากระบบ
    </button>
  );
}
