// =============================================================================
// HaruKorean (하루국어) - Utility Functions
// =============================================================================

import type { Domain, GradeGroup, Grade, LevelThreshold } from '@/types';

// ---------------------------------------------------------------------------
// className merging (clsx + twMerge-like)
// ---------------------------------------------------------------------------

type ClassValue = string | number | boolean | undefined | null | ClassValue[];

/**
 * Merge class names, filtering out falsy values.
 * Simple implementation that handles conditional classes.
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input && input !== 0) continue;
    if (typeof input === 'boolean') continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    }
  }

  return classes.join(' ').replace(/\s+/g, ' ').trim();
}

// ---------------------------------------------------------------------------
// Date Formatting
// ---------------------------------------------------------------------------

/**
 * Format a date to Korean locale string.
 * @param date - Date object or ISO string
 * @param format - 'full' | 'short' | 'date-only' | 'time-only'
 */
export function formatDate(
  date: Date | string,
  format: 'full' | 'short' | 'date-only' | 'time-only' = 'full'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  switch (format) {
    case 'full':
      return d.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      });
    case 'short':
      return d.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
      });
    case 'date-only':
      return d.toISOString().split('T')[0]; // YYYY-MM-DD
    case 'time-only':
      return d.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });
  }
}

/**
 * Get today's date as a YYYY-MM-DD string in local timezone.
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ---------------------------------------------------------------------------
// Level & XP Calculations
// ---------------------------------------------------------------------------

/**
 * Level thresholds using an exponential curve.
 * Each level requires progressively more XP.
 * Formula: xpRequired = floor(100 * level^1.5)
 */
const LEVEL_TITLES: Record<number, string> = {
  1: '새싹 학습자',
  2: '호기심 탐험가',
  3: '열심 독서가',
  4: '꼼꼼 분석가',
  5: '지식 수집가',
  6: '논리 추론가',
  7: '문장 마법사',
  8: '어휘 달인',
  9: '국어 박사',
  10: '학습 챔피언',
  11: '지혜의 별',
  12: '국어 마스터',
  13: '전설의 학자',
  14: '빛나는 지성',
  15: '하루국어 전설',
};

/**
 * Calculate the XP required to reach a specific level.
 */
export function calculateXPForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculate the user's level based on total XP.
 * Returns the highest level where xpRequired <= totalXP.
 */
export function calculateLevel(xp: number): number {
  let level = 1;
  while (calculateXPForLevel(level + 1) <= xp) {
    level++;
    if (level >= 99) break; // Safety cap
  }
  return level;
}

/**
 * Get the full level threshold info for a given level.
 */
export function getLevelThreshold(level: number): LevelThreshold {
  return {
    level,
    xpRequired: calculateXPForLevel(level),
    title: LEVEL_TITLES[level] || `레벨 ${level} 학습자`,
  };
}

/**
 * Calculate progress percentage toward the next level.
 */
export function getLevelProgress(xp: number): {
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
  progress: number; // 0-100
  title: string;
} {
  const currentLevel = calculateLevel(xp);
  const currentLevelXP = calculateXPForLevel(currentLevel);
  const nextLevelXP = calculateXPForLevel(currentLevel + 1);
  const xpInCurrentLevel = xp - currentLevelXP;
  const xpNeededForNext = nextLevelXP - currentLevelXP;
  const progress = xpNeededForNext > 0
    ? Math.min(100, Math.floor((xpInCurrentLevel / xpNeededForNext) * 100))
    : 100;

  return {
    currentLevel,
    currentXP: xp,
    nextLevelXP,
    progress,
    title: LEVEL_TITLES[currentLevel] || `레벨 ${currentLevel} 학습자`,
  };
}

// ---------------------------------------------------------------------------
// Grade & Domain Helpers
// ---------------------------------------------------------------------------

/**
 * Get the grade group for a given grade.
 */
export function getGradeGroup(grade: Grade): GradeGroup {
  if (grade <= 2) return '1-2';
  if (grade <= 4) return '3-4';
  return '5-6';
}

/**
 * Get the Korean label for a domain.
 */
export function getDomainLabel(domain: Domain): string {
  const labels: Record<Domain, string> = {
    reading: '읽기',
    literature: '문학',
    grammar: '문법',
  };
  return labels[domain];
}

/**
 * Get the Korean label for a grade.
 */
export function getGradeLabel(grade: Grade): string {
  return `${grade}학년`;
}

/**
 * Get the Korean label for a semester.
 */
export function getSemesterLabel(semester: 1 | 2): string {
  return `${semester}학기`;
}

// ---------------------------------------------------------------------------
// Time Formatting
// ---------------------------------------------------------------------------

/**
 * Format seconds into MM:SS format.
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Format seconds into a human-readable Korean string.
 */
export function formatTimeKorean(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}초`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) {
    return `${mins}분`;
  }
  return `${mins}분 ${secs}초`;
}

// ---------------------------------------------------------------------------
// Streak & Gamification Helpers
// ---------------------------------------------------------------------------

/**
 * Get an appropriate emoji for the current streak count.
 */
export function getStreakEmoji(streak: number): string {
  if (streak >= 365) return '\uD83C\uDFC6'; // trophy
  if (streak >= 100) return '\uD83D\uDD25'; // fire
  if (streak >= 30) return '\u2B50';         // star
  if (streak >= 14) return '\uD83D\uDCAA';  // flexed biceps
  if (streak >= 7) return '\uD83C\uDF1F';   // glowing star
  if (streak >= 3) return '\uD83D\uDCA5';   // collision
  if (streak >= 1) return '\u2728';          // sparkles
  return '\uD83D\uDCA4';                    // zzz (no streak)
}

/**
 * Get a motivational message based on streak count.
 */
export function getStreakMessage(streak: number): string {
  if (streak >= 365) return '1년 연속 학습! 대단합니다!';
  if (streak >= 100) return '100일 돌파! 진정한 학습 챔피언!';
  if (streak >= 30) return '한 달 연속! 멋진 습관이에요!';
  if (streak >= 14) return '2주 연속! 꾸준함이 빛나요!';
  if (streak >= 7) return '일주일 연속! 습관이 되어가고 있어요!';
  if (streak >= 3) return '3일 연속! 좋은 시작이에요!';
  if (streak >= 1) return '오늘도 학습 완료!';
  return '오늘 학습을 시작해볼까요?';
}

// ---------------------------------------------------------------------------
// Session & ID Generation
// ---------------------------------------------------------------------------

/**
 * Generate a unique session ID.
 * Format: session_[userId-prefix]_[date]_[random]
 */
export function generateSessionId(userId?: string): string {
  const userPrefix = userId ? userId.slice(0, 8) : 'anon';
  const date = getTodayDateString().replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8);
  return `session_${userPrefix}_${date}_${random}`;
}

/**
 * Generate a unique question ID.
 */
export function generateQuestionId(prefix: string = 'q'): string {
  const random = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36);
  return `${prefix}_${timestamp}_${random}`;
}

// ---------------------------------------------------------------------------
// Accuracy & Score Calculations
// ---------------------------------------------------------------------------

/**
 * Calculate accuracy as a percentage.
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Determine performance rating based on accuracy.
 */
export function getPerformanceRating(accuracy: number): {
  label: string;
  color: string;
} {
  if (accuracy >= 90) return { label: '최고', color: 'text-yellow-500' };
  if (accuracy >= 70) return { label: '잘했어요', color: 'text-green-500' };
  if (accuracy >= 50) return { label: '좋아요', color: 'text-blue-500' };
  return { label: '분발해요', color: 'text-orange-500' };
}
