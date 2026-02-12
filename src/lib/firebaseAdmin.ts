// =============================================================================
// HaruKorean (하루국어) - Server-side Firebase Utilities
// =============================================================================
//
// NOTE: This project deploys to Cloudflare Pages (edge runtime), which does
// not support the Node.js-only firebase-admin SDK. Instead, we re-export the
// Firebase client SDK instances for use in server components and server actions.
//
// For admin-level operations (e.g., custom token minting, user management),
// use Firebase REST API endpoints or a separate Cloud Functions backend.
// =============================================================================

import { db, auth } from './firebase';

// Re-export client SDK instances for server-side usage.
// In server components and server actions, these work fine because the Firebase
// client SDK is compatible with edge runtime.
export const adminDb = db;
export const adminAuth = auth;

// ---------------------------------------------------------------------------
// Firebase REST API helpers (for operations that would normally need Admin SDK)
// ---------------------------------------------------------------------------

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

/**
 * Verify an ID token using the Firebase REST API.
 * This is a lightweight alternative to adminAuth.verifyIdToken().
 */
export async function verifyIdToken(idToken: string): Promise<{
  localId: string;
  email: string;
  displayName?: string;
} | null> {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const user = data.users?.[0];
    if (!user) return null;

    return {
      localId: user.localId,
      email: user.email,
      displayName: user.displayName,
    };
  } catch {
    return null;
  }
}

/**
 * Get a Firestore document using the REST API.
 * Useful for server-side reads without client SDK initialization issues.
 */
export async function getDocumentREST(
  collection: string,
  documentId: string
): Promise<Record<string, unknown> | null> {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${collection}/${documentId}`;
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.fields ?? null;
  } catch {
    return null;
  }
}
