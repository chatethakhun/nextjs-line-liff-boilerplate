// src/lib/liff/config.ts

export interface LiffConfig {
  liffId: string;
  path: string;
  name: string;
}

/**
 * LIFF Configuration by Path
 * เพิ่ม/แก้ไข LIFF IDs ตาม features ของแอป
 */
export const LIFF_CONFIGS: LiffConfig[] = [
  {
    liffId: process.env.NEXT_PUBLIC_LIFF_ID_POINTS || '',
    path: '/points',
    name: 'Points',
  },
  {
    liffId: process.env.NEXT_PUBLIC_LIFF_ID_COUPON || '',
    path: '/coupon',
    name: 'Coupon',
  },
  {
    liffId: process.env.NEXT_PUBLIC_LIFF_ID_PROFILE || '',
    path: '/profile',
    name: 'Profile',
  },
  {
    liffId: process.env.NEXT_PUBLIC_LIFF_ID_SETTING || '',
    path: '/setting',
    name: 'Setting',
  },
  // เพิ่ม LIFF IDs อื่นๆ ตามต้องการ
];

/**
 * Default LIFF ID สำหรับ paths ที่ไม่ได้ config ไว้
 */
export const DEFAULT_LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID_DEFAULT || '';

/**
 * หา LIFF ID จาก pathname
 * @param pathname - current path เช่น /points, /coupon/123
 * @returns LIFF ID ที่ตรงกับ path หรือ default
 */
export function getLiffIdByPath(pathname: string): string {
  // หา config ที่ path ตรงกัน (รองรับ nested paths)
  const config = LIFF_CONFIGS.find((c) => pathname.startsWith(c.path));
  return config?.liffId || DEFAULT_LIFF_ID;
}

/**
 * หา LIFF config ทั้งหมดจาก pathname
 */
export function getLiffConfigByPath(pathname: string): LiffConfig | null {
  return LIFF_CONFIGS.find((c) => pathname.startsWith(c.path)) || null;
}

/**
 * ตรวจสอบว่า path นี้ต้องใช้ LIFF หรือไม่
 */
export function isLiffPath(pathname: string): boolean {
  return LIFF_CONFIGS.some((c) => pathname.startsWith(c.path));
}
