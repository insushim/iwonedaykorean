// =============================================================================
// HaruKorean (하루국어) - Leaderboard API Route
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Leaderboard entry type
// ---------------------------------------------------------------------------

interface LeaderboardEntry {
  rank: number;
  displayName: string;
  level: number;
  xp: number;
  streak: number;
  accuracy: number;
  isCurrentUser: boolean;
}

// ---------------------------------------------------------------------------
// Mock Korean student names
// ---------------------------------------------------------------------------

const KOREAN_NAMES: string[] = [
  '김민준',
  '이서윤',
  '박지호',
  '최수아',
  '정예준',
  '강하은',
  '조민서',
  '윤도윤',
  '장서연',
  '임하준',
  '한지우',
  '오시우',
  '서예린',
  '신유준',
  '권지민',
  '황준서',
  '문다은',
  '송승현',
  '배서현',
  '백지훈',
];

// ---------------------------------------------------------------------------
// Generate mock leaderboard data
// ---------------------------------------------------------------------------

function generateMockLeaderboard(
  grade: number | null,
  period: string,
): LeaderboardEntry[] {
  // Use a seed based on grade + period so results are consistent for
  // the same query but vary across different queries.
  let baseSeed = 42;
  if (grade) baseSeed += grade * 1000;
  if (period === 'monthly') baseSeed += 500;

  // Simple deterministic pseudo-random number generator
  let currentSeed = baseSeed;
  function nextRandom(): number {
    currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
    return currentSeed / 0x7fffffff;
  }

  const entryCount = 15 + Math.floor(nextRandom() * 6); // 15-20 entries
  const entries: LeaderboardEntry[] = [];

  for (let i = 0; i < Math.min(entryCount, KOREAN_NAMES.length); i++) {
    const name = KOREAN_NAMES[i];

    // Generate realistic stats that decrease with rank
    const baseXP = period === 'monthly' ? 5000 : 1500;
    const xpVariance = Math.floor(nextRandom() * 300);
    const xp = Math.max(50, baseXP - i * (period === 'monthly' ? 250 : 80) + xpVariance);

    const level = Math.max(1, Math.min(50, Math.floor(Math.sqrt(xp / 50)) + 1));
    const streak = Math.max(0, Math.floor(15 - i * 0.8 + nextRandom() * 5));
    const accuracy = Math.max(
      50,
      Math.min(100, Math.round(95 - i * 1.5 + nextRandom() * 8)),
    );

    entries.push({
      rank: i + 1,
      displayName: name,
      level,
      xp,
      streak,
      accuracy,
      isCurrentUser: false,
    });
  }

  // Sort by XP descending (should already be roughly sorted, but ensure it)
  entries.sort((a, b) => b.xp - a.xp);

  // Re-assign ranks after sorting
  entries.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  // Mark one entry as current user (somewhere in the middle-to-upper range)
  const currentUserIndex = Math.min(
    entries.length - 1,
    2 + Math.floor(nextRandom() * 5),
  );
  if (entries[currentUserIndex]) {
    entries[currentUserIndex].isCurrentUser = true;
  }

  return entries;
}

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gradeParam = searchParams.get('grade');
    const period = searchParams.get('period') || 'weekly';

    // Validate period
    if (period !== 'weekly' && period !== 'monthly') {
      return NextResponse.json(
        { success: false, error: 'period는 "weekly" 또는 "monthly"여야 합니다.' },
        { status: 400 },
      );
    }

    // Parse optional grade filter
    let grade: number | null = null;
    if (gradeParam) {
      const parsedGrade = parseInt(gradeParam, 10);
      if (isNaN(parsedGrade) || parsedGrade < 1 || parsedGrade > 6) {
        return NextResponse.json(
          { success: false, error: 'grade는 1~6 사이의 숫자여야 합니다.' },
          { status: 400 },
        );
      }
      grade = parsedGrade;
    }

    // Generate mock leaderboard
    // In production, this would query Firestore with appropriate filters.
    const entries = generateMockLeaderboard(grade, period);

    const response: {
      entries: LeaderboardEntry[];
      period: string;
      grade?: number;
    } = {
      entries,
      period,
    };

    if (grade !== null) {
      response.grade = grade;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('리더보드 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '리더보드를 불러오는 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}
