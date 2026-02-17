// =============================================================================
// HaruKorean - Generate Daily Quiz API Route
// =============================================================================

import type {
  Grade,
  Semester,
  GradeGroup,
  DailySession,
  SessionPassage,
  SessionQuestion,
  PassageType,
  Passage,
  Question,
} from '@/types';
import {
  getPassagesByGradeGroup,
  ALL_PASSAGES as ALL_PASSAGES_DATA,
} from '@/data/passages';
import {
  getQuestionsByPassageId,
  getGrammarQuestions,
} from '@/data/questions';
import { CURRICULUM_STANDARDS } from '@/data/curriculum';
import { generateDailyQuiz } from '@/lib/gemini';
import { getTodayDateString, generateSessionId } from '@/lib/utils';
import { getDB } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// ---------------------------------------------------------------------------
// Question count configuration per grade group
// ---------------------------------------------------------------------------

interface QuestionConfig {
  nonfiction: number;
  fiction: number;
  poetry: number;
  grammar: number;
}

function getQuestionConfig(gradeGroup: GradeGroup): QuestionConfig {
  switch (gradeGroup) {
    case '1-2':
      return { nonfiction: 4, fiction: 4, poetry: 3, grammar: 2 };
    case '3-4':
      return { nonfiction: 4, fiction: 4, poetry: 4, grammar: 2 };
    case '5-6':
      return { nonfiction: 5, fiction: 5, poetry: 4, grammar: 2 };
  }
}

function getGradeGroup(grade: Grade): GradeGroup {
  if (grade <= 2) return '1-2';
  if (grade <= 4) return '3-4';
  return '5-6';
}

// ---------------------------------------------------------------------------
// Helpers: pick random elements and build session structures
// ---------------------------------------------------------------------------

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function buildSessionQuestion(q: Question): SessionQuestion {
  return {
    questionId: q.id,
    question: q.question,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    wrongExplanations: q.wrongExplanations,
    attempts: 0,
  };
}

function buildSessionPassage(
  passage: Passage,
  questions: Question[],
  maxQuestions: number,
): SessionPassage {
  const selected = questions.length > maxQuestions
    ? pickRandom(questions, maxQuestions)
    : questions;

  return {
    passageId: passage.id,
    title: passage.title,
    type: passage.type,
    content: passage.content,
    questions: selected.map(buildSessionQuestion),
  };
}

// ---------------------------------------------------------------------------
// Select passages from seed data for a given grade group and semester
// ---------------------------------------------------------------------------

function selectPassagesFromSeed(
  gradeGroup: GradeGroup,
  grade: Grade,
  semester: Semester,
): { nonfiction: Passage | null; fiction: Passage | null; poetry: Passage | null } {
  const allPassages = getPassagesByGradeGroup(gradeGroup);

  // Filter to only passages that have questions available
  const hasQuestions = (p: Passage): boolean => {
    return getQuestionsByPassageId(p.id).length > 0;
  };

  // Prefer passages matching exact grade/semester WITH questions, then broader
  const preferExactWithQuestions = (type: PassageType): Passage | null => {
    // 1. Exact grade+semester with questions
    const exactWithQ = allPassages.filter(
      (p) => p.type === type && p.grade === grade && p.semester === semester && hasQuestions(p),
    );
    if (exactWithQ.length > 0) return pickRandom(exactWithQ, 1)[0];

    // 2. Same grade with questions
    const gradeWithQ = allPassages.filter(
      (p) => p.type === type && p.grade === grade && hasQuestions(p),
    );
    if (gradeWithQ.length > 0) return pickRandom(gradeWithQ, 1)[0];

    // 3. Same grade group with questions
    const groupWithQ = allPassages.filter(
      (p) => p.type === type && hasQuestions(p),
    );
    if (groupWithQ.length > 0) return pickRandom(groupWithQ, 1)[0];

    // 4. ANY passage with questions (cross grade-group)
    const anyWithQ = ALL_PASSAGES_DATA.filter(
      (p) => p.type === type && hasQuestions(p),
    );
    if (anyWithQ.length > 0) return pickRandom(anyWithQ, 1)[0];

    return null;
  };

  return {
    nonfiction: preferExactWithQuestions('nonfiction'),
    fiction: preferExactWithQuestions('fiction'),
    poetry: preferExactWithQuestions('poetry'),
  };
}

// ---------------------------------------------------------------------------
// Select grammar questions from seed data
// ---------------------------------------------------------------------------

function selectGrammarQuestions(grade: Grade, count: number): Question[] {
  const allGrammar = getGrammarQuestions();
  const gradeGroup = getGradeGroup(grade);

  const gradeGroupPrefix =
    gradeGroup === '1-2' ? '2국04' :
    gradeGroup === '3-4' ? '4국04' :
    '6국04';

  const matched = allGrammar.filter((q) =>
    q.relatedStandard.startsWith(gradeGroupPrefix),
  );

  if (matched.length >= count) {
    return pickRandom(matched, count);
  }

  if (allGrammar.length >= count) {
    return pickRandom(allGrammar, count);
  }

  return allGrammar.slice(0, count);
}

// ---------------------------------------------------------------------------
// Build a complete DailySession from seed data
// ---------------------------------------------------------------------------

function buildSessionFromSeed(
  userId: string,
  grade: Grade,
  semester: Semester,
  date: string,
): DailySession | null {
  const gradeGroup = getGradeGroup(grade);
  const config = getQuestionConfig(gradeGroup);

  const selected = selectPassagesFromSeed(gradeGroup, grade, semester);

  if (!selected.nonfiction && !selected.fiction && !selected.poetry) {
    return null;
  }

  const passages: SessionPassage[] = [];

  if (selected.nonfiction) {
    const questions = getQuestionsByPassageId(selected.nonfiction.id);
    passages.push(
      buildSessionPassage(selected.nonfiction, questions, config.nonfiction),
    );
  }

  if (selected.fiction) {
    const questions = getQuestionsByPassageId(selected.fiction.id);
    passages.push(
      buildSessionPassage(selected.fiction, questions, config.fiction),
    );
  }

  if (selected.poetry) {
    const questions = getQuestionsByPassageId(selected.poetry.id);
    passages.push(
      buildSessionPassage(selected.poetry, questions, config.poetry),
    );
  }

  const grammarQuestions = selectGrammarQuestions(grade, config.grammar);
  const sessionGrammar = grammarQuestions.map(buildSessionQuestion);

  const totalQuestions =
    passages.reduce((sum, p) => sum + p.questions.length, 0) +
    sessionGrammar.length;

  const sessionId = generateSessionId(userId);

  const session: DailySession = {
    id: sessionId,
    userId,
    grade,
    semester,
    date,
    status: 'not_started',
    passages,
    grammarQuestions: sessionGrammar,
    totalQuestions,
    correctOnFirstTry: 0,
    totalAttempts: 0,
    xpEarned: 0,
    coinsEarned: 0,
    startedAt: new Date().toISOString(),
    timeSpentSeconds: 0,
  };

  return session;
}

// ---------------------------------------------------------------------------
// Build a complete DailySession from Gemini AI output
// ---------------------------------------------------------------------------

async function buildSessionFromGemini(
  userId: string,
  grade: Grade,
  semester: Semester,
  date: string,
  pastPassageTitles: string[] = [],
): Promise<DailySession> {
  const gradeGroup = getGradeGroup(grade);
  const standards = CURRICULUM_STANDARDS.filter(
    (s) => s.gradeGroup === gradeGroup,
  );

  const result = await generateDailyQuiz(grade, semester, standards, pastPassageTitles);

  const passages: SessionPassage[] = result.passages.map((gp) => ({
    passageId: gp.id,
    title: gp.title,
    type: gp.type,
    content: gp.content,
    questions: gp.questions.map((gq) => ({
      questionId: gq.id,
      question: gq.question,
      choices: gq.choices,
      correctAnswer: gq.correctAnswer,
      explanation: gq.explanation,
      wrongExplanations: gq.wrongExplanations,
      attempts: 0,
    })),
  }));

  const grammarQuestions: SessionQuestion[] = result.grammarQuestions.map((gq) => ({
    questionId: gq.id,
    question: gq.question,
    choices: gq.choices,
    correctAnswer: gq.correctAnswer,
    explanation: gq.explanation,
    wrongExplanations: gq.wrongExplanations,
    attempts: 0,
  }));

  const totalQuestions =
    passages.reduce((sum, p) => sum + p.questions.length, 0) +
    grammarQuestions.length;

  const sessionId = generateSessionId(userId);

  return {
    id: sessionId,
    userId,
    grade,
    semester,
    date,
    status: 'not_started',
    passages,
    grammarQuestions,
    totalQuestions,
    correctOnFirstTry: 0,
    totalAttempts: 0,
    xpEarned: 0,
    coinsEarned: 0,
    startedAt: new Date().toISOString(),
    timeSpentSeconds: 0,
  };
}

// ---------------------------------------------------------------------------
// Helper: convert a D1 row back into a DailySession
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
// Helper: persist a DailySession to D1
// ---------------------------------------------------------------------------

async function persistSession(
  db: { prepare: (query: string) => { bind: (...args: unknown[]) => { run: () => Promise<unknown> } } },
  session: DailySession,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO sessions (
        id, user_id, grade, semester, date, status,
        passages_data, grammar_questions_data,
        total_questions, correct_on_first_try, total_attempts,
        xp_earned, coins_earned, started_at, completed_at, time_spent_seconds
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      session.id,
      session.userId,
      session.grade,
      session.semester,
      session.date,
      session.status,
      JSON.stringify(session.passages),
      JSON.stringify(session.grammarQuestions),
      session.totalQuestions,
      session.correctOnFirstTry,
      session.totalAttempts,
      session.xpEarned,
      session.coinsEarned,
      session.startedAt,
      session.completedAt || null,
      session.timeSpentSeconds,
    )
    .run();
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { userId, grade, semester } = body as {
      userId?: string;
      grade: number;
      semester: number;
    };
    const forceNew = !!(body as { forceNew?: boolean }).forceNew;

    // Try to get authenticated user; always prefer their profile data
    const authUser = await getAuthUser(request);
    if (authUser) {
      userId = authUser.uid;
      // Always use the authenticated user's grade/semester
      grade = authUser.grade;
      semester = authUser.semester;
    }

    // Input validation
    if (!userId || typeof userId !== 'string') {
      return Response.json(
        { success: false, error: 'userId는 필수 항목입니다.' },
        { status: 400 },
      );
    }

    if (!grade || grade < 1 || grade > 6) {
      return Response.json(
        { success: false, error: '학년은 1~6 사이여야 합니다.' },
        { status: 400 },
      );
    }

    if (!semester || (semester !== 1 && semester !== 2)) {
      return Response.json(
        { success: false, error: '학기는 1 또는 2여야 합니다.' },
        { status: 400 },
      );
    }

    const validGrade = grade as Grade;
    const validSemester = semester as Semester;
    const today = getTodayDateString();

    const db = await getDB();

    // -----------------------------------------------------------------------
    // Check for existing session in D1 for this user + date
    // -----------------------------------------------------------------------

    if (forceNew) {
      // Delete existing session for today so we can regenerate
      await db
        .prepare('DELETE FROM sessions WHERE user_id = ? AND date = ?')
        .bind(userId, today)
        .run();
    } else {
      const existingRow = await db
        .prepare('SELECT * FROM sessions WHERE user_id = ? AND date = ?')
        .bind(userId, today)
        .first<Record<string, unknown>>();

      if (existingRow) {
        const existingSession = rowToSession(existingRow);
        // Validate existing session has questions; if not, delete and regenerate
        const totalPassageQ = existingSession.passages.reduce((s, p) => s + p.questions.length, 0);
        if (totalPassageQ > 0) {
          return Response.json({
            success: true,
            session: existingSession,
          });
        }
        // Session has no passage questions - delete and regenerate
        await db
          .prepare('DELETE FROM sessions WHERE user_id = ? AND date = ?')
          .bind(userId, today)
          .run();
      }
    }

    // -----------------------------------------------------------------------
    // Fetch past passage titles to prevent duplicates
    // -----------------------------------------------------------------------

    let pastPassageTitles: string[] = [];
    try {
      const pastRows = await db
        .prepare(
          'SELECT passages_data FROM sessions WHERE user_id = ? ORDER BY date DESC LIMIT 30',
        )
        .bind(userId)
        .all<{ passages_data: string }>();

      if (pastRows.results) {
        for (const row of pastRows.results) {
          try {
            const passages = JSON.parse(row.passages_data || '[]') as { title: string }[];
            for (const p of passages) {
              if (p.title) pastPassageTitles.push(p.title);
            }
          } catch {
            // skip malformed rows
          }
        }
      }
    } catch {
      // If query fails, proceed without past titles
    }

    // -----------------------------------------------------------------------
    // Try Gemini AI first, fall back to seed data
    // -----------------------------------------------------------------------

    let session: DailySession | null = null;

    try {
      session = await buildSessionFromGemini(
        userId,
        validGrade,
        validSemester,
        today,
        pastPassageTitles,
      );

      // Validate Gemini output has actual questions
      const geminiPassageQ = session.passages.reduce((s, p) => s + p.questions.length, 0);
      if (geminiPassageQ === 0) {
        console.error('Gemini 생성 결과에 문제가 없음, 시드 데이터로 fallback');
        throw new Error('Gemini output has no passage questions');
      }
    } catch (geminiError) {
      console.error('Gemini 생성 실패, 시드 데이터로 fallback:', geminiError);

      session = buildSessionFromSeed(userId, validGrade, validSemester, today);

      if (!session) {
        return Response.json(
          {
            success: false,
            error: '오늘의 학습을 생성할 수 없습니다. 잠시 후 다시 시도해 주세요.',
          },
          { status: 500 },
        );
      }
    }

    // Final validation: ensure session has passage questions
    const totalPassageQ = session.passages.reduce((s, p) => s + p.questions.length, 0);
    if (totalPassageQ === 0) {
      // Passages have no questions - don't persist a broken session
      return Response.json(
        {
          success: false,
          error: '학습 문제를 생성할 수 없습니다. 잠시 후 다시 시도해 주세요.',
        },
        { status: 500 },
      );
    }

    // -----------------------------------------------------------------------
    // Persist session to D1
    // -----------------------------------------------------------------------

    await persistSession(db, session);

    return Response.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('일일 학습 생성 오류:', error);
    return Response.json(
      {
        success: false,
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      },
      { status: 500 },
    );
  }
}
