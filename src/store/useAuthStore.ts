// =============================================================================
// HaruKorean (하루국어) - Auth State Store (Zustand)
// Migrated from Firebase to custom API auth
// =============================================================================

'use client';

import { create } from 'zustand';
import type { UserProfile } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuthState {
  /** Current user profile (null if not logged in) */
  user: UserProfile | null;
  /** Whether auth state is being initialized/loaded */
  loading: boolean;
  /** Whether the auth listener has been initialized */
  initialized: boolean;
  /** Any auth-related error message */
  error: string | null;

  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<UserProfile>;
  signup: (email: string, password: string, displayName: string, grade: number, semester: number) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => void;
  setError: (error: string | null) => void;
  refreshUser: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAuthStore = create<AuthState>((set, get) => ({
  // State
  user: null,
  loading: true,
  initialized: false,
  error: null,

  // Actions
  initAuth: async () => {
    if (get().initialized) return;
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, loading: false, initialized: true });
      } else {
        set({ user: null, loading: false, initialized: true });
      }
    } catch {
      set({ user: null, loading: false, initialized: true });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        set({ loading: false, error: data.error || '로그인에 실패했습니다' });
        throw new Error(data.error || '로그인에 실패했습니다');
      }
      set({ user: data.user, loading: false, error: null });
      return data.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인에 실패했습니다';
      set({ loading: false, error: message });
      throw err;
    }
  },

  signup: async (email: string, password: string, displayName: string, grade: number, semester: number) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName, grade, semester }),
      });
      const data = await res.json();
      if (!res.ok) {
        set({ loading: false, error: data.error || '회원가입에 실패했습니다' });
        throw new Error(data.error || '회원가입에 실패했습니다');
      }
      set({ user: data.user, loading: false, error: null });
      return data.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : '회원가입에 실패했습니다';
      set({ loading: false, error: message });
      throw err;
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      set({ user: null, error: null });
    }
  },

  updateUser: (data: Partial<UserProfile>) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...data } });
    }
  },

  setError: (error: string | null) => set({ error }),

  refreshUser: async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user });
      }
    } catch {
      // silently fail
    }
  },
}));

export default useAuthStore;
