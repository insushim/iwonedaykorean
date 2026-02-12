// =============================================================================
// HaruKorean (하루국어) - Authentication Utilities
// =============================================================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import type { Grade, Semester, UserProfile, UserRole, Domain } from '@/types';

// ---------------------------------------------------------------------------
// Sign Up
// ---------------------------------------------------------------------------

/**
 * Create a new user account with email and password,
 * then create the corresponding Firestore user profile.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
  grade: Grade,
  semester: Semester
): Promise<UserProfile> {
  // Create Firebase Auth account
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  // Update display name in Firebase Auth
  await updateProfile(user, { displayName });

  // Create Firestore user profile
  const profile = await createUserProfile(user.uid, {
    email,
    displayName,
    grade,
    semester,
  });

  return profile;
}

// ---------------------------------------------------------------------------
// Sign In
// ---------------------------------------------------------------------------

/**
 * Sign in with email and password.
 * Returns the user's Firestore profile.
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserProfile | null> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getUserProfile(credential.user.uid);
  return profile;
}

// ---------------------------------------------------------------------------
// Sign Out
// ---------------------------------------------------------------------------

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// ---------------------------------------------------------------------------
// Auth State Listener
// ---------------------------------------------------------------------------

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 */
export function onAuthStateChanged(
  callback: (user: User | null) => void
): Unsubscribe {
  return firebaseOnAuthStateChanged(auth, callback);
}

// ---------------------------------------------------------------------------
// User Profile CRUD
// ---------------------------------------------------------------------------

const DEFAULT_DOMAIN_SCORE = {
  score: 0,
  totalQuestions: 0,
  correctAnswers: 0,
};

/**
 * Create a new user profile document in Firestore.
 */
export async function createUserProfile(
  uid: string,
  data: {
    email: string;
    displayName: string;
    grade: Grade;
    semester: Semester;
    role?: UserRole;
  }
): Promise<UserProfile> {
  const now = new Date().toISOString();

  const profile: UserProfile = {
    uid,
    email: data.email,
    displayName: data.displayName,
    grade: data.grade,
    semester: data.semester,
    role: data.role || 'student',
    xp: 0,
    level: 1,
    streak: 0,
    longestStreak: 0,
    streakFreezeCount: 0,
    totalDaysCompleted: 0,
    coins: 0,
    badges: [],
    avatarId: 'default',
    stats: {
      domainScores: {
        reading: { domain: 'reading', ...DEFAULT_DOMAIN_SCORE },
        literature: { domain: 'literature', ...DEFAULT_DOMAIN_SCORE },
        grammar: { domain: 'grammar', ...DEFAULT_DOMAIN_SCORE },
      },
      totalSessions: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      averageAccuracy: 0,
      averageTimePerSession: 0,
    },
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, 'users', uid), profile);

  return profile;
}

/**
 * Get a user's profile from Firestore.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docSnap.data() as UserProfile;
}

/**
 * Update a user's profile in Firestore.
 * Only updates the fields provided in the data parameter.
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Update a user's domain score after completing a session.
 */
export async function updateDomainScore(
  uid: string,
  domain: Domain,
  correct: number,
  total: number
): Promise<void> {
  const profile = await getUserProfile(uid);
  if (!profile) return;

  const currentDomainScore = profile.stats.domainScores[domain];
  const newTotalQuestions = currentDomainScore.totalQuestions + total;
  const newCorrectAnswers = currentDomainScore.correctAnswers + correct;
  const newScore = newTotalQuestions > 0
    ? Math.round((newCorrectAnswers / newTotalQuestions) * 100)
    : 0;

  const updatedDomainScores = {
    ...profile.stats.domainScores,
    [domain]: {
      domain,
      score: newScore,
      totalQuestions: newTotalQuestions,
      correctAnswers: newCorrectAnswers,
    },
  };

  const newTotalQuestionsAnswered = profile.stats.totalQuestionsAnswered + total;
  const newTotalCorrectAnswers = profile.stats.totalCorrectAnswers + correct;
  const newAverageAccuracy = newTotalQuestionsAnswered > 0
    ? Math.round((newTotalCorrectAnswers / newTotalQuestionsAnswered) * 100)
    : 0;

  await updateUserProfile(uid, {
    stats: {
      ...profile.stats,
      domainScores: updatedDomainScores,
      totalQuestionsAnswered: newTotalQuestionsAnswered,
      totalCorrectAnswers: newTotalCorrectAnswers,
      averageAccuracy: newAverageAccuracy,
    },
  });
}

/**
 * Update streak information for a user.
 * Call this when a user completes their daily session.
 */
export async function updateStreak(uid: string): Promise<{
  newStreak: number;
  isNewRecord: boolean;
}> {
  const profile = await getUserProfile(uid);
  if (!profile) {
    return { newStreak: 0, isNewRecord: false };
  }

  const newStreak = profile.streak + 1;
  const isNewRecord = newStreak > profile.longestStreak;

  await updateUserProfile(uid, {
    streak: newStreak,
    longestStreak: isNewRecord ? newStreak : profile.longestStreak,
    totalDaysCompleted: profile.totalDaysCompleted + 1,
  });

  return { newStreak, isNewRecord };
}
