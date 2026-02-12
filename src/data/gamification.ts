// =============================================================================
// HaruKorean (하루국어) - Gamification Data
// =============================================================================

import {
  XPReward,
  LevelThreshold,
  CoinReward,
  CoinShopItem,
  Achievement,
} from '@/types';

// =============================================================================
// XP Rewards
// =============================================================================

export const XP_REWARDS: XPReward = {
  correctOnFirstTry: 10,
  correctOnSecondTry: 5,
  correctOnThirdTry: 2,
  dailyComplete: 50,
  perfectDay: 100,
  streakBonus: (streak: number): number => {
    if (streak <= 0) return 0;
    if (streak <= 7) return streak * 5;
    if (streak <= 30) return 35 + (streak - 7) * 3;
    return 35 + 69 + (streak - 30) * 2;
  },
  weeklyComplete: 200,
};

// =============================================================================
// Level Thresholds
// =============================================================================

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1, xpRequired: 0, title: '국어 새싹' },
  { level: 2, xpRequired: 100, title: '국어 새싹' },
  { level: 3, xpRequired: 250, title: '국어 새싹' },
  { level: 4, xpRequired: 450, title: '국어 새싹' },
  { level: 5, xpRequired: 700, title: '국어 새싹' },
  { level: 6, xpRequired: 1000, title: '낱말 탐험가' },
  { level: 7, xpRequired: 1400, title: '낱말 탐험가' },
  { level: 8, xpRequired: 1900, title: '낱말 탐험가' },
  { level: 9, xpRequired: 2500, title: '낱말 탐험가' },
  { level: 10, xpRequired: 3200, title: '낱말 탐험가' },
  { level: 11, xpRequired: 4000, title: '문장 해결사' },
  { level: 12, xpRequired: 4900, title: '문장 해결사' },
  { level: 13, xpRequired: 5900, title: '문장 해결사' },
  { level: 14, xpRequired: 7000, title: '문장 해결사' },
  { level: 15, xpRequired: 8200, title: '문장 해결사' },
  { level: 16, xpRequired: 9500, title: '독해 용사' },
  { level: 17, xpRequired: 11000, title: '독해 용사' },
  { level: 18, xpRequired: 12700, title: '독해 용사' },
  { level: 19, xpRequired: 14600, title: '독해 용사' },
  { level: 20, xpRequired: 16700, title: '독해 용사' },
  { level: 21, xpRequired: 19000, title: '글읽기 기사' },
  { level: 22, xpRequired: 21500, title: '글읽기 기사' },
  { level: 23, xpRequired: 24200, title: '글읽기 기사' },
  { level: 24, xpRequired: 27100, title: '글읽기 기사' },
  { level: 25, xpRequired: 30200, title: '글읽기 기사' },
  { level: 26, xpRequired: 33500, title: '어휘 마법사' },
  { level: 27, xpRequired: 37000, title: '어휘 마법사' },
  { level: 28, xpRequired: 40700, title: '어휘 마법사' },
  { level: 29, xpRequired: 44600, title: '어휘 마법사' },
  { level: 30, xpRequired: 48700, title: '어휘 마법사' },
  { level: 31, xpRequired: 53000, title: '문학 현자' },
  { level: 32, xpRequired: 57500, title: '문학 현자' },
  { level: 33, xpRequired: 62200, title: '문학 현자' },
  { level: 34, xpRequired: 67100, title: '문학 현자' },
  { level: 35, xpRequired: 72200, title: '문학 현자' },
  { level: 36, xpRequired: 77500, title: '국어 박사' },
  { level: 37, xpRequired: 83000, title: '국어 박사' },
  { level: 38, xpRequired: 88700, title: '국어 박사' },
  { level: 39, xpRequired: 94600, title: '국어 박사' },
  { level: 40, xpRequired: 100700, title: '국어 박사' },
  { level: 41, xpRequired: 107000, title: '국어 대학자' },
  { level: 42, xpRequired: 113500, title: '국어 대학자' },
  { level: 43, xpRequired: 120200, title: '국어 대학자' },
  { level: 44, xpRequired: 127100, title: '국어 대학자' },
  { level: 45, xpRequired: 134200, title: '국어 대학자' },
  { level: 46, xpRequired: 141500, title: '국어 마스터' },
  { level: 47, xpRequired: 149000, title: '국어 마스터' },
  { level: 48, xpRequired: 156700, title: '국어 마스터' },
  { level: 49, xpRequired: 164600, title: '국어 마스터' },
  { level: 50, xpRequired: 172700, title: '국어 마스터' },
];

// =============================================================================
// Coin Rewards
// =============================================================================

export const COIN_REWARDS: CoinReward = {
  dailyComplete: 10,
  perfectDay: 25,
  achievementUnlock: 50,
  weeklyComplete: 100,
};

// =============================================================================
// Coin Shop Items
// =============================================================================

export const COIN_SHOP: CoinShopItem[] = [
  // Utility Items
  {
    id: 'streak_freeze',
    name: '연속 학습 보호권',
    description: '하루를 빠뜨려도 연속 학습 기록이 유지됩니다.',
    icon: '🛡️',
    category: 'utility',
    price: 50,
    effect: '연속 학습 1회 보호',
    duration: '1회 사용',
    oneTimePurchase: false,
  },
  {
    id: 'hint_ticket',
    name: '힌트 티켓',
    description: '문제를 풀 때 힌트를 받을 수 있습니다.',
    icon: '💡',
    category: 'utility',
    price: 30,
    effect: '문제 1개 힌트 제공',
    duration: '1회 사용',
    oneTimePurchase: false,
  },

  // Avatar Items
  {
    id: 'avatar_penguin',
    name: '펭귄 아바타',
    description: '귀여운 펭귄 캐릭터로 변신!',
    icon: '🐧',
    category: 'avatar',
    price: 100,
    oneTimePurchase: true,
  },
  {
    id: 'avatar_rabbit',
    name: '토끼 아바타',
    description: '깡충깡충 토끼 캐릭터로 변신!',
    icon: '🐰',
    category: 'avatar',
    price: 100,
    oneTimePurchase: true,
  },
  {
    id: 'avatar_cat',
    name: '고양이 아바타',
    description: '야옹! 고양이 캐릭터로 변신!',
    icon: '🐱',
    category: 'avatar',
    price: 100,
    oneTimePurchase: true,
  },
  {
    id: 'avatar_dog',
    name: '강아지 아바타',
    description: '멍멍! 강아지 캐릭터로 변신!',
    icon: '🐶',
    category: 'avatar',
    price: 100,
    oneTimePurchase: true,
  },
  {
    id: 'avatar_bear',
    name: '곰 아바타',
    description: '듬직한 곰 캐릭터로 변신!',
    icon: '🐻',
    category: 'avatar',
    price: 150,
    oneTimePurchase: true,
  },
  {
    id: 'avatar_dragon',
    name: '용 아바타',
    description: '멋진 용 캐릭터로 변신!',
    icon: '🐲',
    category: 'avatar',
    price: 200,
    oneTimePurchase: true,
  },
  {
    id: 'avatar_unicorn',
    name: '유니콘 아바타',
    description: '신비로운 유니콘 캐릭터로 변신!',
    icon: '🦄',
    category: 'avatar',
    price: 300,
    oneTimePurchase: true,
  },

  // Theme Items
  {
    id: 'theme_ocean',
    name: '바다 테마',
    description: '시원한 바다 배경으로 학습 화면을 꾸며요.',
    icon: '🌊',
    category: 'theme',
    price: 200,
    oneTimePurchase: true,
  },
  {
    id: 'theme_forest',
    name: '숲 테마',
    description: '초록초록 숲 배경으로 학습 화면을 꾸며요.',
    icon: '🌳',
    category: 'theme',
    price: 200,
    oneTimePurchase: true,
  },
  {
    id: 'theme_space',
    name: '우주 테마',
    description: '반짝이는 우주 배경으로 학습 화면을 꾸며요.',
    icon: '🚀',
    category: 'theme',
    price: 250,
    oneTimePurchase: true,
  },
  {
    id: 'theme_candy',
    name: '사탕나라 테마',
    description: '달콤한 사탕나라 배경으로 학습 화면을 꾸며요.',
    icon: '🍬',
    category: 'theme',
    price: 250,
    oneTimePurchase: true,
  },

  // Boost Items
  {
    id: 'double_xp',
    name: '경험치 2배 부스트',
    description: '24시간 동안 획득하는 경험치가 2배!',
    icon: '⚡',
    category: 'boost',
    price: 100,
    effect: '경험치 획득량 2배',
    duration: '24시간',
    oneTimePurchase: false,
  },
];

// =============================================================================
// Achievements
// =============================================================================

export const ACHIEVEMENTS: Achievement[] = [
  // ---------------------------------------------------------------------------
  // Streak Achievements (연속 학습)
  // ---------------------------------------------------------------------------
  {
    id: 'streak_3',
    name: '3일 연속 학습',
    description: '3일 연속으로 하루국어를 완료했어요!',
    icon: '🔥',
    category: 'streak',
    condition: { type: 'streak', value: 3 },
    xpReward: 50,
    coinReward: 10,
  },
  {
    id: 'streak_7',
    name: '일주일 연속 학습',
    description: '7일 연속으로 하루국어를 완료했어요!',
    icon: '🔥',
    category: 'streak',
    condition: { type: 'streak', value: 7 },
    xpReward: 100,
    coinReward: 25,
  },
  {
    id: 'streak_14',
    name: '2주 연속 학습',
    description: '14일 연속으로 하루국어를 완료했어요!',
    icon: '🔥',
    category: 'streak',
    condition: { type: 'streak', value: 14 },
    xpReward: 200,
    coinReward: 50,
  },
  {
    id: 'streak_30',
    name: '한 달 연속 학습',
    description: '30일 연속으로 하루국어를 완료했어요! 대단해요!',
    icon: '🏆',
    category: 'streak',
    condition: { type: 'streak', value: 30 },
    xpReward: 500,
    coinReward: 100,
  },
  {
    id: 'streak_60',
    name: '두 달 연속 학습',
    description: '60일 연속으로 하루국어를 완료했어요! 놀라워요!',
    icon: '🏆',
    category: 'streak',
    condition: { type: 'streak', value: 60 },
    xpReward: 1000,
    coinReward: 200,
  },
  {
    id: 'streak_100',
    name: '100일 연속 학습',
    description: '100일 연속으로 하루국어를 완료했어요! 전설이에요!',
    icon: '👑',
    category: 'streak',
    condition: { type: 'streak', value: 100 },
    xpReward: 2000,
    coinReward: 500,
  },
  {
    id: 'streak_365',
    name: '1년 연속 학습',
    description: '365일 연속으로 하루국어를 완료했어요! 국어의 신!',
    icon: '👑',
    category: 'streak',
    condition: { type: 'streak', value: 365 },
    xpReward: 5000,
    coinReward: 1000,
  },

  // ---------------------------------------------------------------------------
  // Accuracy Achievements (정확도)
  // ---------------------------------------------------------------------------
  {
    id: 'perfect_day_1',
    name: '첫 만점의 날',
    description: '하루 학습에서 모든 문제를 첫 시도에 맞혔어요!',
    icon: '⭐',
    category: 'accuracy',
    condition: { type: 'perfect_day', value: 1 },
    xpReward: 100,
    coinReward: 25,
  },
  {
    id: 'perfect_day_5',
    name: '만점왕 5일',
    description: '5번의 만점 학습을 달성했어요!',
    icon: '⭐',
    category: 'accuracy',
    condition: { type: 'perfect_day', value: 5 },
    xpReward: 200,
    coinReward: 50,
  },
  {
    id: 'perfect_day_10',
    name: '만점왕 10일',
    description: '10번의 만점 학습을 달성했어요!',
    icon: '🌟',
    category: 'accuracy',
    condition: { type: 'perfect_day', value: 10 },
    xpReward: 500,
    coinReward: 100,
  },
  {
    id: 'perfect_day_30',
    name: '만점 마스터',
    description: '30번의 만점 학습을 달성했어요!',
    icon: '🌟',
    category: 'accuracy',
    condition: { type: 'perfect_day', value: 30 },
    xpReward: 1000,
    coinReward: 200,
  },
  {
    id: 'accuracy_80',
    name: '정확도 80% 달성',
    description: '전체 정답률 80%를 달성했어요!',
    icon: '🎯',
    category: 'accuracy',
    condition: { type: 'accuracy', value: 80 },
    xpReward: 100,
    coinReward: 25,
  },
  {
    id: 'accuracy_90',
    name: '정확도 90% 달성',
    description: '전체 정답률 90%를 달성했어요!',
    icon: '🎯',
    category: 'accuracy',
    condition: { type: 'accuracy', value: 90 },
    xpReward: 300,
    coinReward: 50,
  },
  {
    id: 'accuracy_95',
    name: '정확도 95% 달성',
    description: '전체 정답률 95%를 달성했어요! 거의 완벽해요!',
    icon: '💎',
    category: 'accuracy',
    condition: { type: 'accuracy', value: 95 },
    xpReward: 500,
    coinReward: 100,
  },

  // ---------------------------------------------------------------------------
  // Completion Achievements (학습 완료)
  // ---------------------------------------------------------------------------
  {
    id: 'complete_1',
    name: '첫 학습 완료',
    description: '첫 번째 하루국어를 완료했어요! 시작이 반이에요!',
    icon: '📖',
    category: 'completion',
    condition: { type: 'total_days', value: 1 },
    xpReward: 50,
    coinReward: 10,
  },
  {
    id: 'complete_7',
    name: '7일 학습 완료',
    description: '총 7일의 학습을 완료했어요!',
    icon: '📖',
    category: 'completion',
    condition: { type: 'total_days', value: 7 },
    xpReward: 100,
    coinReward: 25,
  },
  {
    id: 'complete_30',
    name: '30일 학습 완료',
    description: '총 30일의 학습을 완료했어요!',
    icon: '📚',
    category: 'completion',
    condition: { type: 'total_days', value: 30 },
    xpReward: 300,
    coinReward: 50,
  },
  {
    id: 'complete_50',
    name: '50일 학습 완료',
    description: '총 50일의 학습을 완료했어요!',
    icon: '📚',
    category: 'completion',
    condition: { type: 'total_days', value: 50 },
    xpReward: 500,
    coinReward: 100,
  },
  {
    id: 'complete_100',
    name: '100일 학습 완료',
    description: '총 100일의 학습을 완료했어요! 꾸준한 학습의 힘!',
    icon: '🏅',
    category: 'completion',
    condition: { type: 'total_days', value: 100 },
    xpReward: 1000,
    coinReward: 200,
  },
  {
    id: 'complete_200',
    name: '200일 학습 완료',
    description: '총 200일의 학습을 완료했어요! 진정한 학습왕!',
    icon: '🏅',
    category: 'completion',
    condition: { type: 'total_days', value: 200 },
    xpReward: 2000,
    coinReward: 500,
  },
  {
    id: 'complete_365',
    name: '365일 학습 완료',
    description: '총 365일의 학습을 완료했어요! 1년 동안 열심히 했어요!',
    icon: '🎖️',
    category: 'completion',
    condition: { type: 'total_days', value: 365 },
    xpReward: 5000,
    coinReward: 1000,
  },
  {
    id: 'questions_100',
    name: '100문제 해결',
    description: '총 100개의 문제를 풀었어요!',
    icon: '✏️',
    category: 'completion',
    condition: { type: 'total_questions', value: 100 },
    xpReward: 100,
    coinReward: 25,
  },
  {
    id: 'questions_500',
    name: '500문제 해결',
    description: '총 500개의 문제를 풀었어요!',
    icon: '✏️',
    category: 'completion',
    condition: { type: 'total_questions', value: 500 },
    xpReward: 300,
    coinReward: 50,
  },
  {
    id: 'questions_1000',
    name: '1000문제 해결',
    description: '총 1000개의 문제를 풀었어요! 문제 풀기의 달인!',
    icon: '🖊️',
    category: 'completion',
    condition: { type: 'total_questions', value: 1000 },
    xpReward: 500,
    coinReward: 100,
  },
  {
    id: 'questions_5000',
    name: '5000문제 해결',
    description: '총 5000개의 문제를 풀었어요! 엄청난 실력이에요!',
    icon: '🖊️',
    category: 'completion',
    condition: { type: 'total_questions', value: 5000 },
    xpReward: 2000,
    coinReward: 500,
  },

  // ---------------------------------------------------------------------------
  // Special Achievements (특별)
  // ---------------------------------------------------------------------------
  {
    id: 'first_perfect_reading',
    name: '읽기 만점',
    description: '읽기 영역에서 만점을 받았어요!',
    icon: '📕',
    category: 'special',
    condition: { type: 'domain_perfect', value: 1 },
    xpReward: 100,
    coinReward: 25,
  },
  {
    id: 'first_perfect_literature',
    name: '문학 만점',
    description: '문학 영역에서 만점을 받았어요!',
    icon: '📗',
    category: 'special',
    condition: { type: 'domain_perfect', value: 1 },
    xpReward: 100,
    coinReward: 25,
  },
  {
    id: 'first_perfect_grammar',
    name: '문법 만점',
    description: '문법 영역에서 만점을 받았어요!',
    icon: '📘',
    category: 'special',
    condition: { type: 'domain_perfect', value: 1 },
    xpReward: 100,
    coinReward: 25,
  },
  {
    id: 'all_domain_perfect',
    name: '전 영역 만점',
    description: '읽기, 문학, 문법 모든 영역에서 만점을 받았어요!',
    icon: '🌈',
    category: 'special',
    condition: { type: 'all_domain_perfect', value: 1 },
    xpReward: 500,
    coinReward: 100,
  },
  {
    id: 'wrong_note_review_10',
    name: '오답 노트 복습왕',
    description: '오답 노트를 10번 복습했어요!',
    icon: '📝',
    category: 'special',
    condition: { type: 'wrong_note_review', value: 10 },
    xpReward: 100,
    coinReward: 25,
  },
  {
    id: 'wrong_note_review_50',
    name: '오답 노트 마스터',
    description: '오답 노트를 50번 복습했어요! 실수를 통해 성장해요!',
    icon: '📝',
    category: 'special',
    condition: { type: 'wrong_note_review', value: 50 },
    xpReward: 300,
    coinReward: 50,
  },
  {
    id: 'level_10',
    name: '레벨 10 달성',
    description: '레벨 10에 도달했어요!',
    icon: '🎉',
    category: 'special',
    condition: { type: 'level', value: 10 },
    xpReward: 200,
    coinReward: 50,
  },
  {
    id: 'level_25',
    name: '레벨 25 달성',
    description: '레벨 25에 도달했어요! 중급 학습자!',
    icon: '🎊',
    category: 'special',
    condition: { type: 'level', value: 25 },
    xpReward: 500,
    coinReward: 100,
  },
  {
    id: 'level_50',
    name: '최고 레벨 달성',
    description: '레벨 50! 국어 마스터의 경지에 올랐어요!',
    icon: '👑',
    category: 'special',
    condition: { type: 'level', value: 50 },
    xpReward: 5000,
    coinReward: 1000,
  },
  {
    id: 'early_bird',
    name: '아침형 학습자',
    description: '오전 7시 이전에 학습을 완료했어요!',
    icon: '🌅',
    category: 'special',
    condition: { type: 'early_bird', value: 1 },
    xpReward: 50,
    coinReward: 10,
  },
  {
    id: 'weekend_warrior',
    name: '주말 학습 전사',
    description: '주말에도 빠짐없이 학습을 완료했어요!',
    icon: '⚔️',
    category: 'special',
    condition: { type: 'weekend_complete', value: 4 },
    xpReward: 100,
    coinReward: 25,
  },
  {
    id: 'speed_learner',
    name: '번개 학습자',
    description: '5분 이내에 모든 문제를 맞혔어요!',
    icon: '⚡',
    category: 'special',
    condition: { type: 'speed_complete', value: 300 },
    xpReward: 100,
    coinReward: 25,
  },
  {
    id: 'comeback_kid',
    name: '돌아온 학습자',
    description: '7일 이상 쉬었다가 다시 학습을 시작했어요!',
    icon: '💪',
    category: 'special',
    condition: { type: 'comeback', value: 7 },
    xpReward: 50,
    coinReward: 10,
  },
];

// =============================================================================
// Helper Functions
// =============================================================================

export function getLevelForXP(xp: number): LevelThreshold {
  let result = LEVEL_THRESHOLDS[0];
  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold.xpRequired) {
      result = threshold;
    } else {
      break;
    }
  }
  return result;
}

export function getXPForNextLevel(currentXP: number): {
  currentLevel: LevelThreshold;
  nextLevel: LevelThreshold | null;
  xpNeeded: number;
  progress: number;
} {
  const currentLevel = getLevelForXP(currentXP);
  const nextLevelIndex = LEVEL_THRESHOLDS.findIndex(
    (t) => t.level === currentLevel.level
  ) + 1;

  if (nextLevelIndex >= LEVEL_THRESHOLDS.length) {
    return {
      currentLevel,
      nextLevel: null,
      xpNeeded: 0,
      progress: 100,
    };
  }

  const nextLevel = LEVEL_THRESHOLDS[nextLevelIndex];
  const xpInCurrentLevel = currentXP - currentLevel.xpRequired;
  const xpForLevel = nextLevel.xpRequired - currentLevel.xpRequired;

  return {
    currentLevel,
    nextLevel,
    xpNeeded: nextLevel.xpRequired - currentXP,
    progress: Math.round((xpInCurrentLevel / xpForLevel) * 100),
  };
}

export function calculateSessionXP(
  correctOnFirstTry: number,
  correctOnSecondTry: number,
  correctOnThirdTry: number,
  totalQuestions: number,
  streak: number
): number {
  let xp = 0;

  xp += correctOnFirstTry * XP_REWARDS.correctOnFirstTry;
  xp += correctOnSecondTry * XP_REWARDS.correctOnSecondTry;
  xp += correctOnThirdTry * XP_REWARDS.correctOnThirdTry;

  xp += XP_REWARDS.dailyComplete;

  if (correctOnFirstTry === totalQuestions) {
    xp += XP_REWARDS.perfectDay;
  }

  xp += XP_REWARDS.streakBonus(streak);

  return xp;
}

export function getShopItemById(id: string): CoinShopItem | undefined {
  return COIN_SHOP.find((item) => item.id === id);
}

export function getShopItemsByCategory(
  category: 'utility' | 'avatar' | 'theme' | 'boost'
): CoinShopItem[] {
  return COIN_SHOP.filter((item) => item.category === category);
}

export function getAchievementsByCategory(
  category: 'streak' | 'accuracy' | 'completion' | 'special'
): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.category === category);
}

export function checkAchievements(
  userProfile: {
    streak: number;
    totalDaysCompleted: number;
    level: number;
    stats: {
      totalQuestionsAnswered: number;
      averageAccuracy: number;
    };
  },
  earnedAchievements: string[]
): Achievement[] {
  const newAchievements: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (earnedAchievements.includes(achievement.id)) continue;

    const { type, value } = achievement.condition;

    switch (type) {
      case 'streak':
        if (userProfile.streak >= value) {
          newAchievements.push(achievement);
        }
        break;
      case 'total_days':
        if (userProfile.totalDaysCompleted >= value) {
          newAchievements.push(achievement);
        }
        break;
      case 'total_questions':
        if (userProfile.stats.totalQuestionsAnswered >= value) {
          newAchievements.push(achievement);
        }
        break;
      case 'accuracy':
        if (userProfile.stats.averageAccuracy >= value) {
          newAchievements.push(achievement);
        }
        break;
      case 'level':
        if (userProfile.level >= value) {
          newAchievements.push(achievement);
        }
        break;
    }
  }

  return newAchievements;
}
