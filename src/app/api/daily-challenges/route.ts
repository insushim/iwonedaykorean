// =============================================================================
// HaruKorean - 일일 챌린지 API
// =============================================================================

import { getDailyChallenges } from "@/data/daily-challenges";
import { getTodayDateString } from "@/lib/utils";

export async function GET() {
  try {
    const today = getTodayDateString();
    const challenges = getDailyChallenges(today);

    return Response.json({ success: true, challenges });
  } catch (error) {
    console.error("일일 챌린지 조회 오류:", error);
    return Response.json(
      { success: false, error: "챌린지 조회 실패" },
      { status: 500 },
    );
  }
}
