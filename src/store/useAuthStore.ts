// =============================================================================
// HaruKorean (하루국어) - Auth State Store (Zustand)
// =============================================================================

import { create } from 'zustand';
import type { UserProfile } from '@/types';
import { onAuthStateChanged, getUserProfile } from '@/lib/auth';

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
}

interface AuthActions {
  /** Set the current user profile */
  setUser: (user: UserProfile | null) => void;
  /** Clear the current user (logout) */
  clearUser: () => void;
  /** Set the loading state */
  setLoading: (loading: boolean) => void;
  /** Set an error message */
  setError: (error: string | null) => void;
  /** Initialize the Firebase auth state listener */
  initAuth: () => () => void;
  /** Update specific fields of the current user profile in the store */
  updateUser: (data: Partial<UserProfile>) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  // State
  user: null,
  loading: true,
  initialized: false,
  error: null,

  // Actions
  setUser: (user) => set({ user, loading: false, error: null }),

  clearUser: () => set({ user: null, loading: false, error: null }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error, loading: false }),

  updateUser: (data) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, ...data } });
    }
  },

  initAuth: () => {
    // Prevent multiple initializations
    if (get().initialized) {
      return () => {};
    }

    set({ initialized: true, loading: true });

    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch the full user profile from Firestore
          const profile = await getUserProfile(firebaseUser.uid);

          if (profile) {
            set({ user: profile, loading: false, error: null });
          } else {
            // User exists in Auth but not in Firestore
            // This shouldn't happen in normal flow, but handle gracefully
            set({
              user: null,
              loading: false,
              error: '사용자 프로필을 찾을 수 없습니다.',
            });
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : '프로필을 불러오는 중 오류가 발생했습니다.';
          set({ user: null, loading: false, error: errorMessage });
        }
      } else {
        // User is signed out
        set({ user: null, loading: false, error: null });
      }
    });

    return unsubscribe;
  },
}));
