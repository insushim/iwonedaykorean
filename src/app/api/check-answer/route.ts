// =============================================================================
// HaruKorean - Check Answer API Route
// =============================================================================

import type { DailySession, SessionQuestion, Grade, Semester } from '@/types';
import { XP_REWARDS, COIN_REWARDS, checkAchievements } from '@/data/gamification';
import { getDB } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { calculateLevel } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Helper: convert a D1 session row into a DailySession
// ---------------------------------------------------------------------------

function rowToSession(row: Record<string, unknown>): DailySession {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    grade: row.grade as Grade,
    semester: row.semester as Semester,
    date: row.date as string,
    status: (row.status as DailySession['status']) || 'in_progress',
    passages: JSON.parse((row.passages_data as string) || '[]'),
    grammarQuestions: JSON.parse((row.grammar_questions_data as string) || '[]'),
    totalQuestions: (row.total_questions as number) || 0,
    correctOnFirstTry: (row.correct_on_first_try as number) || 0,
    totalAttempts: (row.total_attempts as number) || 0,
    xpEarned: (row.xp_earned as number) || 0,
    coinsEarned: (row.coins_earned as number) || 0,
    startedAt: (row.started_at as string) || new Date().toISOString(),
    completedAt: row.completed_at as string | undefined,
    timeSpentSeconds: (row.time_spent_seconds as number) || 0,
  };
}

// ---------------------------------------------------------------------------
// Find a question within a session (passage questions + grammar questions)
// ---------------------------------------------------------------------------

function findQuestionInSession(
  session: DailySession,
  questionId: string,
): SessionQuestion | null {
  for (const passage of session.passages) {
    const found = passage.questions.find((q) => q.questionId === questionId);
    if (found) return found;
  }
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { sessionId, questionId, selectedAnswer, userId } = body as {
      sessionId: string;
      questionId: string;
      selectedAnswer: number;
      userId?: string;
    };

    // Try authenticated user first
    const authUser = await getAuthUser(request);
    if (authUser) {
      userId = authUser.uid;
    }

    // Input validation
    if (!sessionId || typeof sessionId !== 'string') {
      return Response.json(
        { success: false, error: 'sessionId는 필수 항목입니다.' },
        { status: 400 },
      );
    }
    if (!questionId || typeof questionId !== 'string') {
      return Response.json(
        { success: false, error: 'questionId는 필수 항목입니다.' },
        { status: 400 },
      );
    }
    if (
      selectedAnswer === undefined ||
      selectedAnswer === null ||
      ![1, 2, 3, 4].includes(selectedAnswer)
    ) {
      return Response.json(
        { success: false, error: 'selectedAnswer는 1~4 사이의 숫자여야 합니다.' },
        { status: 400 },
      );
    }
    if (!userId || typeof userId !== 'string') {
      return Response.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    const db = await getDB();

    // -----------------------------------------------------------------------
    // Retrieve session from D1
    // -----------------------------------------------------------------------

    const sessionRow = await db
      .prepare('SELECT * FROM sessions WHERE id = ?')
      .bind(sessionId)
      .first<Record<string, unknown>>();

    if (!sessionRow) {
      return Response.json(
        { success: false, error: '세션을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const session = rowToSession(sessionRow);

    // Find the question
    const question = findQuestionInSession(session, questionId);
    if (!question) {
      return Response.json(
        { success: false, error: '문제를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // If already correctly answered, return existing state
    if (question.isCorrect === true) {
      return Response.json({
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

      const responseData: Record<string, unknown> = {
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

        // -------------------------------------------------------------------
        // Update user stats in D1
        // -------------------------------------------------------------------

        const userRow = await db
          .prepare('SELECT * FROM users WHERE id = ?')
          .bind(userId)
          .first<Record<string, unknown>>();

        if (userRow) {
          const currentXp = (userRow.xp as number) || 0;
          const currentCoins = (userRow.coins as number) || 0;
          const currentStreak = (userRow.streak as number) || 0;
          const currentLongestStreak = (userRow.longest_streak as number) || 0;
          const currentTotalDays = (userRow.total_days_completed as number) || 0;
          const currentBadges: string[] = JSON.parse((userRow.badges as string) || '[]');
          const lastStudyDate = userRow.last_study_date as string | null;

          // Calculate streak
          const today = session.date;
          let newStreak = currentStreak;
          if (lastStudyDate) {
            const lastDate = new Date(lastStudyDate);
            const todayDate = new Date(today);
            const diffMs = todayDate.getTime() - lastDate.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              newStreak = currentStreak + 1;
            } else if (diffDays > 1) {
              newStreak = 1;
            }
            // diffDays === 0 means same day, keep streak as is
          } else {
            newStreak = 1;
          }

          // Streak bonus XP
          const streakBonusXP = XP_REWARDS.streakBonus(newStreak);
          session.xpEarned += streakBonusXP;

          const newTotalXp = currentXp + session.xpEarned;
          const newTotalCoins = currentCoins + session.coinsEarned;
          const newTotalDays = currentTotalDays + 1;
          const newLongestStreak = Math.max(currentLongestStreak, newStreak);
          const newLevel = calculateLevel(newTotalXp);

          // Check achievements
          const totalQuestionsAnswered = session.totalQuestions;
          const accuracy = session.totalQuestions > 0
            ? Math.round((session.correctOnFirstTry / session.totalQuestions) * 100)
            : 0;

          const newAchievements = checkAchievements(
            {
              streak: newStreak,
              totalDaysCompleted: newTotalDays,
              level: newLevel,
              stats: {
                totalQuestionsAnswered,
                averageAccuracy: accuracy,
              },
            },
            currentBadges,
          );

          const newAchievementIds: string[] = [];
          let achievementXP = 0;
          let achievementCoins = 0;
          for (const achievement of newAchievements) {
            currentBadges.push(achievement.id);
            achievementXP += achievement.xpReward;
            achievementCoins += achievement.coinReward;
            newAchievementIds.push(achievement.id);
          }

          session.xpEarned += achievementXP;
          session.coinsEarned += achievementCoins;

          // Update domain scores based on session results
          const domainUpdates = computeDomainUpdates(session, userRow);

          await db
            .prepare(
              `UPDATE users SET
                xp = ?, level = ?, coins = ?,
                streak = ?, longest_streak = ?,
                total_days_completed = ?,
                badges = ?,
                last_study_date = ?,
                reading_score = ?, reading_total = ?, reading_correct = ?,
                literature_score = ?, literature_total = ?, literature_correct = ?,
                grammar_score = ?, grammar_total = ?, grammar_correct = ?,
                updated_at = ?
              WHERE id = ?`,
            )
            .bind(
              currentXp + session.xpEarned,
              newLevel,
              currentCoins + session.coinsEarned,
              newStreak,
              newLongestStreak,
              newTotalDays,
              JSON.stringify(currentBadges),
              today,
              domainUpdates.readingScore, domainUpdates.readingTotal, domainUpdates.readingCorrect,
              domainUpdates.literatureScore, domainUpdates.literatureTotal, domainUpdates.literatureCorrect,
              domainUpdates.grammarScore, domainUpdates.grammarTotal, domainUpdates.grammarCorrect,
              new Date().toISOString(),
              userId,
            )
            .run();

          responseData.totalXP = session.xpEarned;
          responseData.totalCoins = session.coinsEarned;
          responseData.achievements = newAchievementIds;
          responseData.isPerfect = perfect;
        }

        // -----------------------------------------------------------------
        // Insert wrong answers into wrong_notes table
        // -----------------------------------------------------------------

        await insertWrongNotes(db, session, userId);
      }

      // -------------------------------------------------------------------
      // Update session in D1
      // -------------------------------------------------------------------

      await db
        .prepare(
          `UPDATE sessions SET
            status = ?, passages_data = ?, grammar_questions_data = ?,
            correct_on_first_try = ?, total_attempts = ?,
            xp_earned = ?, coins_earned = ?,
            completed_at = ?, time_spent_seconds = ?
          WHERE id = ?`,
        )
        .bind(
          session.status,
          JSON.stringify(session.passages),
          JSON.stringify(session.grammarQuestions),
          session.correctOnFirstTry,
          session.totalAttempts,
          session.xpEarned,
          session.coinsEarned,
          session.completedAt || null,
          session.timeSpentSeconds,
          session.id,
        )
        .run();

      return Response.json(responseData);
    } else {
      // Wrong answer
      question.studentAnswer = selectedAnswer;

      // Get specific wrong explanation for the selected answer
      const wrongExplanation =
        question.wrongExplanations[selectedAnswer] ||
        `${selectedAnswer}번은 정답이 아닙니다. 다시 한번 생각해 보세요.`;

      // Update session in D1 (save the attempt)
      await db
        .prepare(
          `UPDATE sessions SET
            status = ?, passages_data = ?, grammar_questions_data = ?,
            total_attempts = ?
          WHERE id = ?`,
        )
        .bind(
          session.status,
          JSON.stringify(session.passages),
          JSON.stringify(session.grammarQuestions),
          session.totalAttempts,
          session.id,
        )
        .run();

      return Response.json({
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
    return Response.json(
      {
        success: false,
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// Compute updated domain scores from session + existing user row
// ---------------------------------------------------------------------------

function computeDomainUpdates(
  session: DailySession,
  userRow: Record<string, unknown>,
) {
  let readingTotal = (userRow.reading_total as number) || 0;
  let readingCorrect = (userRow.reading_correct as number) || 0;
  let literatureTotal = (userRow.literature_total as number) || 0;
  let literatureCorrect = (userRow.literature_correct as number) || 0;
  let grammarTotal = (userRow.grammar_total as number) || 0;
  let grammarCorrect = (userRow.grammar_correct as number) || 0;

  for (const passage of session.passages) {
    for (const q of passage.questions) {
      if (passage.type === 'nonfiction') {
        readingTotal += 1;
        if (q.isCorrect && q.attempts === 1) readingCorrect += 1;
      } else {
        // fiction and poetry => literature
        literatureTotal += 1;
        if (q.isCorrect && q.attempts === 1) literatureCorrect += 1;
      }
    }
  }

  for (const q of session.grammarQuestions) {
    grammarTotal += 1;
    if (q.isCorrect && q.attempts === 1) grammarCorrect += 1;
  }

  return {
    readingScore: readingTotal > 0 ? Math.round((readingCorrect / readingTotal) * 100) : null,
    readingTotal,
    readingCorrect,
    literatureScore: literatureTotal > 0 ? Math.round((literatureCorrect / literatureTotal) * 100) : null,
    literatureTotal,
    literatureCorrect,
    grammarScore: grammarTotal > 0 ? Math.round((grammarCorrect / grammarTotal) * 100) : null,
    grammarTotal,
    grammarCorrect,
  };
}

// ---------------------------------------------------------------------------
// Insert wrong answers into wrong_notes
// ---------------------------------------------------------------------------

async function insertWrongNotes(
  db: { prepare: (query: string) => { bind: (...args: unknown[]) => { run: () => Promise<unknown> } } },
  session: DailySession,
  userId: string,
): Promise<void> {
  const wrongQuestions: Array<{
    question: SessionQuestion;
    passageTitle?: string;
    domain: string;
  }> = [];

  // Collect all wrong answers (questions that needed more than 1 attempt)
  for (const passage of session.passages) {
    for (const q of passage.questions) {
      if (q.isCorrect && q.attempts > 1) {
        const domain = passage.type === 'nonfiction' ? 'reading' : 'literature';
        wrongQuestions.push({ question: q, passageTitle: passage.title, domain });
      }
    }
  }

  for (const q of session.grammarQuestions) {
    if (q.isCorrect && q.attempts > 1) {
      wrongQuestions.push({ question: q, domain: 'grammar' });
    }
  }

  for (const item of wrongQuestions) {
    const q = item.question;
    const noteId = crypto.randomUUID();
    const wrongExplanation = q.studentAnswer
      ? (q.wrongExplanations[q.studentAnswer] || '')
      : '';

    await db
      .prepare(
        `INSERT INTO wrong_notes (
          id, user_id, session_id, question_id,
          passage_title, question, correct_answer, student_answer,
          explanation, wrong_explanation,
          category, domain, created_at, reviewed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      )
      .bind(
        noteId,
        userId,
        session.id,
        q.questionId,
        item.passageTitle || null,
        q.question,
        q.correctAnswer,
        q.studentAnswer || null,
        q.explanation,
        wrongExplanation,
        'wrong_answer',
        item.domain,
        new Date().toISOString(),
      )
      .run();
  }
}
