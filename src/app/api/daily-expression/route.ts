// =============================================================================
// HaruKorean - 오늘의 표현 API
// =============================================================================

import { getDailyExpression } from "@/data/daily-expressions";
import { getTodayDateString } from "@/lib/utils";
import { getAuthUser } from "@/lib/auth";
import type { GradeGroup } from "@/types";

function getGradeGroup(grade: number): GradeGroup {
  if (grade <= 2) return "1-2";
  if (grade <= 4) return "3-4";
  return "5-6";
}

export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    const grade = authUser?.grade || 3;
    const gradeGroup = getGradeGroup(grade);
    const today = getTodayDateString();
    const expression = getDailyExpression(today, gradeGroup);

    return Response.json({ success: true, expression });
  } catch (error) {
    console.error("오늘의 표현 조회 오류:", error);
    return Response.json(
      { success: false, error: "표현 조회 실패" },
      { status: 500 },
    );
  }
}
