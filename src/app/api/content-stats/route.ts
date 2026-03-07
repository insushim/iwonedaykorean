// =============================================================================
// HaruKorean - Content Stats API (admin/debug endpoint)
// =============================================================================

import { getContentStats } from "@/data/content";

export async function GET() {
  try {
    const stats = await getContentStats();

    return Response.json({
      success: true,
      stats,
      summary: {
        totalPassages: stats.totalPassages,
        totalQuestions: stats.totalQuestions,
        totalGrammar: stats.totalGrammar,
        coverageByGrade: Object.entries(stats.byGrade).map(([grade, data]) => ({
          grade: Number(grade),
          passages: data.passages,
          questions: data.questions,
          dailyCoverage: `${Math.floor(data.passages / 3)}일`, // 3 passages per day
        })),
      },
    });
  } catch (error) {
    console.error("콘텐츠 통계 조회 오류:", error);
    return Response.json(
      { success: false, error: "통계 조회 실패" },
      { status: 500 },
    );
  }
}
