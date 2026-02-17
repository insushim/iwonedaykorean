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
  return client.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
}

// ---------------------------------------------------------------------------
// Word count ranges by grade group
// ---------------------------------------------------------------------------

function getWordCountRangeByGrade(grade: Grade): { min: number; max: number } {
  switch (grade) {
    case 1: return { min: 80, max: 150 };
    case 2: return { min: 120, max: 200 };
    case 3: return { min: 200, max: 350 };
    case 4: return { min: 300, max: 500 };
    case 5: return { min: 500, max: 800 };
    case 6: return { min: 700, max: 1100 };
  }
}

function getGradeGroupFromGrade(grade: Grade): GradeGroup {
  if (grade <= 2) return '1-2';
  if (grade <= 4) return '3-4';
  return '5-6';
}

function getGradeGuide(grade: Grade): string {
  switch (grade) {
    case 1:
      return `### 1학년 수준 가이드
- **주제**: 가족, 학교생활, 동물, 계절, 일상 경험 (구체적이고 친숙한 소재)
- **비문학 교과 연계 주제풀**: 동물의 생김새와 특징(통합과학), 계절의 변화(봄·여름·가을·겨울), 건강한 생활습관(손씻기, 양치), 가족의 역할, 학교에서 지켜야 할 약속, 여러 가지 탈것, 식물 기르기
- **어휘**: 기본 생활 어휘 중심, 한자어 거의 없음, 의성어·의태어 적극 활용
- **문장**: 단문 위주 (주어+서술어), 1~2개 접속사 사용, "~해요" 체
- **문학**: 짧은 동화, 반복 구조, 의인화된 동물 캐릭터, 읽으면서 기본 생활 태도나 자연의 아름다움을 느끼게 하는 이야기`;
    case 2:
      return `### 2학년 수준 가이드
- **주제**: 자연 관찰, 이웃, 감정 표현, 규칙과 약속
- **비문학 교과 연계 주제풀**: 곤충의 한살이(과학), 동물의 겨울나기, 우리 동네 사람들(사회), 교통안전과 생활안전, 분리수거와 환경보호, 다양한 직업, 물의 쓰임, 식물의 자람, 계절 음식과 영양
- **어휘**: 기초 어휘 + 간단한 과학·사회 용어, 한자어 5% 이하
- **문장**: 단문 위주 + 간단한 복문(~고, ~면), "~해요/~이에요" 체
- **문학**: 동화(기승전결), 짧은 동시, 나눔·배려·정직 같은 교훈이 자연스럽게 녹아 있는 이야기`;
    case 3:
      return `### 3학년 수준 가이드
- **주제**: 과학 원리, 지역사회, 전래동화, 우정
- **비문학 교과 연계 주제풀**: 물의 순환과 상태 변화(과학), 자석의 성질, 지도 읽기와 우리 고장(사회), 동식물의 생활, 소리의 성질, 교통수단의 발달, 옛날과 오늘날의 생활 모습, 건강한 식생활, 전통 놀이
- **어휘**: 교과서 핵심 어휘, 한자어 10~15%, 비유적 표현 도입
- **문장**: 단문+복문 혼합, 인과관계 접속사(~때문에, ~므로), "~합니다/~해요" 혼용
- **문학**: 전래동화, 판타지 동화, 우정·용기·정직 등의 가치를 탐구하는 이야기`;
    case 4:
      return `### 4학년 수준 가이드
- **주제**: 역사 입문, 자연재해, 문화, 환경
- **비문학 교과 연계 주제풀**: 화산과 지진(과학), 식물의 구조, 세종대왕과 한글(사회), 우리나라 전통 명절과 문화유산, 물의 여행과 정화, 거울과 그림자(빛의 성질), 촌락과 도시의 생활, 경제활동과 화폐, 재활용과 자원 절약, 별자리와 달의 변화
- **어휘**: 교과 전문 용어 도입, 한자어 15~20%, 관용 표현 사용
- **문장**: 복문 비율 증가, 수식어 활용, 문단 구조(도입-전개-마무리)
- **문학**: 창작동화, 서사시, 인물의 갈등과 성장을 통해 책임감·배려·끈기 같은 덕목을 탐구하는 이야기`;
    case 5:
      return `### 5학년 수준 가이드
- **주제**: 과학기술, 사회 문제, 역사, 경제 기초
- **비문학 교과 연계 주제풀**: 태양계와 별(과학), 생태계와 먹이사슬, 날씨와 기후(기후변화), 인공지능과 미래기술, 조선의 건국과 발전(사회), 인권과 평등, 경제성장과 무역, 영양소와 건강한 식단(실과), 미생물의 세계, 에너지의 종류와 전환, 우리나라의 자연환경(산맥·하천·기후), 세계 여러 나라의 문화
- **어휘**: 추상적 개념어, 한자어 20~30%, 전문 용어 사용 후 설명 병행
- **문장**: 겹문장(~뿐만 아니라, ~에도 불구하고), 논리적 전개, 근거-주장 구조
- **문학**: 성장소설, 사회적 메시지가 있는 동화, 실패·도전·자아 발견 등 깊은 주제를 다루는 이야기`;
    case 6:
      return `### 6학년 수준 가이드
- **주제**: 민주주의, 인권, 우주과학, 철학적 질문, 미래 사회
- **비문학 교과 연계 주제풀**: 우주 탐사의 역사와 미래(과학), 전기와 자기, 산과 염기, 민주주의와 시민의 권리(사회), 한국 근현대사(일제강점기~민주화), 세계화와 국제기구, 지속가능한 발전과 환경윤리, 인체의 구조와 건강, 프로그래밍과 디지털 리터러시(실과), 생명윤리, 문화유산의 보존, 다문화 사회, 미디어 리터러시
- **어휘**: 고급 한자어 30% 이상, 학술적 표현, 비유·상징·풍자
- **문장**: 다층 복문, 피동/사동 표현, 논설문 구조(서론-본론-결론), 다양한 문체
- **문학**: 단편소설 스타일, 열린 결말, 편견·정의·성장·이별 등 다층적 주제를 통해 사고력과 공감 능력을 키우는 이야기`;
  }
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
 * @param pastPassageTitles - Titles of passages the student has already seen (to avoid repeats)
 */
export async function generateDailyQuiz(
  grade: Grade,
  semester: Semester,
  standards: CurriculumStandard[],
  pastPassageTitles: string[] = []
): Promise<DailyQuizResult> {
  const model = getModel();
  const gradeGroup = getGradeGroupFromGrade(grade);
  const wordCountRange = getWordCountRangeByGrade(grade);
  const gradeGuide = getGradeGuide(grade);

  const readingStandards = standards.filter((s) => s.domain === 'reading');
  const literatureStandards = standards.filter((s) => s.domain === 'literature');
  const grammarStandards = standards.filter((s) => s.domain === 'grammar');

  const standardsList = standards
    .map((s) => `- [${s.id}] ${s.title}: ${s.description}`)
    .join('\n');

  const prompt = `당신은 대한민국 초등학교 ${grade}학년 ${semester}학기 국어 교과서 집필진 수준의 전문가입니다.
아래 교육과정 성취기준과 학년별 가이드에 **정확히** 맞는 하루 분량의 국어 학습 퀴즈를 생성해주세요.

## 핵심 원칙
- **반드시 ${grade}학년 ${semester}학기 수준**에 맞춰야 합니다. 다른 학년 수준의 콘텐츠는 절대 불가합니다.
- 실제 초등학교 ${grade}학년 국어 교과서의 지문 스타일과 난이도를 참고하세요.
- 지문의 글자 수를 반드시 지켜주세요: **${wordCountRange.min}자 ~ ${wordCountRange.max}자**

## 지문의 교육적 가치 (가장 중요!)
지문은 문제를 풀기 위한 도구가 아니라, **읽기만 해도 학생의 지식과 교양이 넓어지는 양질의 글**이어야 합니다.

### 비문학 지문 원칙
- ${grade}학년이 배우는 **과학, 사회, 역사, 도덕, 실과 등 타 교과와 연계**되는 주제를 선택하세요.
- 학생이 지문을 읽고 나면 "오늘 새로운 사실을 하나 배웠다"고 느낄 수 있어야 합니다.
- **정확한 사실과 최신 정보**를 담으세요. 잘못된 상식이나 오래된 통계를 쓰지 마세요.
- 단순 나열이 아니라 **원인-결과, 비교-대조, 문제-해결** 등 논리적 구조를 갖추세요.
- 예시: 과학 원리, 역사적 사건, 환경 문제, 건강과 영양, 세계 문화, 직업 탐구, 경제 개념 등

### 문학 지문 원칙
- 읽는 것만으로 **공감 능력, 상상력, 도덕적 사고력**이 자라는 이야기를 쓰세요.
- 등장인물의 갈등과 성장 과정에서 학생이 **삶의 교훈이나 가치관**을 자연스럽게 느끼도록 하세요.
- 감동, 유머, 호기심, 반전 등 **읽는 재미**가 있어야 합니다. 지루한 교훈 나열은 금지입니다.
- 예시: 우정의 소중함, 실패에서 배우는 용기, 다름을 인정하는 마음, 자연의 경이로움 등

${gradeGuide}

## 교육과정 성취기준
${standardsList}

## 생성 규칙

### 지문 (Passages)
1. **비문학 지문 1개**: 설명문 또는 논설문 (읽기 영역)
   - **${wordCountRange.min}~${wordCountRange.max}자** 분량 (이 범위를 반드시 준수)
   - ${grade}학년 교과서 수준의 어휘와 문장 구조 사용
   - **위 "비문학 교과 연계 주제풀"에서 주제를 선택**하되, 매번 다른 주제를 골라 학생의 배경지식을 넓혀주세요
   - 읽기만 해도 새로운 지식을 얻을 수 있도록 **구체적인 사실, 수치, 사례**를 포함하세요
   - 관련 성취기준: ${readingStandards.map((s) => s.id).join(', ') || '읽기 관련 성취기준'}

2. **문학 지문 1개**: 동화, 동시, 또는 수필 (문학 영역)
   - **${wordCountRange.min}~${wordCountRange.max}자** 분량 (이 범위를 반드시 준수)
   - ${grade}학년 수준에 적합한 문학 작품
   - **읽는 재미가 있으면서도, 자연스럽게 삶의 지혜나 가치관을 느낄 수 있는 이야기**를 쓰세요
   - 등장인물에게 감정이입할 수 있도록 생생한 묘사와 대화를 활용하세요
   - 관련 성취기준: ${literatureStandards.map((s) => s.id).join(', ') || '문학 관련 성취기준'}

### 문제 (Questions)
1. **각 지문당 3문제** (총 6문제)
   - 사실적 이해 문제 1개
   - 추론적 이해 문제 1개
   - 비판적/창의적 이해 문제 1개

2. **문법 문제 2문제** (지문 없이 독립)
   - 관련 성취기준: ${grammarStandards.map((s) => s.id).join(', ') || '문법 관련 성취기준'}
   - 맞춤법, 띄어쓰기, 문장 성분, 품사 등
   - ${grade}학년 교육과정에서 다루는 문법 내용만 출제

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

${pastPassageTitles.length > 0 ? `### 중복 방지 (매우 중요!)
이 학생이 이전에 학습한 지문 제목 목록입니다. 아래 주제와 **동일하거나 유사한 주제의 지문은 절대 생성하지 마세요.**
반드시 완전히 새로운 주제와 소재를 사용하세요.

이전 지문 제목:
${pastPassageTitles.map((t) => `- "${t}"`).join('\n')}` : ''}

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
