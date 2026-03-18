// =============================================================================
// HaruKorean - Generate Daily Quiz API Route
// =============================================================================
// Architecture: DB content rotation first → Gemini AI as last resort only
// =============================================================================

import type {
  Grade,
  Semester,
  GradeGroup,
  DailySession,
  SessionPassage,
  SessionQuestion,
  Question,
} from "@/types";
import { CURRICULUM_STANDARDS } from "@/data/curriculum";
import { generateDailyQuiz } from "@/lib/gemini";
import { getTodayDateString, generateSessionId } from "@/lib/utils";
import { getDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { selectDailyContent, type PassageWithQuestions } from "@/data/content";

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
    case "1-2":
      return { nonfiction: 4, fiction: 4, poetry: 3, grammar: 2 };
    case "3-4":
      return { nonfiction: 4, fiction: 4, poetry: 4, grammar: 2 };
    case "5-6":
      return { nonfiction: 5, fiction: 5, poetry: 4, grammar: 2 };
  }
}

function getGradeGroup(grade: Grade): GradeGroup {
  if (grade <= 2) return "1-2";
  if (grade <= 4) return "3-4";
  return "5-6";
}

// ---------------------------------------------------------------------------
// Helpers: build session structures from content pool
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

function buildSessionPassageFromContent(
  item: PassageWithQuestions,
  maxQuestions: number,
  correctlyAnsweredIds: Set<string> = new Set(),
): SessionPassage {
  // Filter out questions the user already answered correctly
  const availableQuestions =
    correctlyAnsweredIds.size > 0
      ? item.questions.filter((q) => !correctlyAnsweredIds.has(q.id))
      : item.questions;

  const selected =
    availableQuestions.length > maxQuestions
      ? pickRandom(availableQuestions, maxQuestions)
      : availableQuestions;

  return {
    passageId: item.passage.id,
    title: item.passage.title,
    type: item.passage.type,
    content: item.passage.content,
    questions: selected.map(buildSessionQuestion),
  };
}

// ---------------------------------------------------------------------------
// Build session from content pool (deterministic daily rotation)
// ---------------------------------------------------------------------------

async function buildSessionFromContentPool(
  userId: string,
  grade: Grade,
  semester: Semester,
  date: string,
  pastPassageTitles: string[] = [],
  correctlyAnsweredIds: Set<string> = new Set(),
): Promise<DailySession | null> {
  const gradeGroup = getGradeGroup(grade);
  const config = getQuestionConfig(gradeGroup);

  const daily = await selectDailyContent(
    grade,
    semester,
    date,
    pastPassageTitles,
    userId,
  );

  if (!daily.nonfiction && !daily.fiction && !daily.poetry) {
    return null;
  }

  const passages: SessionPassage[] = [];

  if (daily.nonfiction && daily.nonfiction.questions.length > 0) {
    const sp = buildSessionPassageFromContent(
      daily.nonfiction,
      config.nonfiction,
      correctlyAnsweredIds,
    );
    if (sp.questions.length > 0) passages.push(sp);
  }

  if (daily.fiction && daily.fiction.questions.length > 0) {
    const sp = buildSessionPassageFromContent(
      daily.fiction,
      config.fiction,
      correctlyAnsweredIds,
    );
    if (sp.questions.length > 0) passages.push(sp);
  }

  if (daily.poetry && daily.poetry.questions.length > 0) {
    const sp = buildSessionPassageFromContent(
      daily.poetry,
      config.poetry,
      correctlyAnsweredIds,
    );
    if (sp.questions.length > 0) passages.push(sp);
  }

  // Filter out correctly-answered grammar questions too
  const grammarPool =
    correctlyAnsweredIds.size > 0
      ? daily.grammarQuestions.filter((q) => !correctlyAnsweredIds.has(q.id))
      : daily.grammarQuestions;
  const sessionGrammar = grammarPool.map(buildSessionQuestion);

  const totalQuestions =
    passages.reduce((sum, p) => sum + p.questions.length, 0) +
    sessionGrammar.length;

  if (totalQuestions === 0) {
    return null;
  }

  const sessionId = generateSessionId(userId);

  return {
    id: sessionId,
    userId,
    grade,
    semester,
    date,
    status: "not_started",
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
}

// ---------------------------------------------------------------------------
// Build a complete DailySession from Gemini AI output (fallback only)
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

  const result = await generateDailyQuiz(
    grade,
    semester,
    standards,
    pastPassageTitles,
  );

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

  const grammarQuestions: SessionQuestion[] = result.grammarQuestions.map(
    (gq) => ({
      questionId: gq.id,
      question: gq.question,
      choices: gq.choices,
      correctAnswer: gq.correctAnswer,
      explanation: gq.explanation,
      wrongExplanations: gq.wrongExplanations,
      attempts: 0,
    }),
  );

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
    status: "not_started",
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
    status: (row.status as DailySession["status"]) || "in_progress",
    passages: JSON.parse((row.passages_data as string) || "[]"),
    grammarQuestions: JSON.parse(
      (row.grammar_questions_data as string) || "[]",
    ),
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
  db: {
    prepare: (query: string) => {
      bind: (...args: unknown[]) => { run: () => Promise<unknown> };
    };
  },
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
// Shared AI-generated content pool (D1 table: shared_content)
// ---------------------------------------------------------------------------

type DBLike = {
  prepare: (query: string) => {
    bind: (...args: unknown[]) => {
      run: () => Promise<unknown>;
      first: <T>() => Promise<T | null>;
      all: <T>() => Promise<{ results: T[] }>;
    };
  };
};

async function buildSessionFromSharedPool(
  db: DBLike,
  userId: string,
  grade: Grade,
  semester: Semester,
  date: string,
  pastPassageTitles: string[] = [],
): Promise<DailySession | null> {
  try {
    // Fetch all shared content for this grade
    const rows = await db
      .prepare(
        "SELECT * FROM shared_content WHERE grade = ? AND semester = ? ORDER BY created_at DESC",
      )
      .bind(grade, semester)
      .all<{
        id: string;
        grade: number;
        semester: number;
        passage_type: string;
        title: string;
        content_json: string;
        created_at: string;
      }>();

    if (!rows.results || rows.results.length === 0) return null;

    // Filter out already-used passages
    const available = rows.results.filter(
      (r) => !pastPassageTitles.includes(r.title),
    );
    if (available.length < 3) return null;

    const gradeGroup = getGradeGroup(grade);
    const config = getQuestionConfig(gradeGroup);

    // Select one of each type using date hash
    const byType: Record<string, typeof available> = {};
    for (const r of available) {
      if (!byType[r.passage_type]) byType[r.passage_type] = [];
      byType[r.passage_type].push(r);
    }

    const passages: SessionPassage[] = [];
    const types: [string, number][] = [
      ["nonfiction", config.nonfiction],
      ["fiction", config.fiction],
      ["poetry", config.poetry],
    ];

    for (const [type, maxQ] of types) {
      const pool = byType[type];
      if (!pool || pool.length === 0) continue;
      const hash = dateHash(
        date,
        `shared-${grade}-${semester}-${type}-${userId}`,
      );
      const item = pool[hash % pool.length];
      try {
        const parsed = JSON.parse(item.content_json) as SessionPassage;
        if (parsed.questions && parsed.questions.length > 0) {
          parsed.questions = parsed.questions.slice(0, maxQ);
          passages.push(parsed);
        }
      } catch {
        // skip malformed entries
      }
    }

    if (passages.length === 0) return null;

    // Grammar from static pool
    const grammarQuestions = (
      await selectDailyContent(grade, semester, date, pastPassageTitles, userId)
    ).grammarQuestions.map(buildSessionQuestion);

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
      status: "not_started",
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
  } catch {
    return null;
  }
}

function dateHash(dateStr: string, salt: string = ""): number {
  const str = dateStr + salt;
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h = h & h;
  }
  return Math.abs(h);
}

async function saveToSharedPool(
  db: DBLike,
  grade: Grade,
  semester: Semester,
  session: DailySession,
): Promise<void> {
  try {
    // Create the shared_content table if it doesn't exist
    await db
      .prepare(
        `CREATE TABLE IF NOT EXISTS shared_content (
          id TEXT PRIMARY KEY,
          grade INTEGER NOT NULL,
          semester INTEGER NOT NULL,
          passage_type TEXT NOT NULL,
          title TEXT NOT NULL,
          content_json TEXT NOT NULL,
          created_at TEXT NOT NULL
        )`,
      )
      .bind()
      .run();

    const now = new Date().toISOString();

    for (const passage of session.passages) {
      const id = `sc-${grade}-${semester}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await db
        .prepare(
          "INSERT OR IGNORE INTO shared_content (id, grade, semester, passage_type, title, content_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(
          id,
          grade,
          semester,
          passage.type,
          passage.title,
          JSON.stringify(passage),
          now,
        )
        .run();
    }
  } catch (err) {
    console.error("공유 풀 저장 실패:", err);
  }
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
    if (!userId || typeof userId !== "string") {
      return Response.json(
        { success: false, error: "userId는 필수 항목입니다." },
        { status: 400 },
      );
    }

    if (!grade || grade < 1 || grade > 6) {
      return Response.json(
        { success: false, error: "학년은 1~6 사이여야 합니다." },
        { status: 400 },
      );
    }

    if (!semester || (semester !== 1 && semester !== 2)) {
      return Response.json(
        { success: false, error: "학기는 1 또는 2여야 합니다." },
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
        .prepare("DELETE FROM sessions WHERE user_id = ? AND date = ?")
        .bind(userId, today)
        .run();
    } else {
      const existingRow = await db
        .prepare("SELECT * FROM sessions WHERE user_id = ? AND date = ?")
        .bind(userId, today)
        .first<Record<string, unknown>>();

      if (existingRow) {
        const existingSession = rowToSession(existingRow);
        // Validate existing session has questions; if not, delete and regenerate
        const totalPassageQ = existingSession.passages.reduce(
          (s, p) => s + p.questions.length,
          0,
        );
        if (totalPassageQ > 0) {
          return Response.json({
            success: true,
            session: existingSession,
          });
        }
        // Session has no passage questions - delete and regenerate
        await db
          .prepare("DELETE FROM sessions WHERE user_id = ? AND date = ?")
          .bind(userId, today)
          .run();
      }
    }

    // -----------------------------------------------------------------------
    // Fetch past passage titles to prevent duplicates
    // -----------------------------------------------------------------------

    let pastPassageTitles: string[] = [];
    const correctlyAnsweredQuestionIds = new Set<string>();
    try {
      const pastRows = await db
        .prepare(
          "SELECT passages_data, grammar_questions_data FROM sessions WHERE user_id = ? ORDER BY date DESC LIMIT 365",
        )
        .bind(userId)
        .all<{ passages_data: string; grammar_questions_data: string }>();

      if (pastRows.results) {
        for (const row of pastRows.results) {
          try {
            const passages = JSON.parse(
              row.passages_data || "[]",
            ) as SessionPassage[];
            for (const p of passages) {
              if (p.title) pastPassageTitles.push(p.title);
              if (p.questions) {
                for (const q of p.questions) {
                  if (q.isCorrect === true && q.questionId) {
                    correctlyAnsweredQuestionIds.add(q.questionId);
                  }
                }
              }
            }
          } catch {
            // skip malformed rows
          }
          try {
            const grammarQs = JSON.parse(
              row.grammar_questions_data || "[]",
            ) as SessionQuestion[];
            for (const q of grammarQs) {
              if (q.isCorrect === true && q.questionId) {
                correctlyAnsweredQuestionIds.add(q.questionId);
              }
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
    // Strategy: Content pool first (no AI cost) → Gemini AI as last resort
    // -----------------------------------------------------------------------

    let session: DailySession | null = null;

    // 1. Try content pool (deterministic, no API cost)
    try {
      session = await buildSessionFromContentPool(
        userId,
        validGrade,
        validSemester,
        today,
        pastPassageTitles,
        correctlyAnsweredQuestionIds,
      );
    } catch (poolError) {
      console.error("콘텐츠 풀 로드 실패:", poolError);
    }

    // 2. Check shared AI-generated pool in D1 before calling Gemini
    if (!session) {
      try {
        session = await buildSessionFromSharedPool(
          db,
          userId,
          validGrade,
          validSemester,
          today,
          pastPassageTitles,
        );
      } catch (poolError) {
        console.error("공유 풀 로드 실패:", poolError);
      }
    }

    // 3. Last resort: Gemini AI → generate and save to shared pool for reuse
    if (!session) {
      try {
        session = await buildSessionFromGemini(
          userId,
          validGrade,
          validSemester,
          today,
          pastPassageTitles,
        );

        const geminiPassageQ = session.passages.reduce(
          (s, p) => s + p.questions.length,
          0,
        );
        if (geminiPassageQ === 0) {
          console.error("Gemini 생성 결과에 문제가 없음");
          session = null;
        } else {
          // Save AI-generated passages to shared pool for other students to reuse
          await saveToSharedPool(db, validGrade, validSemester, session);
        }
      } catch (geminiError) {
        console.error("Gemini 생성 실패:", geminiError);
        session = null;
      }
    }

    if (!session) {
      return Response.json(
        {
          success: false,
          error:
            "오늘의 학습을 생성할 수 없습니다. 잠시 후 다시 시도해 주세요.",
        },
        { status: 500 },
      );
    }

    // Final validation: ensure session has passage questions
    const totalPassageQ = session.passages.reduce(
      (s, p) => s + p.questions.length,
      0,
    );
    if (totalPassageQ === 0) {
      // Passages have no questions - don't persist a broken session
      return Response.json(
        {
          success: false,
          error: "학습 문제를 생성할 수 없습니다. 잠시 후 다시 시도해 주세요.",
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
    console.error("일일 학습 생성 오류:", error);
    return Response.json(
      {
        success: false,
        error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      },
      { status: 500 },
    );
  }
}
