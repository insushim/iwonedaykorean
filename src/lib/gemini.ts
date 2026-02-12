// =============================================================================
// HaruKorean (하루국어) - Gemini AI Client
// =============================================================================
// Server-side only: uses GEMINI_API_KEY from process.env
// =============================================================================

import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  Grade,
  Semester,
  CurriculumStandard,
  Passage,
  Question,
  GradeGroup,
} from '@/types';

// ---------------------------------------------------------------------------
// Client Initialization
// ---------------------------------------------------------------------------

function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenerativeAI(apiKey);
}

function getModel() {
  const client = getGeminiClient();
  return client.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

// ---------------------------------------------------------------------------
// Word count ranges by grade group
// ---------------------------------------------------------------------------

function getWordCountRange(gradeGroup: GradeGroup): { min: number; max: number } {
  switch (gradeGroup) {
    case '1-2':
      return { min: 150, max: 300 };
    case '3-4':
      return { min: 300, max: 500 };
    case '5-6':
      return { min: 400, max: 700 };
  }
}

function getGradeGroupFromGrade(grade: Grade): GradeGroup {
  if (grade <= 2) return '1-2';
  if (grade <= 4) return '3-4';
  return '5-6';
}

// ---------------------------------------------------------------------------
// Generate Daily Quiz
// ---------------------------------------------------------------------------

export interface GeneratedPassage {
  id: string;
  type: 'nonfiction' | 'fiction' | 'poetry';
  title: string;
  author?: string;
  content: string;
  wordCount: number;
  questions: GeneratedQuestion[];
}

export interface GeneratedQuestion {
  id: string;
  questionNumber: number;
  type: 'multiple_choice';
  question: string;
  choices: { number: number; text: string }[];
  correctAnswer: 1 | 2 | 3 | 4;
  explanation: string;
  wrongExplanations: Record<number, string>;
  relatedStandard: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface GeneratedGrammarQuestion extends GeneratedQuestion {
  domain: 'grammar';
}

export interface DailyQuizResult {
  passages: GeneratedPassage[];
  grammarQuestions: GeneratedGrammarQuestion[];
}

/**
 * Generate a complete daily quiz using Gemini.
 *
 * @param grade - Student's grade (1-6)
 * @param semester - Current semester (1 or 2)
 * @param standards - Relevant curriculum standards to cover
 * @param existingPassageIds - IDs of passages the student has already seen (to avoid repeats)
 */
export async function generateDailyQuiz(
  grade: Grade,
  semester: Semester,
  standards: CurriculumStandard[],
  existingPassageIds: string[] = []
): Promise<DailyQuizResult> {
  const model = getModel();
  const gradeGroup = getGradeGroupFromGrade(grade);
  const wordCountRange = getWordCountRange(gradeGroup);

  const readingStandards = standards.filter((s) => s.domain === 'reading');
  const literatureStandards = standards.filter((s) => s.domain === 'literature');
  const grammarStandards = standards.filter((s) => s.domain === 'grammar');

  const standardsList = standards
    .map((s) => `- [${s.id}] ${s.title}: ${s.description}`)
    .join('\n');

  const prompt = `당신은 초등학교 ${grade}학년 ${semester}학기 국어 교육 전문가입니다.
아래 교육과정 성취기준에 맞는 하루 분량의 국어 학습 퀴즈를 생성해주세요.

## 교육과정 성취기준
${standardsList}

## 생성 규칙

### 지문 (Passages)
1. **비문학 지문 1개**: 설명문 또는 논설문 (읽기 영역)
   - ${wordCountRange.min}~${wordCountRange.max}자 분량
   - ${grade}학년 수준에 적합한 어휘와 문장 구조
   - 관련 성취기준: ${readingStandards.map((s) => s.id).join(', ') || '읽기 관련 성취기준'}

2. **문학 지문 1개**: 동화, 동시, 또는 수필 (문학 영역)
   - ${wordCountRange.min}~${wordCountRange.max}자 분량
   - ${grade}학년 수준에 적합한 문학 작품
   - 관련 성취기준: ${literatureStandards.map((s) => s.id).join(', ') || '문학 관련 성취기준'}

### 문제 (Questions)
1. **각 지문당 3문제** (총 6문제)
   - 사실적 이해 문제 1개
   - 추론적 이해 문제 1개
   - 비판적/창의적 이해 문제 1개

2. **문법 문제 2문제** (지문 없이 독립)
   - 관련 성취기준: ${grammarStandards.map((s) => s.id).join(', ') || '문법 관련 성취기준'}
   - 맞춤법, 띄어쓰기, 문장 성분, 품사 등

### 문제 형식
- 모든 문제는 4지선다 객관식
- 각 문제에는 정답 해설(explanation)과 각 오답에 대한 개별 해설(wrongExplanations) 포함
- 해설은 ${grade}학년 학생이 이해할 수 있는 수준으로 작성
- wrongExplanations는 학생이 해당 오답을 선택했을 때 왜 틀렸는지, 정답이 무엇인지 친절하게 설명

### 난이도 배분
- easy: 30% (기본 이해)
- medium: 50% (응용)
- hard: 20% (심화)

### 카테고리 분류
각 문제는 다음 카테고리 중 하나를 가집니다:
- "사실적 이해" - 지문에서 직접 찾을 수 있는 정보
- "추론적 이해" - 지문 내용을 바탕으로 추론
- "비판적 이해" - 평가, 판단, 의견 형성
- "어휘" - 낱말의 뜻, 유의어, 반의어
- "문법" - 맞춤법, 띄어쓰기, 문장 구조
- "작문" - 글쓰기 관련 지식

${existingPassageIds.length > 0 ? `### 제외할 지문 ID\n다음 ID의 지문과 유사한 주제는 피해주세요:\n${existingPassageIds.join(', ')}` : ''}

## 출력 형식 (반드시 아래 JSON 형식을 따라주세요)

\`\`\`json
{
  "passages": [
    {
      "id": "passage_[타입]_[날짜]_[번호]",
      "type": "nonfiction" | "fiction" | "poetry",
      "title": "지문 제목",
      "content": "지문 전체 내용",
      "wordCount": 숫자,
      "questions": [
        {
          "id": "q_[지문id]_[번호]",
          "questionNumber": 1,
          "type": "multiple_choice",
          "question": "문제 내용",
          "choices": [
            {"number": 1, "text": "선택지 1"},
            {"number": 2, "text": "선택지 2"},
            {"number": 3, "text": "선택지 3"},
            {"number": 4, "text": "선택지 4"}
          ],
          "correctAnswer": 1,
          "explanation": "정답 해설",
          "wrongExplanations": {
            "1": "1번을 선택한 경우의 해설 (정답인 경우 빈 문자열)",
            "2": "2번을 선택한 경우의 해설",
            "3": "3번을 선택한 경우의 해설",
            "4": "4번을 선택한 경우의 해설"
          },
          "relatedStandard": "성취기준 ID",
          "difficulty": "easy" | "medium" | "hard",
          "category": "카테고리명"
        }
      ]
    }
  ],
  "grammarQuestions": [
    {
      "id": "q_grammar_[날짜]_[번호]",
      "questionNumber": 1,
      "type": "multiple_choice",
      "question": "문법 문제 내용",
      "choices": [
        {"number": 1, "text": "선택지 1"},
        {"number": 2, "text": "선택지 2"},
        {"number": 3, "text": "선택지 3"},
        {"number": 4, "text": "선택지 4"}
      ],
      "correctAnswer": 2,
      "explanation": "정답 해설",
      "wrongExplanations": {
        "1": "해설",
        "2": "",
        "3": "해설",
        "4": "해설"
      },
      "relatedStandard": "성취기준 ID",
      "difficulty": "medium",
      "category": "문법",
      "domain": "grammar"
    }
  ]
}
\`\`\`

중요:
- 반드시 유효한 JSON만 출력하세요. 코드블록 마커(\`\`\`json, \`\`\`)는 포함하지 마세요.
- 모든 텍스트는 한국어로 작성하세요.
- wrongExplanations에서 정답 번호에 해당하는 값은 빈 문자열("")로 설정하세요.
- 각 문제의 선택지는 반드시 4개여야 합니다.
- correctAnswer는 1, 2, 3, 4 중 하나의 숫자여야 합니다.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Parse JSON response, stripping any markdown code fences if present
  const jsonText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  const parsed = JSON.parse(jsonText) as DailyQuizResult;

  return parsed;
}

// ---------------------------------------------------------------------------
// Generate Explanation for Wrong Answer
// ---------------------------------------------------------------------------

/**
 * Generate a personalized explanation when a student answers incorrectly.
 *
 * @param question - The question text
 * @param correctAnswer - The correct answer text
 * @param studentAnswer - The student's chosen answer text
 * @param grade - Student's grade level
 */
export async function generateExplanation(
  question: string,
  correctAnswer: string,
  studentAnswer: string,
  grade: Grade
): Promise<string> {
  const model = getModel();

  const prompt = `당신은 초등학교 ${grade}학년 학생을 가르치는 친절한 국어 선생님입니다.

학생이 다음 문제에서 틀린 답을 선택했습니다. 학생이 이해할 수 있도록 친절하고 격려하는 톤으로 설명해주세요.

## 문제
${question}

## 학생의 답
${studentAnswer}

## 정답
${correctAnswer}

## 설명 규칙
1. ${grade}학년 학생이 이해할 수 있는 쉬운 말로 설명하세요.
2. 학생의 답이 왜 틀렸는지 먼저 설명하세요.
3. 정답이 왜 맞는지 설명하세요.
4. 비슷한 문제를 풀 때 도움이 될 팁을 하나 알려주세요.
5. 격려의 말로 마무리하세요.
6. 3~5문장으로 간결하게 작성하세요.
7. 이모지를 적절히 사용해도 좋습니다.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

// ---------------------------------------------------------------------------
// Generate Hint for a Question
// ---------------------------------------------------------------------------

/**
 * Generate a hint for a student who is struggling with a question.
 *
 * @param question - The question text
 * @param passageContent - The related passage content (if any)
 * @param grade - Student's grade level
 */
export async function generateHint(
  question: string,
  passageContent: string | null,
  grade: Grade
): Promise<string> {
  const model = getModel();

  const passageSection = passageContent
    ? `\n## 관련 지문\n${passageContent}\n`
    : '';

  const prompt = `당신은 초등학교 ${grade}학년 학생을 가르치는 국어 선생님입니다.

학생이 아래 문제에서 힌트를 요청했습니다. 답을 직접 알려주지 말고, 학생이 스스로 정답을 찾을 수 있도록 도와주는 힌트를 제공하세요.
${passageSection}
## 문제
${question}

## 힌트 규칙
1. 정답을 직접 알려주지 마세요.
2. 문제를 풀기 위한 사고 방향을 제시하세요.
3. ${grade}학년 수준의 쉬운 말로 작성하세요.
4. 1~2문장으로 간결하게 작성하세요.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}
