// =============================================================================
// HaruKorean - Leaderboard API Route
// =============================================================================

import { getDB } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const gradeParam = url.searchParams.get('grade');
    const period = url.searchParams.get('period') || 'weekly';

    // Validate period
    if (period !== 'weekly' && period !== 'monthly') {
      return Response.json(
        { success: false, error: 'period는 "weekly" 또는 "monthly"여야 합니다.' },
        { status: 400 },
      );
    }

    // Parse optional grade filter
    let grade: number | null = null;
    if (gradeParam) {
      const parsedGrade = parseInt(gradeParam, 10);
      if (isNaN(parsedGrade) || parsedGrade < 1 || parsedGrade > 6) {
        return Response.json(
          { success: false, error: 'grade는 1~6 사이의 숫자여야 합니다.' },
          { status: 400 },
        );
      }
      grade = parsedGrade;
    }

    // Try to identify the current user
    const authUser = await getAuthUser(request);
    const currentUserId = authUser?.uid || null;

    const db = await getDB();

    // -----------------------------------------------------------------------
    // Calculate the date range for the period
    // -----------------------------------------------------------------------

    const now = new Date();
    const periodDays = period === 'weekly' ? 7 : 30;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - periodDays);
    const startDateStr = startDate.toISOString().split('T')[0];

    // -----------------------------------------------------------------------
    // Query users with their XP from sessions in the period
    // -----------------------------------------------------------------------

    let query: string;
    const bindings: unknown[] = [startDateStr];

    if (grade !== null) {
      query = `
        SELECT
          u.id, u.display_name, u.avatar_id, u.grade, u.level, u.xp, u.streak,
          u.total_days_completed,
          COALESCE(SUM(s.xp_earned), 0) as weekly_xp
        FROM users u
        LEFT JOIN sessions s ON s.user_id = u.id AND s.date >= ? AND s.status = 'completed'
        WHERE u.grade = ?
        GROUP BY u.id
        ORDER BY weekly_xp DESC
        LIMIT 20
      `;
      bindings.push(grade);
    } else {
      query = `
        SELECT
          u.id, u.display_name, u.avatar_id, u.grade, u.level, u.xp, u.streak,
          u.total_days_completed,
          COALESCE(SUM(s.xp_earned), 0) as weekly_xp
        FROM users u
        LEFT JOIN sessions s ON s.user_id = u.id AND s.date >= ? AND s.status = 'completed'
        GROUP BY u.id
        ORDER BY weekly_xp DESC
        LIMIT 20
      `;
    }

    const result = await db.prepare(query).bind(...bindings).all<Record<string, unknown>>();

    const entries = (result.results || []).map((row, idx) => ({
      rank: idx + 1,
      uid: row.id as string,
      displayName: row.display_name as string,
      avatarId: (row.avatar_id as string) || 'default',
      grade: row.grade as number,
      level: (row.level as number) || 1,
      xp: (row.xp as number) || 0,
      streak: (row.streak as number) || 0,
      totalDaysCompleted: (row.total_days_completed as number) || 0,
      weeklyXp: (row.weekly_xp as number) || 0,
      isCurrentUser: currentUserId ? (row.id as string) === currentUserId : false,
    }));

    const responseBody: {
      entries: typeof entries;
      period: string;
      grade?: number;
    } = {
      entries,
      period,
    };

    if (grade !== null) {
      responseBody.grade = grade;
    }

    return Response.json(responseBody);
  } catch (error) {
    console.error('리더보드 조회 오류:', error);
    return Response.json(
      {
        success: false,
        error: '리더보드를 불러오는 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}
