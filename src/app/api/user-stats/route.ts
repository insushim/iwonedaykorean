// =============================================================================
// HaruKorean - User Stats API Route
// =============================================================================

import { getDB } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { ACHIEVEMENTS } from '@/data/gamification';

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    let userId = url.searchParams.get('userId');

    // Try authenticated user first
    const authUser = await getAuthUser(request);
    if (authUser) {
      userId = authUser.uid;
    }

    if (!userId) {
      return Response.json(
        { success: false, error: 'userId 파라미터가 필요합니다.' },
        { status: 400 },
      );
    }

    const db = await getDB();

    // -----------------------------------------------------------------------
    // Fetch user from D1
    // -----------------------------------------------------------------------

    const userRow = await db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first<Record<string, unknown>>();

    if (!userRow) {
      return Response.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // -----------------------------------------------------------------------
    // Query sessions for weekly data (last 7 days)
    // -----------------------------------------------------------------------

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const weekStart = sevenDaysAgo.toISOString().split('T')[0];

    const weeklySessionRows = await db
      .prepare(
        'SELECT date, status, correct_on_first_try, total_questions FROM sessions WHERE user_id = ? AND date >= ? ORDER BY date ASC',
      )
      .bind(userId, weekStart)
      .all<Record<string, unknown>>();

    const weeklySessionMap = new Map<string, { completed: boolean; score: number }>();
    if (weeklySessionRows.results) {
      for (const row of weeklySessionRows.results) {
        const date = row.date as string;
        const completed = row.status === 'completed';
        const totalQ = (row.total_questions as number) || 1;
        const correctFirst = (row.correct_on_first_try as number) || 0;
        const score = Math.round((correctFirst / totalQ) * 100);
        weeklySessionMap.set(date, { completed, score });
      }
    }

    // Build weekly data array for last 7 days
    const weeklyData: Array<{ date: string; completed: boolean; score?: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const sessionInfo = weeklySessionMap.get(dateStr);
      weeklyData.push({
        date: dateStr,
        completed: sessionInfo?.completed ?? false,
        score: sessionInfo?.score,
      });
    }

    // -----------------------------------------------------------------------
    // Query total sessions and questions
    // -----------------------------------------------------------------------

    const sessionStatsRow = await db
      .prepare(
        `SELECT
          COUNT(*) as total_sessions,
          COALESCE(SUM(total_questions), 0) as total_questions,
          COALESCE(SUM(correct_on_first_try), 0) as correct_answers,
          COALESCE(AVG(time_spent_seconds), 0) as avg_time
        FROM sessions WHERE user_id = ? AND status = 'completed'`,
      )
      .bind(userId)
      .first<Record<string, unknown>>();

    const totalSessions = (sessionStatsRow?.total_sessions as number) || 0;
    const totalQuestions = (sessionStatsRow?.total_questions as number) || 0;
    const correctAnswers = (sessionStatsRow?.correct_answers as number) || 0;
    const averageAccuracy = totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;
    const averageTime = Math.round((sessionStatsRow?.avg_time as number) || 0);

    // -----------------------------------------------------------------------
    // Query wrong notes count
    // -----------------------------------------------------------------------

    const wrongNotesRow = await db
      .prepare('SELECT COUNT(*) as count FROM wrong_notes WHERE user_id = ? AND reviewed = 0')
      .bind(userId)
      .first<Record<string, unknown>>();

    const wrongNotesCount = (wrongNotesRow?.count as number) || 0;

    // -----------------------------------------------------------------------
    // Build recent achievements
    // -----------------------------------------------------------------------

    const badges: string[] = JSON.parse((userRow.badges as string) || '[]');
    const recentAchievements = badges
      .slice(-5)
      .map((badgeId) => {
        const achievement = ACHIEVEMENTS.find((a) => a.id === badgeId);
        if (!achievement) return null;
        return {
          id: achievement.id,
          name: achievement.name,
          icon: achievement.icon,
          earnedAt: userRow.updated_at as string,
        };
      })
      .filter((a): a is NonNullable<typeof a> => a !== null);

    // -----------------------------------------------------------------------
    // Build response
    // -----------------------------------------------------------------------

    const stats = {
      totalDaysCompleted: (userRow.total_days_completed as number) || 0,
      currentStreak: (userRow.streak as number) || 0,
      longestStreak: (userRow.longest_streak as number) || 0,
      totalQuestions,
      correctAnswers,
      averageAccuracy,
      averageTimePerSession: averageTime,
      domainScores: {
        reading: (userRow.reading_score as number) || 0,
        literature: (userRow.literature_score as number) || 0,
        grammar: (userRow.grammar_score as number) || 0,
      },
      recentAchievements,
      level: (userRow.level as number) || 1,
      xp: (userRow.xp as number) || 0,
      coins: (userRow.coins as number) || 0,
      weeklyData,
      wrongNotesCount,
      totalSessions,
    };

    return Response.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('사용자 통계 조회 오류:', error);
    return Response.json(
      {
        success: false,
        error: '사용자 통계를 불러오는 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}
