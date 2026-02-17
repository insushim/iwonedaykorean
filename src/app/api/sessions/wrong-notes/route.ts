import { getDB } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import type { WrongAnswerNote, Domain } from '@/types';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDB();

    const rows = await db
      .prepare(
        `SELECT id, date, passages_data, grammar_questions_data
         FROM sessions WHERE user_id = ?
         ORDER BY date DESC LIMIT 30`,
      )
      .bind(user.uid)
      .all<Record<string, unknown>>();

    const wrongNotes: WrongAnswerNote[] = [];

    for (const row of rows.results || []) {
      const sessionId = row.id as string;
      const createdAt = (row.date as string) + 'T00:00:00Z';

      try {
        const passages = JSON.parse((row.passages_data as string) || '[]') as Array<{
          title?: string;
          type?: string;
          questions?: Array<{
            questionId?: string;
            question?: string;
            choices?: Array<{ number: number; text: string }>;
            correctAnswer?: number;
            studentAnswer?: number;
            isCorrect?: boolean;
            explanation?: string;
            wrongExplanations?: Record<number, string>;
          }>;
        }>;

        for (const passage of passages) {
          for (const q of passage.questions || []) {
            if (q.isCorrect === false && q.studentAnswer != null) {
              const domain: Domain =
                passage.type === 'nonfiction' ? 'reading' :
                passage.type === 'fiction' || passage.type === 'poetry' ? 'literature' :
                'grammar';

              const studentAnswerText = q.choices?.find(c => c.number === q.studentAnswer)?.text || String(q.studentAnswer);
              const correctAnswerText = q.choices?.find(c => c.number === q.correctAnswer)?.text || String(q.correctAnswer);

              wrongNotes.push({
                id: `${sessionId}-${q.questionId}`,
                userId: user.uid,
                sessionId,
                questionId: q.questionId || '',
                passageTitle: passage.title || '',
                question: q.question || '',
                correctAnswer: correctAnswerText,
                studentAnswer: studentAnswerText,
                explanation: q.explanation || '',
                wrongExplanation: q.wrongExplanations?.[q.studentAnswer] || '',
                category: domain === 'reading' ? '독해' : domain === 'literature' ? '문학 이해' : '문법',
                domain,
                createdAt,
                reviewed: false,
              });
            }
          }
        }

        const grammarQuestions = JSON.parse((row.grammar_questions_data as string) || '[]') as Array<{
          questionId?: string;
          question?: string;
          choices?: Array<{ number: number; text: string }>;
          correctAnswer?: number;
          studentAnswer?: number;
          isCorrect?: boolean;
          explanation?: string;
          wrongExplanations?: Record<number, string>;
        }>;

        for (const q of grammarQuestions) {
          if (q.isCorrect === false && q.studentAnswer != null) {
            const studentAnswerText = q.choices?.find(c => c.number === q.studentAnswer)?.text || String(q.studentAnswer);
            const correctAnswerText = q.choices?.find(c => c.number === q.correctAnswer)?.text || String(q.correctAnswer);

            wrongNotes.push({
              id: `${sessionId}-${q.questionId}`,
              userId: user.uid,
              sessionId,
              questionId: q.questionId || '',
              question: q.question || '',
              correctAnswer: correctAnswerText,
              studentAnswer: studentAnswerText,
              explanation: q.explanation || '',
              wrongExplanation: q.wrongExplanations?.[q.studentAnswer] || '',
              category: '문법',
              domain: 'grammar',
              createdAt,
              reviewed: false,
            });
          }
        }
      } catch {
        // skip malformed data
      }
    }

    return Response.json({ success: true, wrongNotes });
  } catch (error) {
    console.error('wrong-notes error:', error);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
