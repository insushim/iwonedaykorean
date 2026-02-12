// =============================================================================
// HaruKorean - Login API Route
// =============================================================================

import { getDB, getEnv } from '@/lib/db';
import { verifyPassword, createJWT, rowToUserProfile } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as {
      email: string;
      password: string;
    };

    // -----------------------------------------------------------------------
    // Validation
    // -----------------------------------------------------------------------

    if (!email || typeof email !== 'string') {
      return Response.json(
        { success: false, error: '이메일을 입력해 주세요.' },
        { status: 400 },
      );
    }

    if (!password || typeof password !== 'string') {
      return Response.json(
        { success: false, error: '비밀번호를 입력해 주세요.' },
        { status: 400 },
      );
    }

    const db = await getDB();

    // -----------------------------------------------------------------------
    // Look up user by email
    // -----------------------------------------------------------------------

    const row = await db
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(email.toLowerCase())
      .first<Record<string, unknown>>();

    if (!row) {
      return Response.json(
        { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다' },
        { status: 401 },
      );
    }

    // -----------------------------------------------------------------------
    // Verify password
    // -----------------------------------------------------------------------

    const valid = await verifyPassword(password, row.password_hash as string);
    if (!valid) {
      return Response.json(
        { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다' },
        { status: 401 },
      );
    }

    // -----------------------------------------------------------------------
    // Create JWT & set cookie
    // -----------------------------------------------------------------------

    const env = await getEnv();
    const jwt = await createJWT(row.id as string, env.JWT_SECRET);
    const user = rowToUserProfile(row);

    const response = Response.json({ success: true, user });
    response.headers.set(
      'Set-Cookie',
      `token=${jwt}; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}; Path=/`,
    );
    return response;
  } catch (error) {
    console.error('로그인 오류:', error);
    return Response.json(
      { success: false, error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 },
    );
  }
}
