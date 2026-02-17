import { getDB } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { getTodayDateString } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDB();
    const today = getTodayDateString();

    const row = await db
      .prepare('SELECT id, status FROM sessions WHERE user_id = ? AND date = ?')
      .bind(user.uid, today)
      .first<{ id: string; status: string }>();

    return Response.json({
      success: true,
      status: row?.status || 'not_started',
      sessionId: row?.id || null,
    });
  } catch (error) {
    console.error('today session error:', error);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
