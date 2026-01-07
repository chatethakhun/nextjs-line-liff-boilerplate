// src/app/(protected)/coupon/page.tsx

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useLiff } from '@/components/providers/LiffProvider';

const MOCK_COUPONS = [
  {
    id: '1',
    title: 'ส่วนลด 50 บาท',
    description: 'สำหรับการสั่งซื้อขั้นต่ำ 200 บาท',
    expiresAt: '2024-12-31',
    code: 'SAVE50',
  },
  {
    id: '2',
    title: 'ส่วนลด 10%',
    description: 'สำหรับสินค้าทุกชิ้น',
    expiresAt: '2024-11-30',
    code: 'PERCENT10',
  },
  {
    id: '3',
    title: 'จัดส่งฟรี',
    description: 'ไม่มีขั้นต่ำ',
    expiresAt: '2024-12-15',
    code: 'FREESHIP',
  },
];

export default function CouponPage() {
  const { user, logout } = useAuth();
  const { currentLiffId } = useLiff();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Coupon</h1>
            <button
              onClick={() => logout()}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            สวัสดี, {user?.name || 'ผู้ใช้'}
          </h2>
          <p className="text-gray-600">คูปองของคุณ</p>
        </div>

        {/* Coupon List */}
        <div className="space-y-4">
          {MOCK_COUPONS.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="flex">
                {/* Left Side - Icon */}
                <div className="bg-orange-500 w-24 flex items-center justify-center text-white">
                  <span className="text-3xl">🎫</span>
                </div>

                {/* Right Side - Content */}
                <div className="flex-1 p-4">
                  <h3 className="font-semibold text-gray-900">{coupon.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {coupon.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      หมดอายุ: {coupon.expiresAt}
                    </span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {coupon.code}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 rounded-lg p-4 mt-6">
            <p className="text-xs text-gray-600">
              Current LIFF ID: {currentLiffId}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
