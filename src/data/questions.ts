// =============================================================================
// HaruKorean (하루국어) - Seed Question Data
// =============================================================================

import type { Question } from '@/types';

export const SEED_QUESTIONS: Question[] = [
  // ---------------------------------------------------------------------------
  // 비문학: 우리 몸의 뼈 (passage-nf-001)
  // ---------------------------------------------------------------------------
  {
    id: 'q-nf-001-01',
    passageId: 'passage-nf-001',
    questionNumber: 1,
    type: 'multiple_choice',
    question: '이 글에서 설명하는 뼈의 역할로 알맞은 것은 무엇인가요?',
    choices: [
      { number: 1, text: '음식을 소화시키는 역할' },
      { number: 2, text: '우리 몸을 지탱해 주는 역할' },
      { number: 3, text: '체온을 조절하는 역할' },
      { number: 4, text: '소리를 듣는 역할' },
    ],
    correctAnswer: 2,
    explanation: '글의 첫 번째 문단에서 "뼈는 우리 몸을 지탱해 주는 역할을 합니다."라고 설명하고 있습니다.',
    wrongExplanations: {
      1: '음식을 소화시키는 것은 위와 장의 역할입니다. 글에서 뼈는 몸을 지탱한다고 했습니다.',
      3: '체온 조절은 피부와 혈관의 역할입니다. 글에서 뼈의 역할은 지탱이라고 설명합니다.',
      4: '소리를 듣는 것은 귀의 역할입니다. 뼈는 우리 몸을 지탱하는 역할을 합니다.',
    },
    relatedStandard: '4국02-01',
    difficulty: 'medium',
    category: '사실적 이해',
  },
  {
    id: 'q-nf-001-02',
    passageId: 'passage-nf-001',
    questionNumber: 2,
    type: 'multiple_choice',
    question: '뼈를 건강하게 유지하기 위한 방법으로 이 글에서 언급하지 않은 것은?',
    choices: [
      { number: 1, text: '칼슘이 풍부한 음식 먹기' },
      { number: 2, text: '햇볕 쬐기' },
      { number: 3, text: '규칙적인 운동하기' },
      { number: 4, text: '충분한 수면 취하기' },
    ],
    correctAnswer: 4,
    explanation: '글에서는 칼슘이 풍부한 음식, 햇볕, 규칙적인 운동을 뼈 건강 방법으로 언급했습니다. 충분한 수면은 언급되지 않았습니다.',
    wrongExplanations: {
      1: '글의 마지막 문단에서 칼슘이 풍부한 음식을 먹어야 한다고 분명히 언급하고 있습니다.',
      2: '글에서 햇볕을 쬐면 비타민 D가 만들어진다고 설명하고 있습니다.',
      3: '글의 마지막 문장에서 규칙적인 운동도 뼈를 튼튼하게 만든다고 했습니다.',
    },
    relatedStandard: '4국02-01',
    difficulty: 'medium',
    category: '사실적 이해',
  },
  {
    id: 'q-nf-001-03',
    passageId: 'passage-nf-001',
    questionNumber: 3,
    type: 'multiple_choice',
    question: '어린이의 뼈가 어른의 뼈보다 더 많은 이유는 무엇인가요?',
    choices: [
      { number: 1, text: '어린이가 우유를 더 많이 마시기 때문에' },
      { number: 2, text: '여러 개의 뼈가 자라면서 하나로 합쳐지기 때문에' },
      { number: 3, text: '어른이 되면 뼈가 사라지기 때문에' },
      { number: 4, text: '어린이의 몸이 더 작기 때문에' },
    ],
    correctAnswer: 2,
    explanation: '글에서 "여러 개의 뼈가 자라면서 하나로 합쳐지기 때문"이라고 설명하고 있습니다. 어린이의 뼈가 성장하면서 합쳐져 어른은 약 206개가 됩니다.',
    wrongExplanations: {
      1: '우유를 많이 마시는 것과 뼈의 개수는 관련이 없습니다. 글에서는 뼈가 합쳐진다고 설명합니다.',
      3: '뼈가 사라지는 것이 아니라 여러 뼈가 하나로 합쳐지는 것입니다.',
      4: '몸의 크기와 뼈의 개수는 직접적인 관련이 없습니다. 뼈가 합쳐지기 때문입니다.',
    },
    relatedStandard: '4국02-03',
    difficulty: 'medium',
    category: '추론적 이해',
  },

  // ---------------------------------------------------------------------------
  // 비문학: 지구의 자전과 공전 (passage-nf-002)
  // ---------------------------------------------------------------------------
  {
    id: 'q-nf-002-01',
    passageId: 'passage-nf-002',
    questionNumber: 1,
    type: 'multiple_choice',
    question: '낮과 밤이 생기는 원인은 무엇인가요?',
    choices: [
      { number: 1, text: '지구의 공전' },
      { number: 2, text: '지구의 자전' },
      { number: 3, text: '달의 움직임' },
      { number: 4, text: '태양의 자전' },
    ],
    correctAnswer: 2,
    explanation: '글에서 "자전 때문에 낮과 밤이 생깁니다"라고 명확하게 설명하고 있습니다. 지구가 스스로 도는 자전이 낮과 밤의 원인입니다.',
    wrongExplanations: {
      1: '공전은 계절이 바뀌는 원인입니다. 낮과 밤은 자전 때문에 생깁니다.',
      3: '달의 움직임은 조수(밀물과 썰물)에 영향을 줍니다. 낮과 밤은 지구의 자전 때문입니다.',
      4: '태양의 자전은 낮과 밤과 관련이 없습니다. 지구의 자전이 원인입니다.',
    },
    relatedStandard: '4국02-01',
    difficulty: 'medium',
    category: '사실적 이해',
  },
  {
    id: 'q-nf-002-02',
    passageId: 'passage-nf-002',
    questionNumber: 2,
    type: 'multiple_choice',
    question: '이 글의 중심 내용으로 가장 알맞은 것은?',
    choices: [
      { number: 1, text: '태양은 매우 뜨겁다.' },
      { number: 2, text: '지구는 자전과 공전을 하며, 이것이 낮과 밤, 계절 변화의 원인이다.' },
      { number: 3, text: '우주에는 많은 행성이 있다.' },
      { number: 4, text: '지구에서만 생물이 살 수 있다.' },
    ],
    correctAnswer: 2,
    explanation: '이 글은 지구의 두 가지 움직임(자전과 공전)을 설명하고, 각각이 낮과 밤, 계절 변화를 일으킨다는 것이 중심 내용입니다.',
    wrongExplanations: {
      1: '태양의 온도는 이 글에서 다루지 않는 내용입니다.',
      3: '이 글은 다른 행성에 대해서는 설명하지 않고, 지구의 움직임에 초점을 맞추고 있습니다.',
      4: '생물의 존재 여부는 이 글의 주제가 아닙니다.',
    },
    relatedStandard: '4국02-01',
    difficulty: 'medium',
    category: '중심 내용 파악',
  },

  // ---------------------------------------------------------------------------
  // 문학: 토끼와 거북이의 새로운 경주 (passage-fi-001)
  // ---------------------------------------------------------------------------
  {
    id: 'q-fi-001-01',
    passageId: 'passage-fi-001',
    questionNumber: 1,
    type: 'multiple_choice',
    question: '토끼가 물웅덩이 앞에서 멈춘 이유는 무엇인가요?',
    choices: [
      { number: 1, text: '다시 낮잠을 자려고' },
      { number: 2, text: '물웅덩이가 너무 넓어서 뛰어넘을 수 없어서' },
      { number: 3, text: '거북이를 기다리려고' },
      { number: 4, text: '물이 무서워서' },
    ],
    correctAnswer: 2,
    explanation: '글에서 "물웅덩이가 너무 넓어서 뛰어넘을 수가 없었습니다"라고 설명하고 있습니다.',
    wrongExplanations: {
      1: '이번 경주에서 토끼는 절대 쉬지 않겠다고 다짐했습니다. 낮잠을 잔 것은 지난번 이야기입니다.',
      3: '토끼는 경주에서 이기려고 했지, 거북이를 기다리려고 한 것이 아닙니다.',
      4: '물이 무서워서가 아니라, 물웅덩이가 넓어서 건너갈 수 없었기 때문입니다.',
    },
    relatedStandard: '4국05-02',
    difficulty: 'easy',
    category: '사실적 이해',
  },
  {
    id: 'q-fi-001-02',
    passageId: 'passage-fi-001',
    questionNumber: 2,
    type: 'multiple_choice',
    question: '이 이야기가 전하는 교훈으로 가장 알맞은 것은?',
    choices: [
      { number: 1, text: '빨리 달리는 것이 가장 중요하다.' },
      { number: 2, text: '물웅덩이를 조심해야 한다.' },
      { number: 3, text: '모든 것을 잘하는 사람은 없고, 서로 다른 능력이 중요하다.' },
      { number: 4, text: '거북이는 항상 토끼보다 빠르다.' },
    ],
    correctAnswer: 3,
    explanation: '토끼가 마지막에 "모든 것을 잘하는 사람은 없구나. 서로 다른 능력이 중요한 거야."라고 깨달은 것이 이 이야기의 교훈입니다.',
    wrongExplanations: {
      1: '이 이야기는 빨리 달리는 것만이 중요한 것이 아니라, 다양한 능력의 가치를 알려줍니다.',
      2: '물웅덩이를 조심하라는 것은 표면적인 내용이며, 진정한 교훈은 아닙니다.',
      4: '거북이가 항상 빠른 것이 아니라, 상황에 따라 각자의 능력이 빛난다는 것이 요점입니다.',
    },
    relatedStandard: '4국05-03',
    difficulty: 'medium',
    category: '주제 파악',
  },

  // ---------------------------------------------------------------------------
  // 문학: 하늘을 나는 연 (passage-fi-002)
  // ---------------------------------------------------------------------------
  {
    id: 'q-fi-002-01',
    passageId: 'passage-fi-002',
    questionNumber: 1,
    type: 'multiple_choice',
    question: '민수가 처음에 연에 대해 걱정한 이유는 무엇인가요?',
    choices: [
      { number: 1, text: '할아버지가 아프셔서' },
      { number: 2, text: '시장 연에 비해 소박해 보여서' },
      { number: 3, text: '바람이 불지 않아서' },
      { number: 4, text: '연을 만드는 방법을 몰라서' },
    ],
    correctAnswer: 2,
    explanation: '글에서 "시장에서 파는 번쩍번쩍한 연들에 비하면, 할아버지와 만든 연은 소박해 보였기 때문"이라고 설명합니다.',
    wrongExplanations: {
      1: '할아버지가 아프다는 내용은 글에 없습니다. 손이 느리셨지만 정성스럽게 작업하셨습니다.',
      3: '바람은 다음 날 들판에서 불었고, 걱정의 원인은 연의 외형이었습니다.',
      4: '민수는 할아버지와 함께 연을 만들었으므로 방법을 몰랐던 것은 아닙니다.',
    },
    relatedStandard: '4국05-02',
    difficulty: 'easy',
    category: '사실적 이해',
  },
  {
    id: 'q-fi-002-02',
    passageId: 'passage-fi-002',
    questionNumber: 2,
    type: 'multiple_choice',
    question: '"정성을 들인 것은 겉모습과 상관없이 특별하구나"에서 민수가 깨달은 것은?',
    choices: [
      { number: 1, text: '비싼 것이 항상 좋다.' },
      { number: 2, text: '겉모습보다 마음을 담은 것이 더 가치 있다.' },
      { number: 3, text: '연은 항상 높이 날 수 있다.' },
      { number: 4, text: '할아버지는 연 만드는 전문가이다.' },
    ],
    correctAnswer: 2,
    explanation: '민수는 화려한 겉모습이 아니라 할아버지와 함께 정성을 들여 만든 것의 가치를 깨달았습니다.',
    wrongExplanations: {
      1: '이야기의 교훈은 오히려 비싸지 않아도 정성이 담기면 특별하다는 것입니다.',
      3: '모든 연이 높이 나는 것이 아니라, 정성을 들인 연이 특별하다는 의미입니다.',
      4: '할아버지가 전문가라는 것이 아니라 정성의 가치를 이야기하고 있습니다.',
    },
    relatedStandard: '4국05-04',
    difficulty: 'medium',
    category: '주제 파악',
  },

  // ---------------------------------------------------------------------------
  // 시: 봄비 (passage-po-001)
  // ---------------------------------------------------------------------------
  {
    id: 'q-po-001-01',
    passageId: 'passage-po-001',
    questionNumber: 1,
    type: 'multiple_choice',
    question: '이 시에서 봄비를 무엇에 비유하고 있나요?',
    choices: [
      { number: 1, text: '장난감' },
      { number: 2, text: '따뜻한 알람 시계' },
      { number: 3, text: '차가운 얼음' },
      { number: 4, text: '무서운 천둥' },
    ],
    correctAnswer: 2,
    explanation: '시의 마지막 부분에서 "봄비는 세상을 깨우는 따뜻한 알람 시계입니다"라고 비유하고 있습니다.',
    wrongExplanations: {
      1: '시에서 봄비를 장난감에 비유한 부분은 없습니다.',
      3: '봄비는 차가운 것이 아니라 따뜻한 것으로 표현되고 있습니다.',
      4: '이 시에서 천둥은 언급되지 않았습니다. 봄비는 따뜻한 알람 시계에 비유됩니다.',
    },
    relatedStandard: '4국05-01',
    difficulty: 'easy',
    category: '표현 이해',
  },
  {
    id: 'q-po-001-02',
    passageId: 'passage-po-001',
    questionNumber: 2,
    type: 'multiple_choice',
    question: '"잠자던 씨앗이 기지개를 켭니다"에서 사용된 표현 방법은?',
    choices: [
      { number: 1, text: '반복법' },
      { number: 2, text: '의인법 (사람처럼 표현하기)' },
      { number: 3, text: '과장법' },
      { number: 4, text: '열거법' },
    ],
    correctAnswer: 2,
    explanation: '씨앗이 잠을 자거나 기지개를 켜는 것은 사람의 행동입니다. 식물을 사람처럼 표현한 것은 의인법입니다.',
    wrongExplanations: {
      1: '같은 말을 반복한 것이 아니라, 씨앗을 사람처럼 표현한 것입니다.',
      3: '실제보다 크게 부풀려 표현한 것이 아니라, 사람의 행동으로 나타낸 것입니다.',
      4: '여러 가지를 나열한 것이 아니라, 씨앗의 변화를 의인화한 것입니다.',
    },
    relatedStandard: '4국05-01',
    difficulty: 'medium',
    category: '표현 이해',
  },

  // ---------------------------------------------------------------------------
  // 문법 Questions (No passage)
  // ---------------------------------------------------------------------------
  {
    id: 'q-gr-001',
    passageId: '',
    questionNumber: 1,
    type: 'multiple_choice',
    question: '다음 중 높임말로 바르게 고친 것은?',
    choices: [
      { number: 1, text: '"밥 먹어." → "밥 드세요."' },
      { number: 2, text: '"밥 먹어." → "밥 먹으세요."' },
      { number: 3, text: '"밥 먹어." → "밥 잡수세요."' },
      { number: 4, text: '"밥 먹어." → "식사 하세요."' },
    ],
    correctAnswer: 3,
    explanation: '"먹다"의 높임말은 "잡수시다/드시다"입니다. "밥 잡수세요"가 가장 바른 높임 표현입니다. "드세요"도 높임말이지만, "밥"과 함께 쓸 때는 "진지 드세요" 또는 "밥 잡수세요"가 더 자연스럽습니다.',
    wrongExplanations: {
      1: '"드세요"는 높임말이지만, "밥 드세요"보다 "진지 드세요"가 더 자연스러운 표현입니다.',
      2: '"먹으세요"는 "먹다"에 "-으세요"를 붙인 것으로 높임 표현이지만, "먹다"의 올바른 높임말인 "잡수시다"를 사용하는 것이 더 적절합니다.',
      4: '"식사하세요"는 일상에서 많이 쓰이지만, "먹다"의 정확한 높임말은 "잡수시다"입니다.',
    },
    relatedStandard: '2국04-04',
    difficulty: 'medium',
    category: '높임 표현',
  },
  {
    id: 'q-gr-002',
    passageId: '',
    questionNumber: 2,
    type: 'multiple_choice',
    question: '다음 문장에서 주어는 무엇인가요? "예쁜 꽃이 활짝 피었습니다."',
    choices: [
      { number: 1, text: '예쁜' },
      { number: 2, text: '꽃이' },
      { number: 3, text: '활짝' },
      { number: 4, text: '피었습니다' },
    ],
    correctAnswer: 2,
    explanation: '주어는 문장에서 "누가/무엇이"에 해당하는 부분입니다. "꽃이"가 이 문장에서 행동(피었습니다)의 주체이므로 주어입니다.',
    wrongExplanations: {
      1: '"예쁜"은 꽃을 꾸며 주는 말(관형어)입니다. 주어가 아닙니다.',
      3: '"활짝"은 피었습니다를 꾸며 주는 말(부사어)입니다.',
      4: '"피었습니다"는 주어가 하는 행동을 나타내는 서술어입니다.',
    },
    relatedStandard: '4국04-02',
    difficulty: 'easy',
    category: '문장 성분',
  },
  {
    id: 'q-gr-003',
    passageId: '',
    questionNumber: 3,
    type: 'multiple_choice',
    question: '다음 중 맞춤법이 바른 것은?',
    choices: [
      { number: 1, text: '되요' },
      { number: 2, text: '돼요' },
      { number: 3, text: '됴요' },
      { number: 4, text: '뒈요' },
    ],
    correctAnswer: 2,
    explanation: '"되다"에 "-어요"가 붙으면 "되어요"가 되고, 줄여서 쓸 때 "돼요"가 됩니다. "되요"는 잘못된 표기입니다.',
    wrongExplanations: {
      1: '"되요"는 틀린 표기입니다. "되-"에 "-어요"가 붙어 "되어요" → "돼요"가 올바릅니다.',
      3: '"됴요"는 존재하지 않는 표기입니다.',
      4: '"뒈요"는 존재하지 않는 표기입니다.',
    },
    relatedStandard: '2국04-02',
    difficulty: 'easy',
    category: '맞춤법',
  },
  {
    id: 'q-gr-004',
    passageId: '',
    questionNumber: 4,
    type: 'multiple_choice',
    question: '"손이 크다"라는 관용 표현의 뜻은 무엇인가요?',
    choices: [
      { number: 1, text: '손의 크기가 실제로 크다' },
      { number: 2, text: '음식을 한꺼번에 많이 만든다' },
      { number: 3, text: '힘이 매우 세다' },
      { number: 4, text: '손재주가 좋다' },
    ],
    correctAnswer: 2,
    explanation: '"손이 크다"는 음식이나 물건을 준비할 때 양을 많이 하는 것을 뜻하는 관용 표현입니다.',
    wrongExplanations: {
      1: '관용 표현은 글자 그대로의 뜻이 아니라 비유적 의미를 가집니다.',
      3: '힘이 센 것은 "손이 크다"의 의미가 아닙니다.',
      4: '손재주가 좋은 것은 "손재주가 있다" 또는 "손이 야무지다"로 표현합니다.',
    },
    relatedStandard: '6국04-02',
    difficulty: 'medium',
    category: '관용 표현',
  },
];

export function getQuestionsByPassageId(passageId: string): Question[] {
  return SEED_QUESTIONS.filter((q) => q.passageId === passageId);
}

export function getGrammarQuestions(): Question[] {
  return SEED_QUESTIONS.filter((q) => q.passageId === '');
}

export function getQuestionById(id: string): Question | undefined {
  return SEED_QUESTIONS.find((q) => q.id === id);
}
