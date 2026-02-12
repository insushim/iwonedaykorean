// =============================================================================
// HaruKorean (하루국어) - Core Type Definitions
// =============================================================================

// -----------------------------------------------------------------------------
// Curriculum & Content Types
// -----------------------------------------------------------------------------

export type GradeGroup = '1-2' | '3-4' | '5-6';
export type Grade = 1 | 2 | 3 | 4 | 5 | 6;
export type Semester = 1 | 2;
export type Domain = 'reading' | 'literature' | 'grammar';
export type PassageType = 'nonfiction' | 'fiction' | 'poetry';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multiple_choice';
export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';
export type SessionStatus = 'not_started' | 'in_progress' | 'completed';

export interface CurriculumStandard {
  id: string;
  gradeGroup: GradeGroup;
  grade: Grade;
  semester: Semester;
  domain: Domain;
  title: string;
  description: string;
  keywords: string[];
  difficulty: Difficulty;
}

export interface Passage {
  id: string;
  type: PassageType;
  gradeGroup: GradeGroup;
  grade: Grade;
  semester: Semester;
  title: string;
  author?: string;
  content: string;
  source?: string;
  relatedStandards: string[];
  keywords: string[];
  wordCount: number;
  difficulty: Difficulty;
}

export interface Choice {
  number: number;
  text: string;
}

export interface Question {
  id: string;
  passageId: string;
  questionNumber: number;
  type: QuestionType;
  question: string;
  choices: Choice[];
  correctAnswer: 1 | 2 | 3 | 4;
  explanation: string;
  wrongExplanations: Record<number, string>;
  relatedStandard: string;
  difficulty: Difficulty;
  category: string;
}

// -----------------------------------------------------------------------------
// User & Profile Types
// -----------------------------------------------------------------------------

export interface DomainScore {
  domain: Domain;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

export interface UserStats {
  domainScores: Record<Domain, DomainScore>;
  totalSessions: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  averageAccuracy: number;
  averageTimePerSession: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  grade: Grade;
  semester: Semester;
  role: UserRole;
  parentLinkedTo?: string;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  streakFreezeCount: number;
  totalDaysCompleted: number;
  coins: number;
  badges: string[];
  avatarId: string;
  stats: UserStats;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Session Types
// -----------------------------------------------------------------------------

export interface SessionQuestion {
  questionId: string;
  question: string;
  choices: Choice[];
  correctAnswer: 1 | 2 | 3 | 4;
  explanation: string;
  wrongExplanations: Record<number, string>;
  studentAnswer?: number;
  isCorrect?: boolean;
  attempts: number;
  answeredAt?: string;
}

export interface SessionPassage {
  passageId: string;
  title: string;
  type: PassageType;
  content: string;
  questions: SessionQuestion[];
}

export interface DailySession {
  id: string;
  userId: string;
  grade: Grade;
  semester: Semester;
  date: string;
  status: SessionStatus;
  passages: SessionPassage[];
  grammarQuestions: SessionQuestion[];
  totalQuestions: number;
  correctOnFirstTry: number;
  totalAttempts: number;
  xpEarned: number;
  coinsEarned: number;
  startedAt: string;
  completedAt?: string;
  timeSpentSeconds: number;
}

// -----------------------------------------------------------------------------
// Wrong Answer Note Types
// -----------------------------------------------------------------------------

export interface WrongAnswerNote {
  id: string;
  userId: string;
  sessionId: string;
  questionId: string;
  passageTitle?: string;
  question: string;
  correctAnswer: string;
  studentAnswer: string;
  explanation: string;
  wrongExplanation: string;
  category: string;
  domain: Domain;
  createdAt: string;
  reviewed: boolean;
  reviewedAt?: string;
}

// -----------------------------------------------------------------------------
// Gamification Types
// -----------------------------------------------------------------------------

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'accuracy' | 'completion' | 'special';
  condition: {
    type: string;
    value: number;
  };
  xpReward: number;
  coinReward: number;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  avatarId: string;
  grade: Grade;
  level: number;
  xp: number;
  streak: number;
  totalDaysCompleted: number;
  rank: number;
  weeklyXp: number;
}

export interface CoinShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'utility' | 'avatar' | 'theme' | 'boost';
  price: number;
  effect?: string;
  duration?: string;
  oneTimePurchase: boolean;
}

export interface XPReward {
  correctOnFirstTry: number;
  correctOnSecondTry: number;
  correctOnThirdTry: number;
  dailyComplete: number;
  perfectDay: number;
  streakBonus: (streak: number) => number;
  weeklyComplete: number;
}

export interface LevelThreshold {
  level: number;
  xpRequired: number;
  title: string;
}

export interface CoinReward {
  dailyComplete: number;
  perfectDay: number;
  achievementUnlock: number;
  weeklyComplete: number;
}
