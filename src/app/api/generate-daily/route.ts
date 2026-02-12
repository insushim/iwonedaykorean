// =============================================================================
// HaruKorean (하루국어) - Generate Daily Quiz API Route
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
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
  SEED_PASSAGES,
  getPassagesByGradeGroup,
} from '@/data/passages';
import {
  SEED_QUESTIONS,
  getQuestionsByPassageId,
  getGrammarQuestions,
} from '@/data/questions';
import { CURRICULUM_STANDARDS } from '@/data/curriculum';
import { generateDailyQuiz } from '@/lib/gemini';
import { getTodayDateString, generateSessionId } from '@/lib/utils';

// ---------------------------------------------------------------------------
// In-memory session cache (temporary until persistent storage is added)
// ---------------------------------------------------------------------------

const sessionCache = new Map<string, DailySession>();

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

  // Prefer passages matching exact grade/semester, fall back to grade group
  const preferExact = (type: PassageType): Passage | null => {
    const exactMatch = allPassages.filter(
      (p) => p.type === type && p.grade === grade && p.semester === semester,
    );
    if (exactMatch.length > 0) {
      return pickRandom(exactMatch, 1)[0];
    }
    // Fall back to same grade, any semester
    const gradeMatch = allPassages.filter(
      (p) => p.type === type && p.grade === grade,
    );
    if (gradeMatch.length > 0) {
      return pickRandom(gradeMatch, 1)[0];
    }
    // Fall back to any passage in the grade group
    const groupMatch = allPassages.filter((p) => p.type === type);
    if (groupMatch.length > 0) {
      return pickRandom(groupMatch, 1)[0];
    }
    return null;
  };

  return {
    nonfiction: preferExact('nonfiction'),
    fiction: preferExact('fiction'),
    poetry: preferExact('poetry'),
  };
}

// ---------------------------------------------------------------------------
// Select grammar questions from seed data
// ---------------------------------------------------------------------------

function selectGrammarQuestions(grade: Grade, count: number): Question[] {
  const allGrammar = getGrammarQuestions();
  const gradeGroup = getGradeGroup(grade);

  // Try to find grammar questions matching the grade group by looking at
  // related standards. Grammar standards follow a pattern like 2국04-xx,
  // 4국04-xx, 6국04-xx depending on grade group.
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

  // Fall back: use any grammar questions available
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

  // We need at least one passage to create a session
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

  // Grammar questions
  const grammarQuestions = selectGrammarQuestions(grade, config.grammar);
  const sessionGrammar = grammarQuestions.map(buildSessionQuestion);

  // Calculate total questions
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
): Promise<DailySession> {
  const gradeGroup = getGradeGroup(grade);
  const standards = CURRICULUM_STANDARDS.filter(
    (s) => s.gradeGroup === gradeGroup,
  );

  const existingPassageIds = SEED_PASSAGES.map((p) => p.id);
  const result = await generateDailyQuiz(grade, semester, standards, existingPassageIds);

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
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, grade, semester } = body as {
      userId: string;
      grade: number;
      semester: number;
    };

    // Input validation
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'userId는 필수 항목입니다.' },
        { status: 400 },
      );
    }

    if (!grade || grade < 1 || grade > 6) {
      return NextResponse.json(
        { success: false, error: '학년은 1~6 사이여야 합니다.' },
        { status: 400 },
      );
    }

    if (!semester || (semester !== 1 && semester !== 2)) {
      return NextResponse.json(
        { success: false, error: '학기는 1 또는 2여야 합니다.' },
        { status: 400 },
      );
    }

    const validGrade = grade as Grade;
    const validSemester = semester as Semester;
    const today = getTodayDateString();

    // Check for existing session for this user+date
    const cacheKey = `${userId}_${today}`;
    const existingSession = sessionCache.get(cacheKey);
    if (existingSession) {
      return NextResponse.json({
        success: true,
        session: existingSession,
      });
    }

    // Try to build session from seed data first
    let session = buildSessionFromSeed(userId, validGrade, validSemester, today);

    // If seed data is insufficient, fall back to Gemini AI generation
    if (!session || session.totalQuestions === 0) {
      try {
        session = await buildSessionFromGemini(
          userId,
          validGrade,
          validSemester,
          today,
        );
      } catch (geminiError) {
        console.error('Gemini 생성 실패:', geminiError);

        // If Gemini also fails, try building from whatever seed data we have
        // even if it doesn't match perfectly
        session = buildSessionFromSeed(userId, validGrade, validSemester, today);

        if (!session) {
          return NextResponse.json(
            {
              success: false,
              error: '오늘의 학습을 생성할 수 없습니다. 잠시 후 다시 시도해 주세요.',
            },
            { status: 500 },
          );
        }
      }
    }

    // Cache the session
    sessionCache.set(cacheKey, session);

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('일일 학습 생성 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      },
      { status: 500 },
    );
  }
}
