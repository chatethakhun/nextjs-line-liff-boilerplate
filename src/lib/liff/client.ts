// src/lib/liff/client.ts

import type { Liff } from '@line/liff';
import type { LiffProfile } from './types';

let liffInstance: Liff | null = null;
let currentInitializedLiffId: string | null = null;

/**
 * Initialize LIFF SDK
 * จะ re-initialize ถ้า liffId เปลี่ยน
 */
export async function initializeLiff(liffId: string): Promise<Liff> {
  if (typeof window === 'undefined') {
    throw new Error('LIFF can only be initialized on client side');
  }

  if (!liffId) {
    throw new Error('LIFF ID is required');
  }

  // ถ้า initialize แล้วด้วย liffId เดียวกัน ใช้ instance เดิม
  if (liffInstance && currentInitializedLiffId === liffId) {
    return liffInstance;
  }

  // ถ้า liffId เปลี่ยน ต้อง re-import และ initialize ใหม่
  const liff = (await import('@line/liff')).default;

  await liff.init({
    liffId,
    withLoginOnExternalBrowser: true,
  });

  liffInstance = liff;
  currentInitializedLiffId = liffId;

  return liff;
}

/**
 * Get current LIFF instance
 */
export function getLiffInstance(): Liff | null {
  return liffInstance;
}

/**
 * Get LIFF profile
 */
export async function getLiffProfile(liff: Liff): Promise<LiffProfile | null> {
  try {
    if (!liff.isLoggedIn()) {
      return null;
    }

    const profile = await liff.getProfile();
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
    };
  } catch (error) {
    console.error('Failed to get LIFF profile:', error);
    return null;
  }
}

/**
 * Get LIFF access token
 */
export function getLiffAccessToken(liff: Liff): string | null {
  try {
    return liff.getAccessToken();
  } catch {
    return null;
  }
}

/**
 * Check if running inside LINE app
 */
export function isInLineClient(liff: Liff): boolean {
  try {
    return liff.isInClient();
  } catch {
    return false;
  }
}

/**
 * LIFF Login
 * @param redirectUri - URL to redirect after login
 */
export function liffLogin(liff: Liff, redirectUri?: string): void {
  if (!liff.isLoggedIn()) {
    liff.login({
      redirectUri: redirectUri || window.location.href,
    });
  }
}

/**
 * LIFF Logout
 */
export function liffLogout(liff: Liff): void {
  if (liff.isLoggedIn()) {
    liff.logout();
  }
}

/**
 * Close LIFF window (only works in LINE client)
 */
export function closeLiffWindow(liff: Liff): void {
  if (liff.isInClient()) {
    liff.closeWindow();
  }
}

/**
 * Get redirect URL for after LIFF login
 * เก็บ returnUrl ไว้ใน sessionStorage ก่อน login
 */
const REDIRECT_STORAGE_KEY = 'liff_redirect_url';

export function setRedirectUrl(url: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(REDIRECT_STORAGE_KEY, url);
  }
}

export function getRedirectUrl(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(REDIRECT_STORAGE_KEY);
  }
  return null;
}

export function clearRedirectUrl(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
  }
}
