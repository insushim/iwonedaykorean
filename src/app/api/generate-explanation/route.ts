// =============================================================================
// HaruKorean (하루국어) - Generate AI Explanation API Route
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import type { Grade } from '@/types';
import { generateExplanation } from '@/lib/gemini';

// ---------------------------------------------------------------------------
// Default fallback explanations by grade group
// ---------------------------------------------------------------------------

function getDefaultExplanation(
  question: string,
  correctAnswer: string,
  studentAnswer: string,
  grade: number,
): string {
  const encouragement =
    grade <= 2
      ? '괜찮아요! 한 번 더 생각해 보면 잘 할 수 있어요.'
      : grade <= 4
        ? '틀려도 괜찮아요. 왜 틀렸는지 알면 다음에는 맞힐 수 있어요!'
        : '실수는 배움의 과정이에요. 이번 경험이 실력을 키우는 데 도움이 될 거예요.';

  return (
    `이 문제에서 "${studentAnswer}"를 선택했지만, 정답은 "${correctAnswer}"이에요. ` +
    `문제를 다시 한번 꼼꼼히 읽어 보면 왜 정답이 다른지 이해할 수 있을 거예요. ` +
    encouragement
  );
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, correctAnswer, studentAnswer, grade } = body as {
      question: string;
      correctAnswer: string;
      studentAnswer: string;
      grade: number;
    };

    // Input validation
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { success: false, error: 'question은 필수 항목입니다.' },
        { status: 400 },
      );
    }
    if (!correctAnswer || typeof correctAnswer !== 'string') {
      return NextResponse.json(
        { success: false, error: 'correctAnswer는 필수 항목입니다.' },
        { status: 400 },
      );
    }
    if (!studentAnswer || typeof studentAnswer !== 'string') {
      return NextResponse.json(
        { success: false, error: 'studentAnswer는 필수 항목입니다.' },
        { status: 400 },
      );
    }
    if (!grade || grade < 1 || grade > 6) {
      return NextResponse.json(
        { success: false, error: 'grade는 1~6 사이의 숫자여야 합니다.' },
        { status: 400 },
      );
    }

    const validGrade = grade as Grade;

    let explanation: string;

    try {
      // Attempt to generate explanation via Gemini AI
      explanation = await generateExplanation(
        question,
        correctAnswer,
        studentAnswer,
        validGrade,
      );
    } catch (geminiError) {
      // If Gemini fails, use a default explanation
      console.error('Gemini 설명 생성 실패:', geminiError);
      explanation = getDefaultExplanation(
        question,
        correctAnswer,
        studentAnswer,
        grade,
      );
    }

    return NextResponse.json({
      explanation,
    });
  } catch (error) {
    console.error('설명 생성 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '설명을 생성하는 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}
