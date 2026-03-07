// =============================================================================
// HaruKorean - 일일 챌린지/미션 시스템
// =============================================================================
// Duolingo/게임 스타일의 일일 미니 미션으로 참여율 향상

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: "accuracy" | "speed" | "streak" | "completion" | "perfect";
  target: number;
  xpReward: number;
  coinReward: number;
}

// 미션 풀 - 매일 3개를 선택하여 제공
const CHALLENGE_POOL: DailyChallenge[] = [
  // 정확도 미션
  {
    id: "CH-ACC-01",
    title: "정답왕",
    description: "오늘 학습에서 정확도 80% 이상 달성하기",
    type: "accuracy",
    target: 80,
    xpReward: 15,
    coinReward: 5,
  },
  {
    id: "CH-ACC-02",
    title: "완벽한 하루",
    description: "모든 문제를 첫 번째 시도에 맞히기",
    type: "perfect",
    target: 100,
    xpReward: 30,
    coinReward: 10,
  },
  {
    id: "CH-ACC-03",
    title: "문법 달인",
    description: "문법 문제 모두 맞히기",
    type: "accuracy",
    target: 100,
    xpReward: 20,
    coinReward: 5,
  },

  // 속도 미션
  {
    id: "CH-SPD-01",
    title: "번개 학습",
    description: "10분 이내에 오늘 학습 완료하기",
    type: "speed",
    target: 600, // seconds
    xpReward: 20,
    coinReward: 5,
  },
  {
    id: "CH-SPD-02",
    title: "집중 모드",
    description: "15분 이내에 오늘 학습 완료하기",
    type: "speed",
    target: 900,
    xpReward: 10,
    coinReward: 3,
  },

  // 완료 미션
  {
    id: "CH-CMP-01",
    title: "오늘의 학습 완료",
    description: "오늘의 일일학습을 끝까지 완료하기",
    type: "completion",
    target: 1,
    xpReward: 10,
    coinReward: 3,
  },
  {
    id: "CH-CMP-02",
    title: "지문 정복",
    description: "모든 지문의 문제를 풀기",
    type: "completion",
    target: 3, // 3 passages
    xpReward: 15,
    coinReward: 5,
  },

  // 스트릭 미션
  {
    id: "CH-STR-01",
    title: "꾸준한 학습자",
    description: "연속 학습 기록을 이어가기",
    type: "streak",
    target: 1,
    xpReward: 10,
    coinReward: 3,
  },
  {
    id: "CH-STR-02",
    title: "일주일 챔피언",
    description: "7일 연속 학습 달성하기",
    type: "streak",
    target: 7,
    xpReward: 50,
    coinReward: 20,
  },
  {
    id: "CH-STR-03",
    title: "3일 연속 도전",
    description: "3일 연속으로 학습 완료하기",
    type: "streak",
    target: 3,
    xpReward: 25,
    coinReward: 8,
  },
];

// ---------------------------------------------------------------------------
// 날짜 기반 3개 미션 선택 (deterministic)
// ---------------------------------------------------------------------------

export function getDailyChallenges(dateStr: string): DailyChallenge[] {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash = hash & hash;
  }
  hash = Math.abs(hash);

  const pool = [...CHALLENGE_POOL];
  const selected: DailyChallenge[] = [];

  // Always include the daily completion mission
  selected.push(pool.find((c) => c.id === "CH-CMP-01")!);

  // Select 2 more from the rest (excluding CH-CMP-01)
  const remaining = pool.filter((c) => c.id !== "CH-CMP-01");
  for (let i = 0; i < 2; i++) {
    const idx = Math.abs(hash + i * 7919) % remaining.length;
    selected.push(remaining[idx]);
    remaining.splice(idx, 1);
  }

  return selected;
}
