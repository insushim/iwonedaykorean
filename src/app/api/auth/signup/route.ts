// =============================================================================
// HaruKorean - Signup API Route
// =============================================================================

import { getDB, getEnv } from '@/lib/db';
import { hashPassword, createJWT, rowToUserProfile } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, displayName, grade, semester } = body as {
      email: string;
      password: string;
      displayName: string;
      grade: number;
      semester: number;
    };

    // -----------------------------------------------------------------------
    // Validation
    // -----------------------------------------------------------------------

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { success: false, error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 },
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return Response.json(
        { success: false, error: '비밀번호는 6자 이상이어야 합니다.' },
        { status: 400 },
      );
    }

    if (!displayName || typeof displayName !== 'string' || displayName.trim().length === 0) {
      return Response.json(
        { success: false, error: '이름을 입력해 주세요.' },
        { status: 400 },
      );
    }

    if (!grade || typeof grade !== 'number' || grade < 1 || grade > 6) {
      return Response.json(
        { success: false, error: '학년은 1~6 사이여야 합니다.' },
        { status: 400 },
      );
    }

    if (!semester || (semester !== 1 && semester !== 2)) {
      return Response.json(
        { success: false, error: '학기는 1 또는 2여야 합니다.' },
        { status: 400 },
      );
    }

    const db = await getDB();

    // -----------------------------------------------------------------------
    // Check for existing email
    // -----------------------------------------------------------------------

    const existing = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(email.toLowerCase())
      .first();

    if (existing) {
      return Response.json(
        { success: false, error: '이미 등록된 이메일입니다.' },
        { status: 409 },
      );
    }

    // -----------------------------------------------------------------------
    // Create user
    // -----------------------------------------------------------------------

    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO users (
          id, email, password_hash, display_name,
          grade, semester, role,
          xp, level, streak, longest_streak, streak_freeze_count,
          total_days_completed, coins, badges, avatar_id,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'student', 0, 1, 0, 0, 0, 0, 0, '[]', 'default', ?, ?)`,
      )
      .bind(
        userId,
        email.toLowerCase(),
        passwordHash,
        displayName.trim(),
        grade,
        semester,
        now,
        now,
      )
      .run();

    // -----------------------------------------------------------------------
    // Create JWT & set cookie
    // -----------------------------------------------------------------------

    const env = await getEnv();
    const jwt = await createJWT(userId, env.JWT_SECRET);

    const row = await db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first<Record<string, unknown>>();

    const user = rowToUserProfile(row!);

    const response = Response.json({ success: true, user });
    response.headers.set(
      'Set-Cookie',
      `token=${jwt}; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}; Path=/`,
    );
    return response;
  } catch (error) {
    console.error('회원가입 오류:', error);
    return Response.json(
      { success: false, error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 },
    );
  }
}
