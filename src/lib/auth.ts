// src/lib/auth.ts

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXTERNAL_API_URL,
  timeout: 10000,
});

/**
 * Auth.js Configuration
 * รองรับ 2 แบบ: Credentials (username/password) และ LIFF
 */
export const authConfig: NextAuthConfig = {
  providers: [
    // Provider 1: Username/Password
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const response = await api.post('/auth/login', {
            username: credentials.username,
            password: credentials.password,
          });

          const data = response.data;

          // Return user object ตาม format ที่ต้องการ
          return {
            id: data.id || data.userId,
            name: data.name || data.username,
            email: data.email,
            loginType: 'credentials' as const,
          };
        } catch (error) {
          console.error('Credentials auth error:', error);
          return null;
        }
      },
    }),

    // Provider 2: LIFF (Custom Credentials)
    Credentials({
      id: 'liff',
      name: 'LINE LIFF',
      credentials: {
        lineUserId: { label: 'LINE User ID', type: 'text' },
        displayName: { label: 'Display Name', type: 'text' },
        pictureUrl: { label: 'Picture URL', type: 'text' },
        accessToken: { label: 'Access Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.lineUserId) {
          return null;
        }

        try {
          // Optional: Verify LIFF access token กับ backend API
          if (process.env.VERIFY_LIFF_WITH_BACKEND === 'true') {
            await api.post('/auth/liff/verify', {
              lineUserId: credentials.lineUserId,
              accessToken: credentials.accessToken,
            });
          }

          // Return user object with LINE info
          return {
            id: credentials.lineUserId as string,
            name: credentials.displayName as string,
            image: credentials.pictureUrl as string,
            lineUserId: credentials.lineUserId as string,
            loginType: 'liff' as const,
          };
        } catch (error) {
          console.error('LIFF auth error:', error);
          return null;
        }
      },
    }),
  ],

  // ใช้ JWT strategy (ไม่ต้อง database)
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },

  callbacks: {
    // JWT callback - เก็บข้อมูลเพิ่มเติมใน token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.lineUserId = user.lineUserId;
        token.loginType = user.loginType;
      }
      return token;
    },

    // Session callback - ส่งข้อมูลจาก token ไปยัง session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.lineUserId = token.lineUserId;
        session.user.loginType = token.loginType;
      }
      return session;
    },

    // Authorized callback - ใช้ใน middleware
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = nextUrl.pathname.startsWith('/points') ||
        nextUrl.pathname.startsWith('/coupon') ||
        nextUrl.pathname.startsWith('/profile');

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        // Redirect to login with callback URL
        return false;
      }

      return true;
    },
  },

  // Trust host for production
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
