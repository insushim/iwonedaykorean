// =============================================================================
// HaruKorean - Socratic Guide API (소크라테스식 질문 유도)
// =============================================================================
// 오답 시 답을 바로 주지 않고, 질문으로 스스로 생각하게 유도

import type { Grade } from "@/types";
import { generateSocraticGuide } from "@/lib/gemini";

function getDefaultGuide(grade: number): string {
  if (grade <= 2)
    return "음, 잠깐! 지문을 다시 한번 천천히 읽어볼까? 답이 숨어 있을지도 몰라!";
  if (grade <= 4)
    return "한 번 더 생각해 볼까? 지문에서 이 문제와 관련된 부분을 찾아보면 힌트를 얻을 수 있을 거야.";
  return "왜 그 답을 골랐는지 생각해 보자. 지문의 핵심 내용과 비교해 보면 다른 답이 보일 수도 있어.";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, studentAnswer, passageContent, grade } = body as {
      question: string;
      studentAnswer: string;
      passageContent?: string;
      grade: number;
    };

    if (!question || !studentAnswer) {
      return Response.json(
        { success: false, error: "question과 studentAnswer는 필수입니다." },
        { status: 400 },
      );
    }

    if (!grade || grade < 1 || grade > 6) {
      return Response.json(
        { success: false, error: "grade는 1~6 사이여야 합니다." },
        { status: 400 },
      );
    }

    let guide: string;

    try {
      guide = await generateSocraticGuide(
        question,
        studentAnswer,
        passageContent || null,
        grade as Grade,
      );
    } catch (geminiError) {
      console.error("소크라테스 가이드 생성 실패:", geminiError);
      guide = getDefaultGuide(grade);
    }

    return Response.json({ success: true, guide });
  } catch (error) {
    console.error("소크라테스 가이드 오류:", error);
    return Response.json(
      { success: false, error: "가이드 생성 실패" },
      { status: 500 },
    );
  }
}
