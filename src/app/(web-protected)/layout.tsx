// src/app/(web-protected)/layout.tsx

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import type { ReactNode } from 'react';

interface WebProtectedLayoutProps {
  children: ReactNode;
}

// Server Component - ใช้ auth() ได้เลย
export default async function WebProtectedLayout({ children }: WebProtectedLayoutProps) {
  const session = await auth();

  // ถ้ายังไม่ login - redirect ไปหน้า login
  if (!session?.user) {
    redirect('/auth/login');
  }

  // Authenticated - render children
  return <>{children}</>;
}
