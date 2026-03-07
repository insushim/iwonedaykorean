// =============================================================================
// HaruKorean - 오늘의 표현 (관용어/속담/사자성어)
// =============================================================================
// 매일 1개씩 보여주는 표현 카드 데이터

export interface DailyExpression {
  id: string;
  type: "proverb" | "idiom" | "four_char"; // 속담 | 관용어 | 사자성어
  expression: string;
  meaning: string;
  example: string;
  gradeGroup: "1-2" | "3-4" | "5-6";
}

export const DAILY_EXPRESSIONS: DailyExpression[] = [
  // =========================================================================
  // 1-2학년용 (쉬운 속담/관용어)
  // =========================================================================
  {
    id: "EX-12-001",
    type: "proverb",
    expression: "낮말은 새가 듣고 밤말은 쥐가 듣는다",
    meaning: "아무리 비밀스러운 말도 반드시 남에게 들리게 된다는 뜻이에요.",
    example:
      "동생 몰래 이야기했는데 다 들었대. 낮말은 새가 듣고 밤말은 쥐가 듣는다더니!",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-002",
    type: "proverb",
    expression: "세 살 버릇 여든까지 간다",
    meaning: "어릴 때 몸에 밴 습관은 늙어서도 고치기 어렵다는 뜻이에요.",
    example: "밥 먹을 때 바른 자세로 앉자. 세 살 버릇 여든까지 간다잖아.",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-003",
    type: "proverb",
    expression: "원숭이도 나무에서 떨어진다",
    meaning: "아무리 잘하는 사람도 실수할 때가 있다는 뜻이에요.",
    example:
      "수학을 잘하는 민수도 오늘 시험에서 틀렸어. 원숭이도 나무에서 떨어지는 법이지.",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-004",
    type: "proverb",
    expression: "백지장도 맞들면 낫다",
    meaning: "아무리 쉬운 일도 혼자보다 함께하면 더 쉽다는 뜻이에요.",
    example: "교실 청소를 같이 하니까 금방 끝났어. 백지장도 맞들면 낫다더니!",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-005",
    type: "idiom",
    expression: "눈이 높다",
    meaning: "기대하는 수준이나 기준이 높다는 뜻이에요.",
    example: "언니는 눈이 높아서 아무 옷이나 안 입어.",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-006",
    type: "idiom",
    expression: "발이 넓다",
    meaning: "아는 사람이 많고 활동 범위가 넓다는 뜻이에요.",
    example: "우리 아빠는 발이 넓어서 어딜 가든 아는 사람이 있어.",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-007",
    type: "idiom",
    expression: "귀가 얇다",
    meaning: "남의 말을 쉽게 믿는다는 뜻이에요.",
    example: "할머니는 귀가 얇아서 텔레비전 광고를 다 믿으셔.",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-008",
    type: "proverb",
    expression: "콩 심은 데 콩 나고 팥 심은 데 팥 난다",
    meaning: "원인에 따라 결과가 나온다는 뜻이에요.",
    example: "열심히 공부하면 좋은 성적이 나와. 콩 심은 데 콩 나는 법이야.",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-009",
    type: "idiom",
    expression: "입이 짧다",
    meaning: "음식을 가려 먹는다는 뜻이에요.",
    example: "동생은 입이 짧아서 채소를 잘 안 먹어.",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-010",
    type: "proverb",
    expression: "가는 말이 고와야 오는 말이 곱다",
    meaning: "내가 남에게 좋게 말해야 상대도 좋게 말한다는 뜻이에요.",
    example: "친구에게 고운 말을 쓰자. 가는 말이 고와야 오는 말이 곱다잖아.",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-011",
    type: "proverb",
    expression: "티끌 모아 태산",
    meaning: "아주 작은 것도 모으면 큰 것이 된다는 뜻이에요.",
    example: "매일 100원씩 모았더니 벌써 만 원이야! 티끌 모아 태산이네.",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-012",
    type: "idiom",
    expression: "손이 크다",
    meaning: "음식이나 물건을 한꺼번에 많이 만들거나 사는 것을 말해요.",
    example: "할머니는 손이 커서 반찬을 항상 많이 만드셔.",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-013",
    type: "proverb",
    expression: "소 잃고 외양간 고친다",
    meaning: "일이 이미 잘못된 뒤에 뒤늦게 손을 쓴다는 뜻이에요.",
    example: "비가 온 뒤에야 우산을 사다니, 소 잃고 외양간 고치는 격이야.",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-014",
    type: "idiom",
    expression: "배가 아프다",
    meaning: "남이 잘되는 것이 부럽고 시기가 난다는 뜻이에요.",
    example: "친구가 상을 받으니까 배가 아프다고? 축하해 주는 게 맞아.",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-015",
    type: "proverb",
    expression: "꿩 대신 닭",
    meaning: "원하는 것을 구할 수 없을 때 비슷한 것으로 대신한다는 뜻이에요.",
    example: "딸기가 없으니 사과라도 먹자. 꿩 대신 닭이잖아.",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-016",
    type: "idiom",
    expression: "입이 무겁다",
    meaning: "비밀을 잘 지키고 말을 함부로 하지 않는다는 뜻이에요.",
    example: "수진이는 입이 무거워서 비밀을 말해도 괜찮아.",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-017",
    type: "proverb",
    expression: "급할수록 돌아가라",
    meaning: "빨리 하고 싶을수록 차분하게 해야 한다는 뜻이에요.",
    example: "서두르다가 실수했지? 급할수록 돌아가라는 말이 있잖아.",
    gradeGroup: "1-2",
  },
  {
    id: "EX-12-018",
    type: "proverb",
    expression: "아는 길도 물어 가라",
    meaning: "잘 아는 일이라도 조심하고 확인해야 한다는 뜻이에요.",
    example: "자신 있다고 검토 안 하면 안 돼. 아는 길도 물어 가라잖아.",
    gradeGroup: "1-2",
  },

  // =========================================================================
  // 3-4학년용 (속담/관용어/사자성어)
  // =========================================================================
  {
    id: "EX-34-001",
    type: "proverb",
    expression: "우물 안 개구리",
    meaning: "좁은 세계에 갇혀 넓은 세상을 모르는 사람을 말해요.",
    example: "다른 나라 문화도 알아야지. 우물 안 개구리가 되면 안 돼.",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-002",
    type: "four_char",
    expression: "일석이조(一石二鳥)",
    meaning:
      "돌 하나로 새 두 마리를 잡는다는 뜻으로, 한 가지 일로 두 가지 이득을 얻는 것이에요.",
    example: "운동하면서 친구도 사귀니 일석이조야!",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-003",
    type: "idiom",
    expression: "발등에 불이 떨어지다",
    meaning: "매우 급하고 다급한 상황이 닥쳤다는 뜻이에요.",
    example: "숙제 마감이 내일인데 아직 시작도 못 했어. 발등에 불이 떨어졌어!",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-004",
    type: "four_char",
    expression: "유비무환(有備無患)",
    meaning: "미리 준비하면 걱정할 것이 없다는 뜻이에요.",
    example: "소풍 전날 짐을 다 싸두면 마음이 편해. 유비무환이야.",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-005",
    type: "proverb",
    expression: "호랑이도 제 말 하면 온다",
    meaning: "마침 이야기하던 사람이 나타날 때 쓰는 말이에요.",
    example:
      "민수 이야기를 하고 있었는데 딱 나타났네. 호랑이도 제 말 하면 온다더니!",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-006",
    type: "four_char",
    expression: "자업자득(自業自得)",
    meaning: "자기가 저지른 일의 결과를 자기가 받는다는 뜻이에요.",
    example: "거짓말을 해서 친구를 잃었어. 자업자득이야.",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-007",
    type: "idiom",
    expression: "간이 콩알만 해지다",
    meaning: "매우 겁이 나서 무섭다는 뜻이에요.",
    example: "갑자기 정전이 되니까 간이 콩알만 해졌어.",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-008",
    type: "proverb",
    expression: "돌다리도 두들겨 보고 건너라",
    meaning: "아무리 확실한 일이라도 꼼꼼히 확인하라는 뜻이에요.",
    example:
      "답이 맞는 것 같아도 한 번 더 확인하자. 돌다리도 두들겨 보고 건너라잖아.",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-009",
    type: "four_char",
    expression: "동고동락(同苦同樂)",
    meaning: "괴로움과 즐거움을 함께 나눈다는 뜻이에요.",
    example: "6년 동안 동고동락한 친구들과 헤어지니 슬프다.",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-010",
    type: "idiom",
    expression: "귀에 못이 박히다",
    meaning: "같은 말을 여러 번 반복해서 듣는다는 뜻이에요.",
    example: "엄마가 공부하라는 말씀을 하도 하셔서 귀에 못이 박혔어.",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-011",
    type: "proverb",
    expression: "하늘이 무너져도 솟아날 구멍이 있다",
    meaning: "아무리 어려운 상황에서도 살아갈 방법은 있다는 뜻이에요.",
    example: "포기하지 마. 하늘이 무너져도 솟아날 구멍이 있다잖아.",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-012",
    type: "four_char",
    expression: "전화위복(轉禍爲福)",
    meaning: "나쁜 일이 도리어 좋은 일이 된다는 뜻이에요.",
    example: "다리를 다쳐서 독서를 많이 했더니 성적이 올랐어. 전화위복이야.",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-013",
    type: "idiom",
    expression: "눈코 뜰 새 없다",
    meaning: "매우 바빠서 잠깐도 쉴 시간이 없다는 뜻이에요.",
    example: "시험 기간이라 눈코 뜰 새 없이 바빠.",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-014",
    type: "proverb",
    expression: "등잔 밑이 어둡다",
    meaning: "가까이에 있는 것을 오히려 알기 어렵다는 뜻이에요.",
    example: "안경을 찾았는데 머리 위에 있었네. 등잔 밑이 어둡다더니!",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-015",
    type: "four_char",
    expression: "이심전심(以心傳心)",
    meaning: "마음에서 마음으로 뜻이 통한다는 뜻이에요.",
    example: "말 안 해도 서로 같은 생각이었어. 이심전심이야!",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-016",
    type: "idiom",
    expression: "시치미를 떼다",
    meaning: "알고 있으면서 모르는 척한다는 뜻이에요.",
    example: "내가 본 것을 아는데 시치미를 떼고 있네.",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-017",
    type: "proverb",
    expression: "고래 싸움에 새우 등 터진다",
    meaning: "강한 사람들이 싸우면 약한 사람이 피해를 본다는 뜻이에요.",
    example:
      "형들이 싸우다가 동생 장난감이 부서졌어. 고래 싸움에 새우 등 터진 거지.",
    gradeGroup: "3-4",
  },
  {
    id: "EX-34-018",
    type: "four_char",
    expression: "대기만성(大器晩成)",
    meaning:
      "큰 그릇은 만드는 데 오래 걸린다는 뜻으로, 큰 인물은 늦게 이루어진다는 말이에요.",
    example: "지금 성적이 안 나온다고 걱정하지 마. 대기만성이라잖아.",
    gradeGroup: "3-4",
  },

  // =========================================================================
  // 5-6학년용 (사자성어/속담/관용어)
  // =========================================================================
  {
    id: "EX-56-001",
    type: "four_char",
    expression: "온고지신(溫故知新)",
    meaning: "옛것을 익히고 그것을 바탕으로 새것을 안다는 뜻이에요.",
    example: "역사를 배우는 이유는 온고지신, 과거에서 미래를 배우기 위해서야.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-002",
    type: "four_char",
    expression: "절차탁마(切磋琢磨)",
    meaning: "학문이나 덕행을 갈고닦으며 끊임없이 노력한다는 뜻이에요.",
    example: "친구들과 절차탁마하며 실력을 키워 나가자.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-003",
    type: "proverb",
    expression: "빈 수레가 요란하다",
    meaning: "실력이 없는 사람일수록 떠들어 댄다는 뜻이에요.",
    example:
      "진짜 실력 있는 사람은 조용히 결과로 보여줘. 빈 수레가 요란한 법이지.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-004",
    type: "four_char",
    expression: "과유불급(過猶不及)",
    meaning: "지나친 것은 모자란 것과 같다는 뜻이에요.",
    example: "공부도 너무 무리하면 안 좋아. 과유불급이야.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-005",
    type: "idiom",
    expression: "뒤통수를 맞다",
    meaning: "믿었던 사람에게 예상치 못한 배신을 당한다는 뜻이에요.",
    example: "가장 친한 친구가 비밀을 퍼뜨려서 뒤통수를 맞은 기분이야.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-006",
    type: "four_char",
    expression: "각골난망(刻骨難忘)",
    meaning: "뼈에 새길 만큼 은혜가 커서 잊기 어렵다는 뜻이에요.",
    example: "선생님의 가르침은 각골난망, 평생 잊지 못할 거예요.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-007",
    type: "proverb",
    expression: "까마귀 날자 배 떨어진다",
    meaning:
      "아무 관계 없이 우연히 동시에 일어난 일인데 관련 있는 것처럼 오해받는다는 뜻이에요.",
    example:
      "내가 교실에 들어갔는데 마침 꽃병이 깨졌어. 까마귀 날자 배 떨어진 격이지.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-008",
    type: "four_char",
    expression: "좌우명(座右銘)",
    meaning: "늘 자리 옆에 두고 자신을 경계하는 글귀라는 뜻이에요.",
    example: "'최선을 다하자'가 나의 좌우명이야.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-009",
    type: "idiom",
    expression: "눈에 넣어도 안 아프다",
    meaning: "매우 귀엽고 사랑스럽다는 뜻이에요.",
    example: "손녀가 너무 예뻐서 눈에 넣어도 안 아프다고 하셨어.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-010",
    type: "four_char",
    expression: "형설지공(螢雪之功)",
    meaning:
      "반딧불과 눈빛으로 공부한다는 뜻으로, 어려운 환경에서도 열심히 공부하는 것을 말해요.",
    example: "어려운 환경에서도 포기하지 않은 것은 형설지공의 정신이야.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-011",
    type: "proverb",
    expression: "사공이 많으면 배가 산으로 간다",
    meaning: "의견이 많으면 일이 제대로 되지 않는다는 뜻이에요.",
    example:
      "모둠 활동에서 다들 리더를 하겠대. 사공이 많으면 배가 산으로 간다니까.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-012",
    type: "four_char",
    expression: "자초지종(自初至終)",
    meaning: "처음부터 끝까지의 과정이라는 뜻이에요.",
    example: "무슨 일이 있었는지 자초지종을 설명해 봐.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-013",
    type: "idiom",
    expression: "팔짱을 끼다",
    meaning: "어떤 일에 참여하지 않고 구경만 한다는 뜻이에요.",
    example: "다들 열심히 하는데 혼자 팔짱 끼고 있으면 안 되지.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-014",
    type: "four_char",
    expression: "역지사지(易地思之)",
    meaning: "상대방의 처지에서 생각해 본다는 뜻이에요.",
    example: "친구의 입장에서 생각해 봐. 역지사지의 마음이 필요해.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-015",
    type: "proverb",
    expression: "작은 고추가 맵다",
    meaning: "겉모습은 작지만 능력이 뛰어나다는 뜻이에요.",
    example: "키는 작지만 달리기에서 1등을 했어. 작은 고추가 매운 법이야.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-016",
    type: "four_char",
    expression: "권선징악(勸善懲惡)",
    meaning: "착한 일을 권하고 악한 일을 징벌한다는 뜻이에요.",
    example: "옛이야기에는 권선징악의 교훈이 담겨 있어.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-017",
    type: "idiom",
    expression: "미역국을 먹다",
    meaning: "시험이나 중요한 일에서 떨어지다(실패하다)는 뜻이에요.",
    example: "이번 반장 선거에서 미역국을 먹었어.",
    gradeGroup: "5-6",
  },
  {
    id: "EX-56-018",
    type: "four_char",
    expression: "불철주야(不撤晝夜)",
    meaning: "밤낮을 가리지 않고 쉬지 않는다는 뜻이에요.",
    example: "대회를 준비하느라 불철주야 연습했어.",
    gradeGroup: "5-6",
  },
];

// ---------------------------------------------------------------------------
// 날짜 기반 오늘의 표현 선택 (deterministic)
// ---------------------------------------------------------------------------

export function getDailyExpression(
  dateStr: string,
  gradeGroup: "1-2" | "3-4" | "5-6",
): DailyExpression {
  const pool = DAILY_EXPRESSIONS.filter((e) => e.gradeGroup === gradeGroup);

  let hash = 0;
  const str = dateStr + gradeGroup;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % pool.length;
  return pool[index];
}
