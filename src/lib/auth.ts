// =============================================================================
// HaruKorean (하루국어) - Authentication Utilities (D1 + Web Crypto)
// =============================================================================

import { getDB, getEnv } from './db';
import type { UserProfile } from '@/types';

// ---------------------------------------------------------------------------
// Base64url encoding helper
// ---------------------------------------------------------------------------

function base64url(data: string | ArrayBuffer): string {
  const str =
    typeof data === 'string'
      ? btoa(data)
      : btoa(String.fromCharCode(...new Uint8Array(data)));
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ---------------------------------------------------------------------------
// Password Hashing (PBKDF2 via Web Crypto API)
// ---------------------------------------------------------------------------

/**
 * Hash a password using PBKDF2 with a random salt.
 * Returns "salt_hex:hash_hex".
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `${saltHex}:${hashHex}`;
}

/**
 * Verify a password against a stored "salt_hex:hash_hex" hash.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [saltHex, expectedHashHex] = storedHash.split(':');
  if (!saltHex || !expectedHashHex) return false;

  const salt = new Uint8Array(
    saltHex.match(/.{2}/g)!.map((byte) => parseInt(byte, 16))
  );

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return hashHex === expectedHashHex;
}

// ---------------------------------------------------------------------------
// JWT (HMAC-SHA256 via Web Crypto API)
// ---------------------------------------------------------------------------

/**
 * Create a JWT token with HMAC-SHA256 signature and 7-day expiry.
 */
export async function createJWT(
  userId: string,
  secret: string
): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    iat: Math.floor(Date.now() / 1000),
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(signingInput)
  );

  return `${signingInput}.${base64url(signature)}`;
}

/**
 * Verify and decode a JWT token.
 * Returns the payload if valid, null otherwise.
 */
export async function verifyJWT(
  token: string,
  secret: string
): Promise<{ userId: string; exp: number } | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Decode base64url signature back to ArrayBuffer
    const signatureStr = encodedSignature
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const signatureBytes = Uint8Array.from(atob(signatureStr), (c) =>
      c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      encoder.encode(signingInput)
    );

    if (!valid) return null;

    // Decode payload
    const payloadStr = atob(
      encodedPayload.replace(/-/g, '+').replace(/_/g, '/')
    );
    const payload = JSON.parse(payloadStr) as {
      userId: string;
      exp: number;
    };

    // Check expiry
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Auth User Extraction
// ---------------------------------------------------------------------------

/**
 * Extract and verify the authenticated user from a request.
 * Reads the 'token' cookie, verifies the JWT, and queries D1 for the user profile.
 */
export async function getAuthUser(
  request: Request
): Promise<UserProfile | null> {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;

    // Parse the 'token' cookie
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [key, ...val] = c.trim().split('=');
        return [key, val.join('=')];
      })
    );

    const token = cookies['token'];
    if (!token) return null;

    const env = await getEnv();
    const payload = await verifyJWT(token, env.JWT_SECRET);
    if (!payload) return null;

    const db = await getDB();
    const row = await db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(payload.userId)
      .first<Record<string, unknown>>();

    if (!row) return null;

    return rowToUserProfile(row);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// D1 Row to UserProfile Mapper
// ---------------------------------------------------------------------------

/**
 * Map a D1 database row to a UserProfile object.
 */
export function rowToUserProfile(row: Record<string, unknown>): UserProfile {
  const readingTotal = (row.reading_total as number) || 0;
  const readingCorrect = (row.reading_correct as number) || 0;
  const literatureTotal = (row.literature_total as number) || 0;
  const literatureCorrect = (row.literature_correct as number) || 0;
  const grammarTotal = (row.grammar_total as number) || 0;
  const grammarCorrect = (row.grammar_correct as number) || 0;

  const totalQuestions = readingTotal + literatureTotal + grammarTotal;
  const totalCorrect = readingCorrect + literatureCorrect + grammarCorrect;
  const averageAccuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return {
    uid: row.id as string,
    email: row.email as string,
    displayName: row.display_name as string,
    grade: row.grade as number as UserProfile['grade'],
    semester: row.semester as number as UserProfile['semester'],
    role: ((row.role as string) || 'student') as UserProfile['role'],
    parentLinkedTo: row.parent_linked_to as string | undefined,
    xp: (row.xp as number) || 0,
    level: (row.level as number) || 1,
    streak: (row.streak as number) || 0,
    longestStreak: (row.longest_streak as number) || 0,
    streakFreezeCount: (row.streak_freeze_count as number) || 0,
    totalDaysCompleted: (row.total_days_completed as number) || 0,
    coins: (row.coins as number) || 0,
    badges: JSON.parse((row.badges as string) || '[]'),
    avatarId: (row.avatar_id as string) || 'default',
    stats: {
      domainScores: {
        reading: {
          domain: 'reading',
          score: (row.reading_score as number) || 0,
          totalQuestions: readingTotal,
          correctAnswers: readingCorrect,
        },
        literature: {
          domain: 'literature',
          score: (row.literature_score as number) || 0,
          totalQuestions: literatureTotal,
          correctAnswers: literatureCorrect,
        },
        grammar: {
          domain: 'grammar',
          score: (row.grammar_score as number) || 0,
          totalQuestions: grammarTotal,
          correctAnswers: grammarCorrect,
        },
      },
      totalSessions: 0,
      totalQuestionsAnswered: totalQuestions,
      totalCorrectAnswers: totalCorrect,
      averageAccuracy,
      averageTimePerSession: 0,
    },
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
