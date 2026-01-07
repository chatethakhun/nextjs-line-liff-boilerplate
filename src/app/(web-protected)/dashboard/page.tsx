// src/app/(web-protected)/dashboard/page.tsx

import Link from 'next/link';
import { auth } from '@/lib/auth';
import { LogoutButton } from './dashboard-client';

// Server Component
export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  // TODO: Fetch data from API on server
  const stats = {
    totalUsers: 1234,
    ordersToday: 56,
    monthlyRevenue: 89400,
  };

  const recentActivities = [
    { id: 1, message: 'ผู้ใช้ #1001 ลงทะเบียน', time: '2 ชั่วโมงที่แล้ว', status: 'success' },
    { id: 2, message: 'ผู้ใช้ #1002 ลงทะเบียน', time: '3 ชั่วโมงที่แล้ว', status: 'success' },
    { id: 3, message: 'ผู้ใช้ #1003 ลงทะเบียน', time: '4 ชั่วโมงที่แล้ว', status: 'success' },
    { id: 4, message: 'ผู้ใช้ #1004 ลงทะเบียน', time: '5 ชั่วโมงที่แล้ว', status: 'success' },
    { id: 5, message: 'ผู้ใช้ #1005 ลงทะเบียน', time: '6 ชั่วโมงที่แล้ว', status: 'success' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar + Header Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white h-screen shadow-md fixed">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
                >
                  หน้าหลัก
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/users"
                  className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  ผู้ใช้งาน
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/reports"
                  className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  รายงาน
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  ตั้งค่า
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
          {/* Header */}
          <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">ภาพรวม</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <LogoutButton />
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            {/* User Info Card - Server rendered */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ข้อมูลผู้ใช้
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ชื่อ</p>
                  <p className="font-medium">{user?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ประเภทการเข้าสู่ระบบ</p>
                  <p className="font-medium">
                    {user?.loginType === 'liff' ? 'LINE LIFF' : 'Username/Password'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium font-mono text-sm">{user?.id || '-'}</p>
                </div>
              </div>
            </div>

            {/* Stats Cards - Server rendered */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-500 mb-1">ผู้ใช้ทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-500 mb-1">คำสั่งซื้อวันนี้</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.ordersToday.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-500 mb-1">รายได้เดือนนี้</p>
                <p className="text-3xl font-bold text-gray-900">
                  ฿{stats.monthlyRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Recent Activity - Server rendered */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                กิจกรรมล่าสุด
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <span className="text-sm text-green-600">สำเร็จ</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
