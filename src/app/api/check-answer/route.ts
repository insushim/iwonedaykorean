// =============================================================================
// HaruKorean (하루국어) - Check Answer API Route
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import type { DailySession, SessionQuestion } from '@/types';
import { XP_REWARDS, COIN_REWARDS, ACHIEVEMENTS, checkAchievements } from '@/data/gamification';

// ---------------------------------------------------------------------------
// In-memory session store (shared module-level cache)
// In production this would be replaced with Firestore reads/writes.
// ---------------------------------------------------------------------------

const sessionStore = new Map<string, DailySession>();

/**
 * External helper so that generate-daily can populate the same store.
 * In a real deployment these would share a database, not module state.
 */
export function storeSession(session: DailySession): void {
  sessionStore.set(session.id, session);
}

export function getSession(sessionId: string): DailySession | undefined {
  return sessionStore.get(sessionId);
}

// ---------------------------------------------------------------------------
// In-memory user progress tracker (mock until Firestore)
// ---------------------------------------------------------------------------

interface UserProgress {
  totalXP: number;
  totalCoins: number;
  streak: number;
  totalDaysCompleted: number;
  level: number;
  earnedAchievements: string[];
  perfectDays: number;
  totalQuestionsAnswered: number;
  averageAccuracy: number;
}

const userProgressStore = new Map<string, UserProgress>();

function getUserProgress(userId: string): UserProgress {
  if (!userProgressStore.has(userId)) {
    userProgressStore.set(userId, {
      totalXP: 0,
      totalCoins: 0,
      streak: 1,
      totalDaysCompleted: 0,
      level: 1,
      earnedAchievements: [],
      perfectDays: 0,
      totalQuestionsAnswered: 0,
      averageAccuracy: 0,
    });
  }
  return userProgressStore.get(userId)!;
}

// ---------------------------------------------------------------------------
// Find a question within a session (passage questions + grammar questions)
// ---------------------------------------------------------------------------

function findQuestionInSession(
  session: DailySession,
  questionId: string,
): SessionQuestion | null {
  // Search passage questions
  for (const passage of session.passages) {
    const found = passage.questions.find((q) => q.questionId === questionId);
    if (found) return found;
  }
  // Search grammar questions
  const grammarFound = session.grammarQuestions.find(
    (q) => q.questionId === questionId,
  );
  if (grammarFound) return grammarFound;

  return null;
}

// ---------------------------------------------------------------------------
// Check if every question in the session is answered correctly
// ---------------------------------------------------------------------------

function isSessionComplete(session: DailySession): boolean {
  const allPassageQuestionsCorrect = session.passages.every((passage) =>
    passage.questions.every((q) => q.isCorrect === true),
  );
  const allGrammarQuestionsCorrect = session.grammarQuestions.every(
    (q) => q.isCorrect === true,
  );
  return allPassageQuestionsCorrect && allGrammarQuestionsCorrect;
}

// ---------------------------------------------------------------------------
// Check if every question was answered correctly on the first attempt
// ---------------------------------------------------------------------------

function isPerfectSession(session: DailySession): boolean {
  const passagePerfect = session.passages.every((passage) =>
    passage.questions.every((q) => q.isCorrect === true && q.attempts === 1),
  );
  const grammarPerfect = session.grammarQuestions.every(
    (q) => q.isCorrect === true && q.attempts === 1,
  );
  return passagePerfect && grammarPerfect;
}

// ---------------------------------------------------------------------------
// Calculate XP for this answer attempt
// ---------------------------------------------------------------------------

function calculateXPForAttempt(attempts: number): number {
  if (attempts === 1) return XP_REWARDS.correctOnFirstTry;
  if (attempts === 2) return XP_REWARDS.correctOnSecondTry;
  return XP_REWARDS.correctOnThirdTry;
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, questionId, selectedAnswer, userId } = body as {
      sessionId: string;
      questionId: string;
      selectedAnswer: number;
      userId: string;
    };

    // Input validation
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'sessionId는 필수 항목입니다.' },
        { status: 400 },
      );
    }
    if (!questionId || typeof questionId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'questionId는 필수 항목입니다.' },
        { status: 400 },
      );
    }
    if (
      selectedAnswer === undefined ||
      selectedAnswer === null ||
      ![1, 2, 3, 4].includes(selectedAnswer)
    ) {
      return NextResponse.json(
        { success: false, error: 'selectedAnswer는 1~4 사이의 숫자여야 합니다.' },
        { status: 400 },
      );
    }
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'userId는 필수 항목입니다.' },
        { status: 400 },
      );
    }

    // Retrieve session
    let session = sessionStore.get(sessionId);

    // If not in check-answer's store, try looking up by constructing cache key
    // (for sessions created by generate-daily in the same process)
    if (!session) {
      // Walk through all sessions looking for a match
      for (const [, s] of sessionStore) {
        if (s.id === sessionId) {
          session = s;
          break;
        }
      }
    }

    if (!session) {
      return NextResponse.json(
        { success: false, error: '세션을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // Find the question
    const question = findQuestionInSession(session, questionId);
    if (!question) {
      return NextResponse.json(
        { success: false, error: '문제를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // If already correctly answered, return existing state
    if (question.isCorrect === true) {
      return NextResponse.json({
        isCorrect: true,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        xpEarned: 0,
        attempts: question.attempts,
        sessionComplete: isSessionComplete(session),
      });
    }

    // Increment attempts
    question.attempts += 1;
    session.totalAttempts += 1;

    // Update session status if this is the first interaction
    if (session.status === 'not_started') {
      session.status = 'in_progress';
    }

    // Check if answer is correct
    const isCorrect = selectedAnswer === question.correctAnswer;

    if (isCorrect) {
      // Mark question as correct
      question.isCorrect = true;
      question.studentAnswer = selectedAnswer;
      question.answeredAt = new Date().toISOString();

      // Track first-try correct answers
      if (question.attempts === 1) {
        session.correctOnFirstTry += 1;
      }

      // Calculate XP for this answer
      const xpEarned = calculateXPForAttempt(question.attempts);
      session.xpEarned += xpEarned;

      // Check if session is now complete
      const sessionComplete = isSessionComplete(session);

      const response: Record<string, unknown> = {
        isCorrect: true,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        xpEarned,
        attempts: question.attempts,
        sessionComplete,
      };

      if (sessionComplete) {
        // Mark session as completed
        session.status = 'completed';
        session.completedAt = new Date().toISOString();

        // Daily completion bonus
        const dailyCompleteXP = XP_REWARDS.dailyComplete;
        session.xpEarned += dailyCompleteXP;

        // Coins for daily completion
        let coinsEarned = COIN_REWARDS.dailyComplete;
        session.coinsEarned += coinsEarned;

        // Perfect day bonus
        const perfect = isPerfectSession(session);
        if (perfect) {
          session.xpEarned += XP_REWARDS.perfectDay;
          session.coinsEarned += COIN_REWARDS.perfectDay;
          coinsEarned += COIN_REWARDS.perfectDay;
        }

        // Update user progress
        const progress = getUserProgress(userId);
        progress.totalDaysCompleted += 1;
        progress.streak += 1;
        progress.totalXP += session.xpEarned;
        progress.totalCoins += session.coinsEarned;
        if (perfect) {
          progress.perfectDays += 1;
        }

        // Streak bonus
        const streakBonusXP = XP_REWARDS.streakBonus(progress.streak);
        session.xpEarned += streakBonusXP;
        progress.totalXP += streakBonusXP;

        // Update question stats
        progress.totalQuestionsAnswered += session.totalQuestions;
        const totalCorrect =
          progress.totalQuestionsAnswered > 0
            ? Math.round(
                ((progress.averageAccuracy / 100) *
                  (progress.totalQuestionsAnswered - session.totalQuestions) +
                  session.correctOnFirstTry) /
                  progress.totalQuestionsAnswered *
                  100,
              )
            : Math.round((session.correctOnFirstTry / session.totalQuestions) * 100);
        progress.averageAccuracy = totalCorrect;

        // Calculate level from XP (simple level calculation)
        progress.level = Math.max(1, Math.floor(Math.sqrt(progress.totalXP / 100)) + 1);

        // Check achievements
        const newAchievements = checkAchievements(
          {
            streak: progress.streak,
            totalDaysCompleted: progress.totalDaysCompleted,
            level: progress.level,
            stats: {
              totalQuestionsAnswered: progress.totalQuestionsAnswered,
              averageAccuracy: progress.averageAccuracy,
            },
          },
          progress.earnedAchievements,
        );

        const newAchievementIds: string[] = [];
        for (const achievement of newAchievements) {
          progress.earnedAchievements.push(achievement.id);
          progress.totalXP += achievement.xpReward;
          progress.totalCoins += achievement.coinReward;
          session.xpEarned += achievement.xpReward;
          session.coinsEarned += achievement.coinReward;
          newAchievementIds.push(achievement.id);
        }

        response.totalXP = session.xpEarned;
        response.totalCoins = session.coinsEarned;
        response.achievements = newAchievementIds;
        response.isPerfect = perfect;
      }

      return NextResponse.json(response);
    } else {
      // Wrong answer
      question.studentAnswer = selectedAnswer;

      // Get specific wrong explanation for the selected answer
      const wrongExplanation =
        question.wrongExplanations[selectedAnswer] ||
        `${selectedAnswer}번은 정답이 아닙니다. 다시 한번 생각해 보세요.`;

      return NextResponse.json({
        isCorrect: false,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        wrongExplanation,
        xpEarned: 0,
        attempts: question.attempts,
        sessionComplete: false,
      });
    }
  } catch (error) {
    console.error('답 확인 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      },
      { status: 500 },
    );
  }
}
