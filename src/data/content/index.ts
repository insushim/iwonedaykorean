// =============================================================================
// HaruKorean - Content Index & Daily Rotation System
// =============================================================================
// Combines all content sources and provides deterministic daily selection
// to minimize AI API usage. 600+ passages across 12 grade-semester files.
// =============================================================================

import type { Passage, Question, Grade, Semester, GradeGroup } from "@/types";
import { ALL_PASSAGES } from "@/data/passages";
import { ALL_QUESTIONS, GRAMMAR_QUESTIONS } from "@/data/questions";
import { EXPANDED_GRAMMAR } from "@/data/content/grammar-expanded";

export interface PassageWithQuestions {
  passage: Passage;
  questions: Question[];
}

// ---------------------------------------------------------------------------
// Lazy-loaded content cache (per grade-semester for efficient loading)
// ---------------------------------------------------------------------------

const _cache: Record<string, PassageWithQuestions[]> = {};

async function loadGradeSemester(
  grade: number,
  semester: number,
): Promise<PassageWithQuestions[]> {
  const key = `${grade}-${semester}`;
  if (_cache[key]) return _cache[key];

  let content: PassageWithQuestions[] = [];
  try {
    switch (key) {
      case "1-1": {
        const m = await import("@/data/content/grade1-sem1");
        content = m.GRADE1_SEM1 || [];
        break;
      }
      case "1-2": {
        const m = await import("@/data/content/grade1-sem2");
        content = m.GRADE1_SEM2 || [];
        break;
      }
      case "2-1": {
        const m = await import("@/data/content/grade2-sem1");
        content = m.GRADE2_SEM1 || [];
        break;
      }
      case "2-2": {
        const m = await import("@/data/content/grade2-sem2");
        content = m.GRADE2_SEM2 || [];
        break;
      }
      case "3-1": {
        const m = await import("@/data/content/grade3-sem1");
        content = m.GRADE3_SEM1 || [];
        break;
      }
      case "3-2": {
        const m = await import("@/data/content/grade3-sem2");
        content = m.GRADE3_SEM2 || [];
        break;
      }
      case "4-1": {
        const m = await import("@/data/content/grade4-sem1");
        content = m.GRADE4_SEM1 || [];
        break;
      }
      case "4-2": {
        const m = await import("@/data/content/grade4-sem2");
        content = m.GRADE4_SEM2 || [];
        break;
      }
      case "5-1": {
        const m = await import("@/data/content/grade5-sem1");
        content = m.GRADE5_SEM1 || [];
        break;
      }
      case "5-2": {
        const m = await import("@/data/content/grade5-sem2");
        content = m.GRADE5_SEM2 || [];
        break;
      }
      case "6-1": {
        const m = await import("@/data/content/grade6-sem1");
        content = m.GRADE6_SEM1 || [];
        break;
      }
      case "6-2": {
        const m = await import("@/data/content/grade6-sem2");
        content = m.GRADE6_SEM2 || [];
        break;
      }
    }
  } catch {
    content = [];
  }

  _cache[key] = content;
  return content;
}

// ---------------------------------------------------------------------------
// Load all expanded content
// ---------------------------------------------------------------------------

async function loadExpandedContent(): Promise<PassageWithQuestions[]> {
  const all = await Promise.all([
    loadGradeSemester(1, 1),
    loadGradeSemester(1, 2),
    loadGradeSemester(2, 1),
    loadGradeSemester(2, 2),
    loadGradeSemester(3, 1),
    loadGradeSemester(3, 2),
    loadGradeSemester(4, 1),
    loadGradeSemester(4, 2),
    loadGradeSemester(5, 1),
    loadGradeSemester(5, 2),
    loadGradeSemester(6, 1),
    loadGradeSemester(6, 2),
  ]);
  return all.flat();
}

// ---------------------------------------------------------------------------
// Convert legacy seed data to PassageWithQuestions format
// ---------------------------------------------------------------------------

function getSeedContent(): PassageWithQuestions[] {
  return ALL_PASSAGES.map((passage) => {
    const questions = ALL_QUESTIONS.filter((q) => q.passageId === passage.id);
    return { passage, questions };
  });
}

// ---------------------------------------------------------------------------
// Get all content for a specific grade and semester
// ---------------------------------------------------------------------------

export async function getAllContentForGrade(
  grade: Grade,
  semester: Semester,
): Promise<PassageWithQuestions[]> {
  const expanded = await loadGradeSemester(grade, semester);
  const seed = getSeedContent().filter(
    (item) =>
      item.passage.grade === grade && item.passage.semester === semester,
  );
  return [...seed, ...expanded];
}

export async function getAllContentForGradeGroup(
  gradeGroup: GradeGroup,
): Promise<PassageWithQuestions[]> {
  const grades: Grade[] =
    gradeGroup === "1-2" ? [1, 2] : gradeGroup === "3-4" ? [3, 4] : [5, 6];

  const results = await Promise.all(
    grades.flatMap((g) => [loadGradeSemester(g, 1), loadGradeSemester(g, 2)]),
  );

  const seed = getSeedContent().filter(
    (item) => item.passage.gradeGroup === gradeGroup,
  );

  return [...seed, ...results.flat()];
}

// ---------------------------------------------------------------------------
// Deterministic hash for daily rotation
// ---------------------------------------------------------------------------

function dateHash(dateStr: string, salt: string = ""): number {
  const str = dateStr + salt;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// ---------------------------------------------------------------------------
// Select daily content using deterministic rotation
// ---------------------------------------------------------------------------

export interface DailyContent {
  nonfiction: PassageWithQuestions | null;
  fiction: PassageWithQuestions | null;
  poetry: PassageWithQuestions | null;
  grammarQuestions: Question[];
}

export async function selectDailyContent(
  grade: Grade,
  semester: Semester,
  dateStr: string,
  pastPassageTitles: string[] = [],
  userId: string = "",
): Promise<DailyContent> {
  const gradeGroup = getGradeGroup(grade);

  // Get all content for this grade (prefer exact match, fallback to grade group)
  let allContent = await getAllContentForGrade(grade, semester);

  // If not enough content, expand to full grade group
  if (allContent.length < 3) {
    allContent = await getAllContentForGradeGroup(gradeGroup);
  }

  // Filter content with questions
  const withQuestions = allContent.filter((item) => item.questions.length > 0);

  // Separate by type
  const nonfictionPool = withQuestions.filter(
    (item) => item.passage.type === "nonfiction",
  );
  const fictionPool = withQuestions.filter(
    (item) => item.passage.type === "fiction",
  );
  const poetryPool = withQuestions.filter(
    (item) => item.passage.type === "poetry",
  );

  // Use date hash to select one from each pool
  const selectFromPool = (
    pool: PassageWithQuestions[],
    typeSalt: string,
  ): PassageWithQuestions | null => {
    if (pool.length === 0) return null;

    // First try to avoid recently used passages
    const unused = pool.filter(
      (item) => !pastPassageTitles.includes(item.passage.title),
    );
    const targetPool = unused.length > 0 ? unused : pool;

    const typeHash = dateHash(
      dateStr,
      `${grade}-${semester}-${typeSalt}-${userId}`,
    );
    const index = typeHash % targetPool.length;
    return targetPool[index];
  };

  const nonfiction = selectFromPool(nonfictionPool, "nf");
  const fiction = selectFromPool(fictionPool, "fi");
  const poetry = selectFromPool(poetryPool, "po");

  // Select grammar questions
  const grammarQuestions = selectDailyGrammar(grade, semester, dateStr, 2);

  return { nonfiction, fiction, poetry, grammarQuestions };
}

// ---------------------------------------------------------------------------
// Select grammar questions with rotation
// ---------------------------------------------------------------------------

function selectDailyGrammar(
  grade: Grade,
  semester: Semester,
  dateStr: string,
  count: number,
): Question[] {
  // Combine original + expanded grammar questions
  const allGrammar = [...GRAMMAR_QUESTIONS, ...EXPANDED_GRAMMAR];

  const gradeGroup = getGradeGroup(grade);
  const gradeGroupPrefix =
    gradeGroup === "1-2" ? "2국04" : gradeGroup === "3-4" ? "4국04" : "6국04";

  // Filter by grade-semester first, then grade group
  const gradePrefix = `G-${grade}-${semester}`;
  let pool = allGrammar.filter((q) => q.id.startsWith(gradePrefix));

  if (pool.length < count) {
    // Fallback to grade group
    pool = allGrammar.filter((q) =>
      q.relatedStandard.startsWith(gradeGroupPrefix),
    );
  }

  if (pool.length < count) {
    pool = allGrammar;
  }

  // Deterministic selection
  const selected: Question[] = [];
  const poolCopy = [...pool];

  for (let i = 0; i < Math.min(count, poolCopy.length); i++) {
    const idx =
      dateHash(dateStr, `grammar-${grade}-${semester}-${i}`) % poolCopy.length;
    selected.push(poolCopy[idx]);
    poolCopy.splice(idx, 1);
  }

  return selected;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getGradeGroup(grade: Grade): GradeGroup {
  if (grade <= 2) return "1-2";
  if (grade <= 4) return "3-4";
  return "5-6";
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export async function getContentStats(): Promise<{
  totalPassages: number;
  totalQuestions: number;
  totalGrammar: number;
  byGrade: Record<number, { passages: number; questions: number }>;
}> {
  const expanded = await loadExpandedContent();
  const seed = getSeedContent();
  const all = [...seed, ...expanded];
  const allGrammar = [...GRAMMAR_QUESTIONS, ...EXPANDED_GRAMMAR];

  const byGrade: Record<number, { passages: number; questions: number }> = {};
  for (let g = 1; g <= 6; g++) {
    const gradeContent = all.filter((item) => item.passage.grade === g);
    byGrade[g] = {
      passages: gradeContent.length,
      questions: gradeContent.reduce(
        (sum, item) => sum + item.questions.length,
        0,
      ),
    };
  }

  return {
    totalPassages: all.length,
    totalQuestions: all.reduce((sum, item) => sum + item.questions.length, 0),
    totalGrammar: allGrammar.length,
    byGrade,
  };
}
