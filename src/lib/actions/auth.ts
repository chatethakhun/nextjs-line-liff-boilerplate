// src/lib/actions/auth.ts

'use server';

import { auth, signIn, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';

/**
 * Get current session (Server Action)
 */
export async function getSession() {
  return await auth();
}

/**
 * Get current user from session (Server Action)
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Check if user is authenticated (Server Action)
 */
export async function isAuthenticated() {
  const session = await auth();
  return !!session?.user;
}

/**
 * Sign in with credentials (Server Action)
 */
export async function signInWithCredentials(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const callbackUrl = (formData.get('callbackUrl') as string) || '/';

  try {
    await signIn('credentials', {
      username,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    // Auth.js throws NEXT_REDIRECT on success, which is expected
    if ((error as Error).message === 'NEXT_REDIRECT') {
      throw error;
    }
    return { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  }
}

/**
 * Sign out (Server Action)
 */
export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth(callbackUrl?: string) {
  const session = await auth();
  
  if (!session?.user) {
    const url = callbackUrl 
      ? `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : '/auth/login';
    redirect(url);
  }
  
  return session;
}

/**
 * Require LINE user - check if logged in via LIFF
 */
export async function requireLineUser() {
  const session = await auth();
  
  if (!session?.user || session.user.loginType !== 'liff') {
    redirect('/');
  }
  
  return session;
}
