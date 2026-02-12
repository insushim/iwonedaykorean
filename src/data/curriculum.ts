// =============================================================================
// HaruKorean (하루국어) - Curriculum Standards Data
// 2015 개정 교육과정 국어과 성취기준
// =============================================================================

import { CurriculumStandard } from '@/types';

export const CURRICULUM_STANDARDS: CurriculumStandard[] = [
  // ===========================================================================
  // 1-2학년군 (Grades 1-2)
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // 1-2학년군 - 읽기 (Reading)
  // ---------------------------------------------------------------------------
  {
    id: '2국02-01',
    gradeGroup: '1-2',
    grade: 1,
    semester: 1,
    domain: 'reading',
    title: '글자, 낱말, 문장을 소리 내어 읽기',
    description:
      '글자, 낱말, 문장을 정확하게 소리 내어 읽는다.',
    keywords: ['글자', '낱말', '문장', '소리 내어 읽기', '음독'],
    difficulty: 'easy',
  },
  {
    id: '2국02-02',
    gradeGroup: '1-2',
    grade: 1,
    semester: 1,
    domain: 'reading',
    title: '문장과 글의 의미 파악하기',
    description:
      '문장과 글을 읽고 의미를 파악한다.',
    keywords: ['문장', '글', '의미 파악', '독해'],
    difficulty: 'easy',
  },
  {
    id: '2국02-03',
    gradeGroup: '1-2',
    grade: 1,
    semester: 2,
    domain: 'reading',
    title: '주변 소재 글 읽기',
    description:
      '글을 읽고 주요 내용을 확인한다.',
    keywords: ['주요 내용', '확인', '내용 파악'],
    difficulty: 'easy',
  },
  {
    id: '2국02-04',
    gradeGroup: '1-2',
    grade: 2,
    semester: 1,
    domain: 'reading',
    title: '글의 인물, 사건, 배경 파악하기',
    description:
      '글을 읽고 인물의 처지와 마음을 짐작한다.',
    keywords: ['인물', '처지', '마음', '짐작', '공감'],
    difficulty: 'easy',
  },
  {
    id: '2국02-05',
    gradeGroup: '1-2',
    grade: 2,
    semester: 2,
    domain: 'reading',
    title: '읽기에 흥미 갖기',
    description:
      '읽기에 흥미를 가지고 즐겨 읽는 태도를 기른다.',
    keywords: ['읽기 흥미', '즐겨 읽기', '읽기 태도', '독서 습관'],
    difficulty: 'easy',
  },

  // ---------------------------------------------------------------------------
  // 1-2학년군 - 문학 (Literature)
  // ---------------------------------------------------------------------------
  {
    id: '2국05-01',
    gradeGroup: '1-2',
    grade: 1,
    semester: 1,
    domain: 'literature',
    title: '느낌과 분위기 살려 작품 읽기',
    description:
      '느낌과 분위기를 살려 그림책, 시나 노래, 짧은 이야기를 들려주거나 듣는다.',
    keywords: ['느낌', '분위기', '그림책', '시', '노래', '이야기'],
    difficulty: 'easy',
  },
  {
    id: '2국05-02',
    gradeGroup: '1-2',
    grade: 1,
    semester: 2,
    domain: 'literature',
    title: '인물의 모습과 행동 상상하기',
    description:
      '인물의 모습, 행동, 마음을 상상하며 그림책, 시나 노래, 이야기를 감상한다.',
    keywords: ['인물', '모습', '행동', '마음', '상상', '감상'],
    difficulty: 'easy',
  },
  {
    id: '2국05-03',
    gradeGroup: '1-2',
    grade: 2,
    semester: 1,
    domain: 'literature',
    title: '자신의 생각과 느낌 표현하기',
    description:
      '여러 가지 말놀이를 통해 말의 재미를 느낀다.',
    keywords: ['말놀이', '말의 재미', '언어유희', '표현'],
    difficulty: 'easy',
  },
  {
    id: '2국05-04',
    gradeGroup: '1-2',
    grade: 2,
    semester: 2,
    domain: 'literature',
    title: '작품을 듣거나 읽고 느낌 나누기',
    description:
      '자신의 생각이나 겪은 일을 시나 노래, 이야기 등으로 표현한다.',
    keywords: ['생각 표현', '겪은 일', '시', '노래', '이야기', '표현'],
    difficulty: 'easy',
  },

  // ---------------------------------------------------------------------------
  // 1-2학년군 - 문법 (Grammar)
  // ---------------------------------------------------------------------------
  {
    id: '2국04-01',
    gradeGroup: '1-2',
    grade: 1,
    semester: 1,
    domain: 'grammar',
    title: '한글 자모의 이름과 소릿값 알기',
    description:
      '한글 자모의 이름과 소릿값을 알고 정확하게 발음하고 쓴다.',
    keywords: ['한글', '자모', '이름', '소릿값', '발음', '쓰기'],
    difficulty: 'easy',
  },
  {
    id: '2국04-02',
    gradeGroup: '1-2',
    grade: 1,
    semester: 2,
    domain: 'grammar',
    title: '소리와 표기가 다를 수 있음 알기',
    description:
      '소리와 표기가 다를 수 있음을 알고 낱말을 바르게 읽고 쓴다.',
    keywords: ['소리', '표기', '바르게 읽기', '바르게 쓰기', '맞춤법'],
    difficulty: 'easy',
  },
  {
    id: '2국04-03',
    gradeGroup: '1-2',
    grade: 2,
    semester: 1,
    domain: 'grammar',
    title: '문장 부호의 이름과 쓰임 알기',
    description:
      '문장에 따라 알맞은 문장 부호를 사용한다.',
    keywords: ['문장 부호', '마침표', '물음표', '느낌표', '쉼표'],
    difficulty: 'easy',
  },
  {
    id: '2국04-04',
    gradeGroup: '1-2',
    grade: 2,
    semester: 2,
    domain: 'grammar',
    title: '높임말을 바르게 사용하기',
    description:
      '높임법과 언어 예절에 맞게 대화한다.',
    keywords: ['높임법', '높임말', '언어 예절', '존댓말', '반말'],
    difficulty: 'easy',
  },

  // ===========================================================================
  // 3-4학년군 (Grades 3-4)
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // 3-4학년군 - 읽기 (Reading)
  // ---------------------------------------------------------------------------
  {
    id: '4국02-01',
    gradeGroup: '3-4',
    grade: 3,
    semester: 1,
    domain: 'reading',
    title: '문단과 글의 중심 생각 파악하기',
    description:
      '문단과 글의 중심 생각을 파악한다.',
    keywords: ['문단', '중심 생각', '중심 문장', '뒷받침 문장'],
    difficulty: 'medium',
  },
  {
    id: '4국02-02',
    gradeGroup: '3-4',
    grade: 3,
    semester: 1,
    domain: 'reading',
    title: '글의 유형 구별하기',
    description:
      '글의 유형을 구별하고 대강의 내용을 간추린다.',
    keywords: ['글의 유형', '설명문', '논설문', '내용 간추리기'],
    difficulty: 'medium',
  },
  {
    id: '4국02-03',
    gradeGroup: '3-4',
    grade: 3,
    semester: 2,
    domain: 'reading',
    title: '글의 의미 파악하며 읽기',
    description:
      '글에서 낱말의 의미나 생략된 내용을 짐작한다.',
    keywords: ['낱말 의미', '생략된 내용', '짐작', '추론'],
    difficulty: 'medium',
  },
  {
    id: '4국02-04',
    gradeGroup: '3-4',
    grade: 4,
    semester: 1,
    domain: 'reading',
    title: '사실과 의견 구별하기',
    description:
      '글을 읽고 사실과 의견을 구별한다.',
    keywords: ['사실', '의견', '구별', '비판적 읽기'],
    difficulty: 'medium',
  },
  {
    id: '4국02-05',
    gradeGroup: '3-4',
    grade: 4,
    semester: 2,
    domain: 'reading',
    title: '읽기 경험 나누기',
    description:
      '읽기 경험과 느낌을 다른 사람과 나누는 태도를 지닌다.',
    keywords: ['읽기 경험', '느낌 나누기', '독서 토론', '독서 태도'],
    difficulty: 'medium',
  },

  // ---------------------------------------------------------------------------
  // 3-4학년군 - 문학 (Literature)
  // ---------------------------------------------------------------------------
  {
    id: '4국05-01',
    gradeGroup: '3-4',
    grade: 3,
    semester: 1,
    domain: 'literature',
    title: '감각적 표현에 주목하며 작품 감상하기',
    description:
      '감각적 표현에 주목하며 작품을 감상한다.',
    keywords: ['감각적 표현', '시각', '청각', '촉각', '비유', '감상'],
    difficulty: 'medium',
  },
  {
    id: '4국05-02',
    gradeGroup: '3-4',
    grade: 3,
    semester: 2,
    domain: 'literature',
    title: '인물, 사건, 배경에 주목하며 작품 감상하기',
    description:
      '인물, 사건, 배경에 주목하며 작품을 이해한다.',
    keywords: ['인물', '사건', '배경', '이야기 구조', '서사'],
    difficulty: 'medium',
  },
  {
    id: '4국05-03',
    gradeGroup: '3-4',
    grade: 4,
    semester: 1,
    domain: 'literature',
    title: '이어질 내용 상상하기',
    description:
      '이야기의 흐름을 파악하여 이어질 내용을 상상하고 표현한다.',
    keywords: ['이야기 흐름', '이어질 내용', '상상', '창작', '표현'],
    difficulty: 'medium',
  },
  {
    id: '4국05-04',
    gradeGroup: '3-4',
    grade: 4,
    semester: 2,
    domain: 'literature',
    title: '작품에 대한 생각과 느낌 표현하기',
    description:
      '작품을 듣거나 읽거나 보고 떠오르는 느낌과 생각을 다양하게 표현한다.',
    keywords: ['느낌 표현', '생각 표현', '감상문', '독후 활동'],
    difficulty: 'medium',
  },

  // ---------------------------------------------------------------------------
  // 3-4학년군 - 문법 (Grammar)
  // ---------------------------------------------------------------------------
  {
    id: '4국04-01',
    gradeGroup: '3-4',
    grade: 3,
    semester: 1,
    domain: 'grammar',
    title: '낱말을 분류하고 국어사전 활용하기',
    description:
      '낱말을 분류하고 국어사전에서 찾는다.',
    keywords: ['낱말 분류', '국어사전', '사전 찾기', '뜻풀이'],
    difficulty: 'medium',
  },
  {
    id: '4국04-02',
    gradeGroup: '3-4',
    grade: 3,
    semester: 2,
    domain: 'grammar',
    title: '기본적인 문장 성분 이해하기',
    description:
      '기본적인 문장의 짜임을 이해하고 사용한다.',
    keywords: ['문장 성분', '주어', '서술어', '목적어', '문장 짜임'],
    difficulty: 'medium',
  },
  {
    id: '4국04-03',
    gradeGroup: '3-4',
    grade: 4,
    semester: 1,
    domain: 'grammar',
    title: '높임 표현과 시간 표현 이해하기',
    description:
      '높임법과 시간 표현을 이해하고 사용한다.',
    keywords: ['높임법', '시간 표현', '과거', '현재', '미래', '높임 표현'],
    difficulty: 'medium',
  },
  {
    id: '4국04-04',
    gradeGroup: '3-4',
    grade: 4,
    semester: 2,
    domain: 'grammar',
    title: '한글의 기본 원리 이해하기',
    description:
      '한글을 소중히 여기는 태도를 지닌다.',
    keywords: ['한글', '한글 창제', '세종대왕', '한글 사랑', '한글날'],
    difficulty: 'medium',
  },

  // ===========================================================================
  // 5-6학년군 (Grades 5-6)
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // 5-6학년군 - 읽기 (Reading)
  // ---------------------------------------------------------------------------
  {
    id: '6국02-01',
    gradeGroup: '5-6',
    grade: 5,
    semester: 1,
    domain: 'reading',
    title: '내용을 추론하며 글 읽기',
    description:
      '읽기는 배경지식을 활용하여 의미를 구성하는 과정임을 이해하고 글을 읽는다.',
    keywords: ['배경지식', '의미 구성', '추론', '독해 과정'],
    difficulty: 'hard',
  },
  {
    id: '6국02-02',
    gradeGroup: '5-6',
    grade: 5,
    semester: 1,
    domain: 'reading',
    title: '글의 구조와 내용 파악하기',
    description:
      '글의 구조를 고려하여 글 전체의 내용을 요약한다.',
    keywords: ['글의 구조', '내용 요약', '원인과 결과', '문제와 해결'],
    difficulty: 'hard',
  },
  {
    id: '6국02-03',
    gradeGroup: '5-6',
    grade: 5,
    semester: 2,
    domain: 'reading',
    title: '글의 표현 방법 파악하며 읽기',
    description:
      '글에 사용된 다양한 설명 방법을 파악하며 읽는다.',
    keywords: ['설명 방법', '정의', '예시', '비교', '대조', '분류'],
    difficulty: 'hard',
  },
  {
    id: '6국02-04',
    gradeGroup: '5-6',
    grade: 6,
    semester: 1,
    domain: 'reading',
    title: '글쓴이의 관점이나 의도 파악하기',
    description:
      '글쓴이의 목적을 고려하며 글을 읽는다.',
    keywords: ['글쓴이 목적', '관점', '의도', '비판적 읽기'],
    difficulty: 'hard',
  },
  {
    id: '6국02-05',
    gradeGroup: '5-6',
    grade: 6,
    semester: 2,
    domain: 'reading',
    title: '자신의 읽기 과정 점검하며 읽기',
    description:
      '자신의 읽기 습관을 점검하고 스스로 글을 찾아 읽는 태도를 지닌다.',
    keywords: ['읽기 습관', '점검', '자기 주도적 읽기', '독서 계획'],
    difficulty: 'hard',
  },

  // ---------------------------------------------------------------------------
  // 5-6학년군 - 문학 (Literature)
  // ---------------------------------------------------------------------------
  {
    id: '6국05-01',
    gradeGroup: '5-6',
    grade: 5,
    semester: 1,
    domain: 'literature',
    title: '비유적 표현의 특성과 효과 알기',
    description:
      '문학은 가치 있는 내용을 언어로 표현하여 아름다움을 느끼게 하는 활동임을 이해한다.',
    keywords: ['문학', '가치', '언어 표현', '아름다움', '심미적 체험'],
    difficulty: 'hard',
  },
  {
    id: '6국05-02',
    gradeGroup: '5-6',
    grade: 5,
    semester: 2,
    domain: 'literature',
    title: '작품 속 세계와 현실 세계 비교하기',
    description:
      '작품 속의 세계와 현실 세계를 비교하며 작품을 감상한다.',
    keywords: ['작품 세계', '현실 세계', '비교', '감상', '문학과 삶'],
    difficulty: 'hard',
  },
  {
    id: '6국05-03',
    gradeGroup: '5-6',
    grade: 6,
    semester: 1,
    domain: 'literature',
    title: '비유, 반복 등의 표현 효과 파악하기',
    description:
      '비유적 표현의 특성과 효과를 살려 작품을 읽고 쓴다.',
    keywords: ['비유', '반복', '표현 효과', '은유', '직유', '의인법'],
    difficulty: 'hard',
  },
  {
    id: '6국05-04',
    gradeGroup: '5-6',
    grade: 6,
    semester: 2,
    domain: 'literature',
    title: '작품에 대한 생각을 다양한 방식으로 표현하기',
    description:
      '일상생활의 경험을 이야기나 극의 형식으로 표현한다.',
    keywords: ['일상 경험', '이야기', '극', '표현', '창작', '각색'],
    difficulty: 'hard',
  },

  // ---------------------------------------------------------------------------
  // 5-6학년군 - 문법 (Grammar)
  // ---------------------------------------------------------------------------
  {
    id: '6국04-01',
    gradeGroup: '5-6',
    grade: 5,
    semester: 1,
    domain: 'grammar',
    title: '낱말이 상황에 따라 다양하게 해석됨 알기',
    description:
      '낱말이 상황에 따라 다양하게 해석됨을 탐구한다.',
    keywords: ['다의어', '동음이의어', '문맥', '상황', '의미 해석'],
    difficulty: 'hard',
  },
  {
    id: '6국04-02',
    gradeGroup: '5-6',
    grade: 5,
    semester: 2,
    domain: 'grammar',
    title: '관용 표현의 의미 이해하기',
    description:
      '관용 표현을 이해하고 적절하게 활용한다.',
    keywords: ['관용 표현', '관용구', '속담', '관용어', '비유적 의미'],
    difficulty: 'hard',
  },
  {
    id: '6국04-03',
    gradeGroup: '5-6',
    grade: 6,
    semester: 1,
    domain: 'grammar',
    title: '낱말의 짜임과 새말 형성 이해하기',
    description:
      '낱말의 짜임을 분석하고 새말이 만들어지는 원리를 이해한다.',
    keywords: ['낱말 짜임', '합성어', '파생어', '접사', '어근', '새말'],
    difficulty: 'hard',
  },
  {
    id: '6국04-04',
    gradeGroup: '5-6',
    grade: 6,
    semester: 2,
    domain: 'grammar',
    title: '한글의 우수성 이해하기',
    description:
      '우리말의 발전과 보전에 참여하는 태도를 지닌다.',
    keywords: ['우리말 발전', '우리말 보전', '외래어', '언어 순화', '한글 사랑'],
    difficulty: 'hard',
  },
];

// =============================================================================
// Helper functions
// =============================================================================

export function getStandardsByGradeGroup(gradeGroup: '1-2' | '3-4' | '5-6'): CurriculumStandard[] {
  return CURRICULUM_STANDARDS.filter((s) => s.gradeGroup === gradeGroup);
}

export function getStandardsByDomain(domain: 'reading' | 'literature' | 'grammar'): CurriculumStandard[] {
  return CURRICULUM_STANDARDS.filter((s) => s.domain === domain);
}

export function getStandardsByGradeAndSemester(grade: number, semester: number): CurriculumStandard[] {
  return CURRICULUM_STANDARDS.filter((s) => s.grade === grade && s.semester === semester);
}

export function getStandardById(id: string): CurriculumStandard | undefined {
  return CURRICULUM_STANDARDS.find((s) => s.id === id);
}

export function getStandardsByGradeGroupAndDomain(
  gradeGroup: '1-2' | '3-4' | '5-6',
  domain: 'reading' | 'literature' | 'grammar'
): CurriculumStandard[] {
  return CURRICULUM_STANDARDS.filter(
    (s) => s.gradeGroup === gradeGroup && s.domain === domain
  );
}
