// =============================================================================
// HaruKorean (하루국어) - Gamification State Store (Zustand)
// =============================================================================

import { create } from 'zustand';
import { calculateLevel, calculateXPForLevel, getLevelProgress } from '@/lib/utils';
import type { Achievement } from '@/types';

// ---------------------------------------------------------------------------
// XP Reward Constants
// ---------------------------------------------------------------------------

export const XP_REWARDS = {
  /** XP for answering correctly on the first try */
  correctOnFirstTry: 10,
  /** XP for answering correctly on the second try */
  correctOnSecondTry: 5,
  /** XP for answering correctly on the third try */
  correctOnThirdTry: 2,
  /** XP bonus for completing the daily session */
  dailyComplete: 30,
  /** XP bonus for a perfect session (100% first-try accuracy) */
  perfectDay: 50,
  /** XP bonus for completing all 7 days in a week */
  weeklyComplete: 100,
  /** Calculate streak bonus XP */
  streakBonus: (streak: number): number => {
    if (streak >= 30) return 20;
    if (streak >= 14) return 15;
    if (streak >= 7) return 10;
    if (streak >= 3) return 5;
    return 0;
  },
} as const;

// ---------------------------------------------------------------------------
// Coin Reward Constants
// ---------------------------------------------------------------------------

export const COIN_REWARDS = {
  /** Coins for completing the daily session */
  dailyComplete: 10,
  /** Coins for a perfect session */
  perfectDay: 25,
  /** Coins for unlocking an achievement */
  achievementUnlock: 15,
  /** Coins for completing all 7 days in a week */
  weeklyComplete: 50,
} as const;

// ---------------------------------------------------------------------------
// Achievement Definitions
// ---------------------------------------------------------------------------

export const ACHIEVEMENTS: Achievement[] = [
  // Streak achievements
  {
    id: 'streak_3',
    name: '3일 연속 학습',
    description: '3일 연속으로 학습을 완료했어요!',
    icon: 'flame',
    category: 'streak',
    condition: { type: 'streak', value: 3 },
    xpReward: 30,
    coinReward: 10,
  },
  {
    id: 'streak_7',
    name: '일주일 연속 학습',
    description: '7일 연속으로 학습을 완료했어요!',
    icon: 'fire',
    category: 'streak',
    condition: { type: 'streak', value: 7 },
    xpReward: 70,
    coinReward: 25,
  },
  {
    id: 'streak_14',
    name: '2주 연속 학습',
    description: '14일 연속으로 학습을 완료했어요!',
    icon: 'star',
    category: 'streak',
    condition: { type: 'streak', value: 14 },
    xpReward: 150,
    coinReward: 50,
  },
  {
    id: 'streak_30',
    name: '한 달 연속 학습',
    description: '30일 연속으로 학습을 완료했어요!',
    icon: 'trophy',
    category: 'streak',
    condition: { type: 'streak', value: 30 },
    xpReward: 300,
    coinReward: 100,
  },
  {
    id: 'streak_100',
    name: '100일 연속 학습',
    description: '100일 연속으로 학습을 완료했어요! 대단해요!',
    icon: 'crown',
    category: 'streak',
    condition: { type: 'streak', value: 100 },
    xpReward: 1000,
    coinReward: 300,
  },

  // Accuracy achievements
  {
    id: 'perfect_1',
    name: '첫 만점',
    description: '하루 학습에서 처음으로 만점을 받았어요!',
    icon: 'sparkles',
    category: 'accuracy',
    condition: { type: 'perfect_days', value: 1 },
    xpReward: 50,
    coinReward: 20,
  },
  {
    id: 'perfect_5',
    name: '만점 5회',
    description: '만점을 5번 달성했어요!',
    icon: 'medal',
    category: 'accuracy',
    condition: { type: 'perfect_days', value: 5 },
    xpReward: 100,
    coinReward: 40,
  },
  {
    id: 'perfect_20',
    name: '만점 20회',
    description: '만점을 20번이나 달성했어요!',
    icon: 'gem',
    category: 'accuracy',
    condition: { type: 'perfect_days', value: 20 },
    xpReward: 300,
    coinReward: 100,
  },

  // Completion achievements
  {
    id: 'sessions_10',
    name: '10일 학습 완료',
    description: '총 10일의 학습을 완료했어요!',
    icon: 'book-open',
    category: 'completion',
    condition: { type: 'total_sessions', value: 10 },
    xpReward: 50,
    coinReward: 20,
  },
  {
    id: 'sessions_50',
    name: '50일 학습 완료',
    description: '총 50일의 학습을 완료했어요!',
    icon: 'bookmark',
    category: 'completion',
    condition: { type: 'total_sessions', value: 50 },
    xpReward: 200,
    coinReward: 80,
  },
  {
    id: 'sessions_100',
    name: '100일 학습 완료',
    description: '총 100일의 학습을 완료했어요! 진정한 학습왕!',
    icon: 'graduation-cap',
    category: 'completion',
    condition: { type: 'total_sessions', value: 100 },
    xpReward: 500,
    coinReward: 200,
  },
  {
    id: 'questions_100',
    name: '문제 100개 풀기',
    description: '총 100개의 문제를 풀었어요!',
    icon: 'pencil',
    category: 'completion',
    condition: { type: 'total_questions', value: 100 },
    xpReward: 50,
    coinReward: 20,
  },
  {
    id: 'questions_500',
    name: '문제 500개 풀기',
    description: '총 500개의 문제를 풀었어요!',
    icon: 'brain',
    category: 'completion',
    condition: { type: 'total_questions', value: 500 },
    xpReward: 200,
    coinReward: 80,
  },
  {
    id: 'questions_1000',
    name: '문제 1000개 풀기',
    description: '총 1000개의 문제를 풀었어요! 문제 마스터!',
    icon: 'award',
    category: 'completion',
    condition: { type: 'total_questions', value: 1000 },
    xpReward: 500,
    coinReward: 200,
  },

  // Special achievements
  {
    id: 'first_session',
    name: '첫 학습 완료',
    description: '첫 번째 하루국어 학습을 완료했어요!',
    icon: 'rocket',
    category: 'special',
    condition: { type: 'total_sessions', value: 1 },
    xpReward: 20,
    coinReward: 10,
  },
  {
    id: 'level_5',
    name: '레벨 5 달성',
    description: '레벨 5에 도달했어요!',
    icon: 'zap',
    category: 'special',
    condition: { type: 'level', value: 5 },
    xpReward: 100,
    coinReward: 50,
  },
  {
    id: 'level_10',
    name: '레벨 10 달성',
    description: '레벨 10에 도달했어요! 국어 마스터!',
    icon: 'crown',
    category: 'special',
    condition: { type: 'level', value: 10 },
    xpReward: 300,
    coinReward: 150,
  },
];

// ---------------------------------------------------------------------------
// Store Types
// ---------------------------------------------------------------------------

interface GamificationState {
  /** Total XP accumulated */
  xp: number;
  /** Current level */
  level: number;
  /** Coins balance */
  coins: number;
  /** Current streak (consecutive days) */
  streak: number;
  /** Longest streak ever achieved */
  longestStreak: number;
  /** Unlocked badge/achievement IDs */
  badges: string[];
  /** Count of perfect score sessions */
  perfectDays: number;
  /** Total sessions completed */
  totalSessions: number;
  /** Total questions answered */
  totalQuestions: number;
  /** Newly unlocked achievements (for showing notifications) */
  newAchievements: Achievement[];
  /** Whether a level-up just occurred (for showing animation) */
  justLeveledUp: boolean;
  /** The previous level before leveling up */
  previousLevel: number;
}

interface GamificationActions {
  /**
   * Add XP and automatically recalculate level.
   * Returns whether a level-up occurred.
   */
  addXP: (amount: number) => boolean;
  /** Add coins to the balance */
  addCoins: (amount: number) => void;
  /** Spend coins (returns false if insufficient balance) */
  spendCoins: (amount: number) => boolean;
  /** Update the streak count */
  updateStreak: (newStreak: number) => void;
  /** Reset streak to 0 (missed a day) */
  resetStreak: () => void;
  /** Unlock a badge/achievement by ID */
  unlockBadge: (badgeId: string) => void;
  /**
   * Check all achievements against current stats and unlock any newly earned ones.
   * Returns the list of newly unlocked achievements.
   */
  checkAchievements: () => Achievement[];
  /**
   * Process end-of-session rewards.
   * Calculates and applies all XP, coins, and achievements earned.
   */
  processSessionRewards: (params: {
    correctOnFirstTry: number;
    correctOnSecondTry: number;
    correctOnThirdTry: number;
    totalQuestions: number;
    isPerfect: boolean;
  }) => {
    xpEarned: number;
    coinsEarned: number;
    newAchievements: Achievement[];
    leveledUp: boolean;
  };
  /** Clear the new achievements notification queue */
  clearNewAchievements: () => void;
  /** Clear the level-up notification */
  clearLevelUp: () => void;
  /** Sync store state from user profile (e.g., on login) */
  syncFromProfile: (data: {
    xp: number;
    level: number;
    coins: number;
    streak: number;
    longestStreak: number;
    badges: string[];
    totalSessions: number;
    totalQuestions: number;
  }) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useGamificationStore = create<GamificationState & GamificationActions>(
  (set, get) => ({
    // State
    xp: 0,
    level: 1,
    coins: 0,
    streak: 0,
    longestStreak: 0,
    badges: [],
    perfectDays: 0,
    totalSessions: 0,
    totalQuestions: 0,
    newAchievements: [],
    justLeveledUp: false,
    previousLevel: 1,

    // Actions

    addXP: (amount) => {
      const { xp, level } = get();
      const newXP = xp + amount;
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > level;

      set({
        xp: newXP,
        level: newLevel,
        justLeveledUp: leveledUp,
        previousLevel: leveledUp ? level : get().previousLevel,
      });

      return leveledUp;
    },

    addCoins: (amount) => {
      set((state) => ({ coins: state.coins + amount }));
    },

    spendCoins: (amount) => {
      const { coins } = get();
      if (coins < amount) return false;
      set({ coins: coins - amount });
      return true;
    },

    updateStreak: (newStreak) => {
      const { longestStreak } = get();
      set({
        streak: newStreak,
        longestStreak: Math.max(newStreak, longestStreak),
      });
    },

    resetStreak: () => {
      set({ streak: 0 });
    },

    unlockBadge: (badgeId) => {
      const { badges } = get();
      if (badges.includes(badgeId)) return;
      set({ badges: [...badges, badgeId] });
    },

    checkAchievements: () => {
      const state = get();
      const newlyUnlocked: Achievement[] = [];

      for (const achievement of ACHIEVEMENTS) {
        // Skip already unlocked achievements
        if (state.badges.includes(achievement.id)) continue;

        let earned = false;

        switch (achievement.condition.type) {
          case 'streak':
            earned = state.streak >= achievement.condition.value;
            break;
          case 'perfect_days':
            earned = state.perfectDays >= achievement.condition.value;
            break;
          case 'total_sessions':
            earned = state.totalSessions >= achievement.condition.value;
            break;
          case 'total_questions':
            earned = state.totalQuestions >= achievement.condition.value;
            break;
          case 'level':
            earned = state.level >= achievement.condition.value;
            break;
        }

        if (earned) {
          newlyUnlocked.push(achievement);
        }
      }

      // Apply rewards for newly unlocked achievements
      if (newlyUnlocked.length > 0) {
        const currentBadges = [...state.badges];
        let bonusXP = 0;
        let bonusCoins = 0;

        for (const achievement of newlyUnlocked) {
          currentBadges.push(achievement.id);
          bonusXP += achievement.xpReward;
          bonusCoins += achievement.coinReward;
        }

        const newXP = state.xp + bonusXP;
        const newLevel = calculateLevel(newXP);

        set({
          badges: currentBadges,
          xp: newXP,
          level: newLevel,
          coins: state.coins + bonusCoins,
          newAchievements: [...state.newAchievements, ...newlyUnlocked],
          justLeveledUp: newLevel > state.level ? true : state.justLeveledUp,
          previousLevel: newLevel > state.level ? state.level : state.previousLevel,
        });
      }

      return newlyUnlocked;
    },

    processSessionRewards: (params) => {
      const state = get();
      const {
        correctOnFirstTry,
        correctOnSecondTry,
        correctOnThirdTry,
        totalQuestions,
        isPerfect,
      } = params;

      // Calculate XP
      let xpEarned = 0;
      xpEarned += correctOnFirstTry * XP_REWARDS.correctOnFirstTry;
      xpEarned += correctOnSecondTry * XP_REWARDS.correctOnSecondTry;
      xpEarned += correctOnThirdTry * XP_REWARDS.correctOnThirdTry;
      xpEarned += XP_REWARDS.dailyComplete;
      if (isPerfect) xpEarned += XP_REWARDS.perfectDay;
      xpEarned += XP_REWARDS.streakBonus(state.streak);

      // Calculate coins
      let coinsEarned = COIN_REWARDS.dailyComplete;
      if (isPerfect) coinsEarned += COIN_REWARDS.perfectDay;

      // Update stats
      const newTotalSessions = state.totalSessions + 1;
      const newTotalQuestions = state.totalQuestions + totalQuestions;
      const newPerfectDays = isPerfect ? state.perfectDays + 1 : state.perfectDays;

      // Apply XP
      const newXP = state.xp + xpEarned;
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > state.level;

      set({
        xp: newXP,
        level: newLevel,
        coins: state.coins + coinsEarned,
        totalSessions: newTotalSessions,
        totalQuestions: newTotalQuestions,
        perfectDays: newPerfectDays,
        justLeveledUp: leveledUp,
        previousLevel: leveledUp ? state.level : state.previousLevel,
      });

      // Check for new achievements after updating stats
      const newAchievements = get().checkAchievements();

      // Add achievement coin rewards to total
      const achievementCoins = newAchievements.length * COIN_REWARDS.achievementUnlock;
      if (achievementCoins > 0) {
        coinsEarned += achievementCoins;
      }

      return {
        xpEarned,
        coinsEarned,
        newAchievements,
        leveledUp,
      };
    },

    clearNewAchievements: () => set({ newAchievements: [] }),

    clearLevelUp: () => set({ justLeveledUp: false }),

    syncFromProfile: (data) => {
      set({
        xp: data.xp,
        level: data.level,
        coins: data.coins,
        streak: data.streak,
        longestStreak: data.longestStreak,
        badges: data.badges,
        totalSessions: data.totalSessions,
        totalQuestions: data.totalQuestions,
      });
    },
  })
);
