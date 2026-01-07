# Next.js 16 + LINE LIFF Multi-ID + Auth.js

โปรเจคนี้เป็นตัวอย่างการรวม Next.js 16 (App Router) กับ LINE LIFF หลาย ID และ Auth.js สำหรับระบบ Authentication

## ✨ Features

- 🔐 **Dual Authentication**: รองรับ login ทั้ง LINE LIFF และ Username/Password
- 📱 **Multi LIFF ID**: รองรับ LIFF หลาย ID ตาม path/route
- 🔄 **Smart Redirect**: redirect กลับหน้าเดิมหลัง login
- 🛡️ **Protected Routes**: ใช้ middleware + AuthGuard
- 🍪 **JWT Session**: ไม่ต้องใช้ database

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   ├── api/auth/[...nextauth]/       # Auth.js API route
│   ├── (protected)/                  # Protected routes group
│   │   ├── layout.tsx                # Protected layout (LIFF + Auth)
│   │   ├── points/page.tsx
│   │   ├── coupon/page.tsx
│   │   └── profile/page.tsx
│   └── auth/
│       ├── login/page.tsx            # Login page
│       └── liff-callback/page.tsx    # LIFF callback handler
├── components/
│   ├── providers/
│   │   ├── AuthProvider.tsx          # Auth.js SessionProvider
│   │   └── LiffProvider.tsx          # LIFF Provider (multi-ID)
│   └── auth/
│       └── AuthGuard.tsx             # Protected route wrapper
├── hooks/
│   ├── useLiff.ts                    # LIFF hooks
│   └── useAuth.ts                    # Auth hooks
├── lib/
│   ├── auth.ts                       # Auth.js configuration
│   └── liff/
│       ├── config.ts                 # LIFF IDs by path
│       ├── client.ts                 # LIFF utilities
│       └── types.ts                  # LIFF types
└── middleware.ts                     # Auth middleware
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

แก้ไข `.env.local`:

```env
# Auth.js
AUTH_SECRET=your-super-secret-key

# External API
EXTERNAL_API_URL=https://your-api.example.com

# LIFF IDs
NEXT_PUBLIC_LIFF_ID_DEFAULT=1234567890-abcdefgh
NEXT_PUBLIC_LIFF_ID_POINTS=1234567890-points123
NEXT_PUBLIC_LIFF_ID_COUPON=1234567890-coupon123
NEXT_PUBLIC_LIFF_ID_PROFILE=1234567890-profile12
```

### 3. Configure LINE Developer Console

สำหรับแต่ละ LIFF ID ใน LINE Developer Console:

1. ไปที่ LIFF App ของคุณ
2. ตั้งค่า Endpoint URL:
   - `/points` → `https://your-domain.com/points`
   - `/coupon` → `https://your-domain.com/coupon`
   - `/profile` → `https://your-domain.com/profile`

### 4. Run development server

```bash
npm run dev
```

## 📱 How It Works

### Authentication Flow

```
User เข้า /points (protected route)
    ↓
Middleware เช็ค: ยังไม่ login
    ↓
Redirect → /auth/liff-callback?callbackUrl=/points&liffId=xxx
    ↓
LiffCallback: Init LIFF → LIFF Login
    ↓
LIFF redirect กลับ → ดึง profile
    ↓
signIn('liff', { lineUserId, ... })
    ↓
Auth.js สร้าง JWT session
    ↓
Redirect → /points (หน้าเดิม)
```

### Multi LIFF ID

LIFF ID ถูกเลือกตาม path:

```typescript
// src/lib/liff/config.ts
export const LIFF_CONFIGS = [
  { liffId: 'xxx-points', path: '/points' },
  { liffId: 'xxx-coupon', path: '/coupon' },
  { liffId: 'xxx-profile', path: '/profile' },
];
```

### Dual Login Support

1. **LINE LIFF**: ใช้เมื่อเข้าผ่าน LINE app หรือเลือก login ด้วย LINE
2. **Credentials**: Username/Password ผ่าน external API

## 🔧 Customization

### เพิ่ม LIFF ID ใหม่

1. เพิ่มใน `.env.local`:
```env
NEXT_PUBLIC_LIFF_ID_NEWFEATURE=xxx-newfeature
```

2. เพิ่มใน `src/lib/liff/config.ts`:
```typescript
{
  liffId: process.env.NEXT_PUBLIC_LIFF_ID_NEWFEATURE || '',
  path: '/newfeature',
  name: 'New Feature',
}
```

3. เพิ่ม protected route ใน middleware:
```typescript
const protectedRoutes = ['/points', '/coupon', '/profile', '/newfeature'];
```

### Customize Auth.js

แก้ไข `src/lib/auth.ts` สำหรับ:
- เปลี่ยน API endpoint
- เพิ่ม session data
- เปลี่ยน JWT expiration

## 🔒 Security Notes

- JWT token ถูก encrypt ด้วย `AUTH_SECRET`
- LIFF token สามารถ verify กับ backend ได้ (optional)
- Protected routes มี double protection (middleware + AuthGuard)

## 📝 License

MIT
