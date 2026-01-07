// src/lib/liff/types.ts

import type { Liff } from '@line/liff';

export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface LiffContextValue {
  liff: Liff | null;
  liffError: string | null;
  isLiffInitialized: boolean;
  isLiffLoggedIn: boolean;
  isInLiffClient: boolean;
  profile: LiffProfile | null;
  currentLiffId: string | null;
  login: () => void;
  logout: () => void;
}

export interface LiffProviderProps {
  children: React.ReactNode;
}

export type LiffLoginRedirectState = {
  returnUrl: string;
  liffId: string;
};
