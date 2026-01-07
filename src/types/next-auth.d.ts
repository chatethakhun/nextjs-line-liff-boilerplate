// src/types/next-auth.d.ts

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      // LIFF specific
      lineUserId?: string | null;
      // Login type
      loginType: 'credentials' | 'liff';
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    lineUserId?: string | null;
    loginType: 'credentials' | 'liff';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    lineUserId?: string | null;
    loginType: 'credentials' | 'liff';
  }
}
