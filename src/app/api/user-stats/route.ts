// =============================================================================
// HaruKorean (하루국어) - User Stats API Route
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// UserStats response shape
// ---------------------------------------------------------------------------

interface UserStatsResponse {
  totalDaysCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalQuestions: number;
  correctAnswers: number;
  averageAccuracy: number;
  domainScores: {
    reading: number;
    literature: number;
    grammar: number;
  };
  recentAchievements: Array<{
    id: string;
    name: string;
    icon: string;
    earnedAt: string;
  }>;
  level: number;
  xp: number;
  coins: number;
  weeklyData: Array<{
    date: string;
    completed: boolean;
    score?: number;
  }>;
}

// ---------------------------------------------------------------------------
// Generate realistic mock data
// ---------------------------------------------------------------------------

function generateMockStats(userId: string): UserStatsResponse {
  // Derive pseudo-random but deterministic values from userId
  // so the same user always gets consistent mock data.
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const seed = Math.abs(hash);

  const totalDaysCompleted = 10 + (seed % 50);
  const currentStreak = 1 + (seed % 14);
  const longestStreak = Math.max(currentStreak, 5 + (seed % 30));
  const totalQuestions = totalDaysCompleted * 14;
  const accuracyBase = 65 + (seed % 30); // 65-94%
  const correctAnswers = Math.round(totalQuestions * (accuracyBase / 100));
  const averageAccuracy = Math.round((correctAnswers / totalQuestions) * 100);

  const readingScore = 60 + (seed % 35);
  const literatureScore = 55 + ((seed >> 3) % 40);
  const grammarScore = 50 + ((seed >> 6) % 45);

  const xp = totalDaysCompleted * 120 + correctAnswers * 8;
  const level = Math.max(1, Math.min(50, Math.floor(Math.sqrt(xp / 100)) + 1));
  const coins = totalDaysCompleted * 12 + Math.floor(xp / 50);

  // Weekly data: last 7 days
  const weeklyData: UserStatsResponse['weeklyData'] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    // Determine if completed: higher chance for recent streak days
    const completed = i < currentStreak || (seed + i) % 3 !== 0;
    const score = completed ? 60 + ((seed + i * 7) % 35) : undefined;

    weeklyData.push({ date: dateStr, completed, score });
  }

  // Recent achievements
  const possibleAchievements = [
    { id: 'streak_3', name: '3일 연속 학습', icon: '\uD83D\uDD25' },
    { id: 'streak_7', name: '일주일 연속 학습', icon: '\uD83D\uDD25' },
    { id: 'complete_1', name: '첫 학습 완료', icon: '\uD83D\uDCD6' },
    { id: 'complete_7', name: '7일 학습 완료', icon: '\uD83D\uDCD6' },
    { id: 'perfect_day_1', name: '첫 만점의 날', icon: '\u2B50' },
    { id: 'accuracy_80', name: '정확도 80% 달성', icon: '\uD83C\uDFAF' },
    { id: 'questions_100', name: '100문제 해결', icon: '\u270F\uFE0F' },
  ];

  const numAchievements = Math.min(possibleAchievements.length, 2 + (seed % 4));
  const recentAchievements = possibleAchievements
    .slice(0, numAchievements)
    .map((a, idx) => {
      const earnedDate = new Date(today);
      earnedDate.setDate(earnedDate.getDate() - idx * 3);
      return {
        ...a,
        earnedAt: earnedDate.toISOString(),
      };
    });

  return {
    totalDaysCompleted,
    currentStreak,
    longestStreak,
    totalQuestions,
    correctAnswers,
    averageAccuracy,
    domainScores: {
      reading: readingScore,
      literature: literatureScore,
      grammar: grammarScore,
    },
    recentAchievements,
    level,
    xp,
    coins,
    weeklyData,
  };
}

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId 파라미터가 필요합니다.' },
        { status: 400 },
      );
    }

    // Generate mock stats for the user
    // In production, this would fetch from Firestore.
    const stats = generateMockStats(userId);

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('사용자 통계 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '사용자 통계를 불러오는 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}
