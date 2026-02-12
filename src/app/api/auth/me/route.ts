// =============================================================================
// HaruKorean - Current User (Me) API Route
// =============================================================================

import { getAuthUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return Response.json({ user: null }, { status: 200 });
    }

    return Response.json({ user });
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    return Response.json({ user: null }, { status: 200 });
  }
}
