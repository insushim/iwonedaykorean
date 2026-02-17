import { getDB } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDB();

    // Get Monday of this week
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const rows = await db
      .prepare(
        'SELECT date, status FROM sessions WHERE user_id = ? AND date >= ? AND date <= ?',
      )
      .bind(user.uid, dates[0], dates[6])
      .all<{ date: string; status: string }>();

    const sessionDates = new Set(
      (rows.results || []).map((r) => r.date),
    );

    const weekCompletion = dates.map((d) => sessionDates.has(d));

    return Response.json({ success: true, weekCompletion, dates });
  } catch (error) {
    console.error('weekly sessions error:', error);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
