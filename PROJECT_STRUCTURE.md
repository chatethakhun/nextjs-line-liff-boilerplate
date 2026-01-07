# Next.js 16 + LIFF Multi-ID + Auth.js Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts          # Auth.js API route
│   ├── (protected)/                  # Protected routes group
│   │   ├── layout.tsx                # Protected layout with auth check
│   │   ├── points/
│   │   │   └── page.tsx              # LIFF feature: points
│   │   ├── coupon/
│   │   │   └── page.tsx              # LIFF feature: coupon
│   │   └── profile/
│   │       └── page.tsx              # LIFF feature: profile
│   └── auth/
│       ├── login/
│       │   └── page.tsx              # Login page (credentials)
│       └── liff-callback/
│           └── page.tsx              # LIFF callback handler
│
├── components/
│   ├── providers/
│   │   ├── AuthProvider.tsx          # Auth.js SessionProvider
│   │   └── LiffProvider.tsx          # LIFF Provider with multi-ID support
│   ├── auth/
│   │   ├── LoginForm.tsx             # Username/password form
│   │   └── AuthGuard.tsx             # Protected route wrapper
│   └── liff/
│       └── LiffLoginButton.tsx       # LIFF login button
│
├── lib/
│   ├── auth.ts                       # Auth.js configuration
│   ├── auth.config.ts                # Auth.js edge config
│   └── liff/
│       ├── config.ts                 # LIFF IDs configuration by path
│       ├── client.ts                 # LIFF client utilities
│       └── types.ts                  # LIFF types
│
├── hooks/
│   ├── useLiff.ts                    # LIFF hook
│   └── useAuth.ts                    # Auth hook wrapper
│
├── types/
│   └── next-auth.d.ts                # Auth.js type extensions
│
└── middleware.ts                     # Auth middleware for protected routes
```

## Key Features

1. **Multi LIFF ID Support**: ยึดตาม path เช่น /points ใช้ LIFF_ID_POINTS
2. **Auth.js JWT Strategy**: ไม่ต้องใช้ database
3. **Dual Login**: LIFF + Credentials (username/password)
4. **Protected Routes**: ใช้ middleware + AuthGuard
5. **Redirect After Login**: กลับหน้าเดิมที่ user พยายามเข้า
