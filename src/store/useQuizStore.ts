// =============================================================================
// HaruKorean (하루국어) - Quiz/Learning State Store (Zustand)
// =============================================================================

import { create } from 'zustand';
import type { DailySession, SessionPassage, SessionQuestion } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type QuizPhase =
  | 'idle'           // No active session
  | 'reading'        // Student is reading a passage
  | 'answering'      // Student is answering a question
  | 'feedback'       // Showing answer feedback/explanation
  | 'passage_done'   // All questions for current passage are done
  | 'grammar'        // Answering grammar questions (no passage)
  | 'review'         // Reviewing wrong answers
  | 'completed';     // Session is fully completed

interface QuizState {
  /** The current daily learning session */
  currentSession: DailySession | null;
  /** Current phase of the quiz flow */
  phase: QuizPhase;
  /** Index of the current passage (0-based) */
  currentPassageIndex: number;
  /** Index of the current question within the passage (0-based) */
  currentQuestionIndex: number;
  /** The student's selected answer (1-4) or null if not selected */
  selectedAnswer: number | null;
  /** Whether to show the explanation panel */
  showExplanation: boolean;
  /** Whether the current answer is correct (null if not yet checked) */
  isCorrect: boolean | null;
  /** Number of attempts on the current question */
  currentAttempts: number;
  /** Question IDs that were answered incorrectly on the first try */
  wrongQuestions: string[];
  /** Whether currently in the wrong-answer review phase */
  isReviewMode: boolean;
  /** Index within the wrong questions during review */
  reviewIndex: number;
  /** Timer: seconds elapsed in the current session */
  timeSpent: number;
  /** Whether the timer is running */
  timerActive: boolean;
}

interface QuizActions {
  /** Initialize a new session */
  setSession: (session: DailySession) => void;
  /** Select an answer for the current question */
  selectAnswer: (answer: number) => void;
  /** Check the selected answer against the correct one */
  checkAnswer: () => void;
  /** Move to the next question */
  nextQuestion: () => void;
  /** Move to the next passage */
  nextPassage: () => void;
  /** Move to grammar questions after all passages are done */
  startGrammarQuestions: () => void;
  /** Enter wrong-answer review mode */
  retryWrongQuestions: () => void;
  /** Move to the next wrong question in review mode */
  nextReviewQuestion: () => void;
  /** Reset the entire quiz state */
  resetQuiz: () => void;
  /** Complete the session */
  completeSession: () => void;
  /** Increment the timer by 1 second */
  tick: () => void;
  /** Start/stop the timer */
  setTimerActive: (active: boolean) => void;
  /** Set the phase directly */
  setPhase: (phase: QuizPhase) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getCurrentQuestion(
  session: DailySession,
  passageIndex: number,
  questionIndex: number,
  phase: QuizPhase
): SessionQuestion | null {
  if (phase === 'grammar') {
    return session.grammarQuestions[questionIndex] ?? null;
  }
  const passage = session.passages[passageIndex];
  if (!passage) return null;
  return passage.questions[questionIndex] ?? null;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useQuizStore = create<QuizState & QuizActions>((set, get) => ({
  // State
  currentSession: null,
  phase: 'idle',
  currentPassageIndex: 0,
  currentQuestionIndex: 0,
  selectedAnswer: null,
  showExplanation: false,
  isCorrect: null,
  currentAttempts: 0,
  wrongQuestions: [],
  isReviewMode: false,
  reviewIndex: 0,
  timeSpent: 0,
  timerActive: false,

  // Actions

  setSession: (session) =>
    set({
      currentSession: session,
      phase: 'reading',
      currentPassageIndex: 0,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showExplanation: false,
      isCorrect: null,
      currentAttempts: 0,
      wrongQuestions: [],
      isReviewMode: false,
      reviewIndex: 0,
      timeSpent: 0,
      timerActive: true,
    }),

  selectAnswer: (answer) => {
    const { phase } = get();
    // Only allow selection during answering or grammar phase
    if (phase !== 'answering' && phase !== 'grammar' && phase !== 'review') return;
    set({ selectedAnswer: answer });
  },

  checkAnswer: () => {
    const {
      currentSession,
      currentPassageIndex,
      currentQuestionIndex,
      selectedAnswer,
      phase,
      wrongQuestions,
      currentAttempts,
      isReviewMode,
      reviewIndex,
    } = get();

    if (!currentSession || selectedAnswer === null) return;

    let question: SessionQuestion | null = null;

    if (isReviewMode) {
      // Find the question by ID from wrong questions list
      const questionId = wrongQuestions[reviewIndex];
      // Search in passages
      for (const passage of currentSession.passages) {
        const found = passage.questions.find((q) => q.questionId === questionId);
        if (found) {
          question = found;
          break;
        }
      }
      // Search in grammar questions
      if (!question) {
        question =
          currentSession.grammarQuestions.find((q) => q.questionId === questionId) ??
          null;
      }
    } else {
      question = getCurrentQuestion(
        currentSession,
        currentPassageIndex,
        currentQuestionIndex,
        phase
      );
    }

    if (!question) return;

    const correct = selectedAnswer === question.correctAnswer;
    const newAttempts = currentAttempts + 1;

    // Record the student's answer on the question object
    question.studentAnswer = selectedAnswer;
    question.isCorrect = correct;
    question.attempts = newAttempts;
    question.answeredAt = new Date().toISOString();

    // Track wrong answers (only on first attempt, not in review mode)
    const updatedWrongQuestions = [...wrongQuestions];
    if (!correct && newAttempts === 1 && !isReviewMode) {
      updatedWrongQuestions.push(question.questionId);
    }

    // Update session stats
    const updatedSession = { ...currentSession };
    updatedSession.totalAttempts = (updatedSession.totalAttempts || 0) + 1;
    if (correct && newAttempts === 1) {
      updatedSession.correctOnFirstTry = (updatedSession.correctOnFirstTry || 0) + 1;
    }

    set({
      isCorrect: correct,
      showExplanation: true,
      currentAttempts: newAttempts,
      wrongQuestions: updatedWrongQuestions,
      currentSession: updatedSession,
      phase: 'feedback',
    });
  },

  nextQuestion: () => {
    const {
      currentSession,
      currentPassageIndex,
      currentQuestionIndex,
      phase,
    } = get();

    if (!currentSession) return;

    const currentPassage = currentSession.passages[currentPassageIndex];
    const isGrammarPhase = phase === 'feedback' && get().isReviewMode === false;

    // Determine if we were in grammar questions
    const wasInGrammar =
      currentPassageIndex >= currentSession.passages.length ||
      phase === 'grammar' ||
      (phase === 'feedback' &&
        currentQuestionIndex >= (currentPassage?.questions.length ?? 0));

    if (wasInGrammar || !currentPassage) {
      // Grammar questions: move to next grammar question
      const nextGrammarIndex = currentQuestionIndex + 1;
      if (nextGrammarIndex < currentSession.grammarQuestions.length) {
        set({
          currentQuestionIndex: nextGrammarIndex,
          selectedAnswer: null,
          showExplanation: false,
          isCorrect: null,
          currentAttempts: 0,
          phase: 'grammar',
        });
      } else {
        // All grammar questions done
        const { wrongQuestions } = get();
        if (wrongQuestions.length > 0) {
          set({ phase: 'completed' });
        } else {
          set({ phase: 'completed' });
        }
      }
      return;
    }

    // Passage questions: move to next question in current passage
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < currentPassage.questions.length) {
      set({
        currentQuestionIndex: nextIndex,
        selectedAnswer: null,
        showExplanation: false,
        isCorrect: null,
        currentAttempts: 0,
        phase: 'answering',
      });
    } else {
      // All questions for this passage are done
      set({
        phase: 'passage_done',
        showExplanation: false,
      });
    }
  },

  nextPassage: () => {
    const { currentSession, currentPassageIndex } = get();
    if (!currentSession) return;

    const nextPassageIndex = currentPassageIndex + 1;

    if (nextPassageIndex < currentSession.passages.length) {
      set({
        currentPassageIndex: nextPassageIndex,
        currentQuestionIndex: 0,
        selectedAnswer: null,
        showExplanation: false,
        isCorrect: null,
        currentAttempts: 0,
        phase: 'reading',
      });
    } else {
      // All passages done, move to grammar questions
      if (currentSession.grammarQuestions.length > 0) {
        set({
          currentQuestionIndex: 0,
          selectedAnswer: null,
          showExplanation: false,
          isCorrect: null,
          currentAttempts: 0,
          phase: 'grammar',
        });
      } else {
        set({ phase: 'completed' });
      }
    }
  },

  startGrammarQuestions: () => {
    set({
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showExplanation: false,
      isCorrect: null,
      currentAttempts: 0,
      phase: 'grammar',
    });
  },

  retryWrongQuestions: () => {
    const { wrongQuestions } = get();
    if (wrongQuestions.length === 0) return;

    set({
      isReviewMode: true,
      reviewIndex: 0,
      selectedAnswer: null,
      showExplanation: false,
      isCorrect: null,
      currentAttempts: 0,
      phase: 'review',
    });
  },

  nextReviewQuestion: () => {
    const { wrongQuestions, reviewIndex } = get();
    const nextIndex = reviewIndex + 1;

    if (nextIndex < wrongQuestions.length) {
      set({
        reviewIndex: nextIndex,
        selectedAnswer: null,
        showExplanation: false,
        isCorrect: null,
        currentAttempts: 0,
        phase: 'review',
      });
    } else {
      // All wrong questions reviewed
      set({
        isReviewMode: false,
        phase: 'completed',
      });
    }
  },

  completeSession: () => {
    const { currentSession, timeSpent } = get();
    if (!currentSession) return;

    const completedSession: DailySession = {
      ...currentSession,
      status: 'completed',
      completedAt: new Date().toISOString(),
      timeSpentSeconds: timeSpent,
    };

    set({
      currentSession: completedSession,
      phase: 'completed',
      timerActive: false,
    });
  },

  resetQuiz: () =>
    set({
      currentSession: null,
      phase: 'idle',
      currentPassageIndex: 0,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showExplanation: false,
      isCorrect: null,
      currentAttempts: 0,
      wrongQuestions: [],
      isReviewMode: false,
      reviewIndex: 0,
      timeSpent: 0,
      timerActive: false,
    }),

  tick: () => {
    const { timerActive } = get();
    if (timerActive) {
      set((state) => ({ timeSpent: state.timeSpent + 1 }));
    }
  },

  setTimerActive: (active) => set({ timerActive: active }),

  setPhase: (phase) => set({ phase }),
}));

// ---------------------------------------------------------------------------
// Selectors (for convenience)
// ---------------------------------------------------------------------------

/**
 * Get the current passage being displayed.
 */
export function selectCurrentPassage(
  state: QuizState
): SessionPassage | null {
  if (!state.currentSession) return null;
  return state.currentSession.passages[state.currentPassageIndex] ?? null;
}

/**
 * Get the current question being answered.
 */
export function selectCurrentQuestion(
  state: QuizState
): SessionQuestion | null {
  if (!state.currentSession) return null;

  if (state.isReviewMode) {
    const questionId = state.wrongQuestions[state.reviewIndex];
    for (const passage of state.currentSession.passages) {
      const found = passage.questions.find((q) => q.questionId === questionId);
      if (found) return found;
    }
    return (
      state.currentSession.grammarQuestions.find(
        (q) => q.questionId === questionId
      ) ?? null
    );
  }

  return getCurrentQuestion(
    state.currentSession,
    state.currentPassageIndex,
    state.currentQuestionIndex,
    state.phase
  );
}

/**
 * Get the total progress through the session (0-100).
 */
export function selectProgress(state: QuizState): number {
  if (!state.currentSession) return 0;

  const totalPassageQuestions = state.currentSession.passages.reduce(
    (sum, p) => sum + p.questions.length,
    0
  );
  const totalGrammarQuestions = state.currentSession.grammarQuestions.length;
  const totalQuestions = totalPassageQuestions + totalGrammarQuestions;

  if (totalQuestions === 0) return 0;

  let answeredCount = 0;

  for (const passage of state.currentSession.passages) {
    for (const q of passage.questions) {
      if (q.studentAnswer !== undefined) answeredCount++;
    }
  }

  for (const q of state.currentSession.grammarQuestions) {
    if (q.studentAnswer !== undefined) answeredCount++;
  }

  return Math.round((answeredCount / totalQuestions) * 100);
}
