'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Feather, Music, SpellCheck, Clock,
  ChevronRight, ChevronDown, ChevronUp, Check, X,
  RotateCcw, Sparkles,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { useAuthStore } from '@/store/useAuthStore';
import { ALL_PASSAGES, SEED_PASSAGES } from '@/data/passages';
import { SEED_QUESTIONS, getQuestionsByPassageId, getGrammarQuestions } from '@/data/questions';
import { formatTime } from '@/lib/utils';
import type { SessionPassage, SessionQuestion, DailySession, PassageType, Choice, Grade, Semester } from '@/types';

type SectionType = 'nonfiction' | 'fiction' | 'poetry' | 'grammar';

const sectionConfig: Record<SectionType, { icon: React.ReactNode; label: string; color: string; bgColor: string }> = {
  nonfiction: { icon: <BookOpen className="w-4 h-4" />, label: '비문학', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  fiction: { icon: <Feather className="w-4 h-4" />, label: '문학', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  poetry: { icon: <Music className="w-4 h-4" />, label: '시', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  grammar: { icon: <SpellCheck className="w-4 h-4" />, label: '문법', color: 'text-amber-600', bgColor: 'bg-amber-100' },
};

function buildFallbackSession(sessionId: string, grade: Grade, semester: Semester): DailySession {
  const allPassages = ALL_PASSAGES.length > 0 ? ALL_PASSAGES : SEED_PASSAGES;

  // Filter by exact grade+semester, then grade only, then grade group
  const gradeGroup = grade <= 2 ? '1-2' : grade <= 4 ? '3-4' : '5-6';

  const findPassage = (type: PassageType) => {
    return (
      allPassages.find((p) => p.type === type && p.grade === grade && p.semester === semester) ||
      allPassages.find((p) => p.type === type && p.grade === grade) ||
      allPassages.find((p) => p.type === type && p.gradeGroup === gradeGroup) ||
      null
    );
  };

  const nonfictionPassage = findPassage('nonfiction');
  const fictionPassage = findPassage('fiction');
  const poetryPassage = findPassage('poetry');

  const buildSessionPassage = (passage: NonNullable<ReturnType<typeof findPassage>>): SessionPassage => {
    const questions = getQuestionsByPassageId(passage.id);
    const fallbackQuestions = SEED_QUESTIONS.filter((q) => q.passageId !== '').slice(0, 2);
    const used = questions.length > 0 ? questions : fallbackQuestions;

    return {
      passageId: passage.id,
      title: passage.title,
      type: passage.type,
      content: passage.content,
      questions: used.map((q) => ({
        questionId: q.id,
        question: q.question,
        choices: q.choices,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        wrongExplanations: q.wrongExplanations,
        attempts: 0,
      })),
    };
  };

  const sessionPassages: SessionPassage[] = [];
  if (nonfictionPassage) sessionPassages.push(buildSessionPassage(nonfictionPassage));
  if (fictionPassage) sessionPassages.push(buildSessionPassage(fictionPassage));
  if (poetryPassage) sessionPassages.push(buildSessionPassage(poetryPassage));

  const grammar = getGrammarQuestions();
  const grammarQuestions: SessionQuestion[] = grammar.slice(0, 4).map((q) => ({
    questionId: q.id,
    question: q.question,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    wrongExplanations: q.wrongExplanations,
    attempts: 0,
  }));

  const totalQuestions = sessionPassages.reduce((sum, p) => sum + p.questions.length, 0) + grammarQuestions.length;

  return {
    id: sessionId,
    userId: 'fallback-user',
    grade,
    semester,
    date: new Date().toISOString().split('T')[0],
    status: 'in_progress',
    passages: sessionPassages,
    grammarQuestions,
    totalQuestions,
    correctOnFirstTry: 0,
    totalAttempts: 0,
    xpEarned: 0,
    coinsEarned: 0,
    startedAt: new Date().toISOString(),
    timeSpentSeconds: 0,
  };
}

export default function QuizSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  const { user } = useAuthStore();

  const [session, setSession] = useState<DailySession | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [currentSection, setCurrentSection] = useState<SectionType>('nonfiction');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [passageCollapsed, setPassageCollapsed] = useState(false);
  const [xpPopup, setXpPopup] = useState<number | null>(null);

  useEffect(() => {
    const grade = (user?.grade ?? 3) as Grade;
    const semester = (user?.semester ?? 1) as Semester;

    let cancelled = false;

    async function fetchSession() {
      setLoadingSession(true);
      try {
        const res = await fetch('/api/generate-daily', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ grade, semester }),
        });
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        if (!cancelled && data.success && data.session) {
          const apiSession: DailySession = {
            ...data.session,
            status: 'in_progress',
          };
          setSession(apiSession);
          setLoadingSession(false);
          return;
        }
        throw new Error('Invalid response');
      } catch {
        // Fallback to local seed data filtered by grade
        if (!cancelled) {
          const fallback = buildFallbackSession(sessionId, grade, semester);
          setSession(fallback);
          setLoadingSession(false);
        }
      }
    }

    fetchSession();
    return () => { cancelled = true; };
  }, [sessionId, user?.grade, user?.semester]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const sectionQuestions = useMemo((): SessionQuestion[] => {
    if (!session) return [];
    if (currentSection === 'grammar') return session.grammarQuestions;
    const passage = session.passages.find((p) => p.type === (currentSection as PassageType));
    return passage?.questions || [];
  }, [session, currentSection]);

  const currentPassage = useMemo(() => {
    if (!session || currentSection === 'grammar') return null;
    return session.passages.find((p) => p.type === (currentSection as PassageType)) || null;
  }, [session, currentSection]);

  const currentQuestion = sectionQuestions[currentQuestionIndex] || null;

  const totalAnswered = useMemo(() => {
    if (!session) return 0;
    const passageAnswered = session.passages.reduce(
      (sum, p) => sum + p.questions.filter((q) => q.isCorrect === true).length,
      0
    );
    const grammarAnswered = session.grammarQuestions.filter((q) => q.isCorrect === true).length;
    return passageAnswered + grammarAnswered;
  }, [session]);

  const sections: SectionType[] = ['nonfiction', 'fiction', 'poetry', 'grammar'];

  const isSectionComplete = useCallback((section: SectionType): boolean => {
    if (!session) return false;
    if (section === 'grammar') return session.grammarQuestions.every((q) => q.isCorrect === true);
    const passage = session.passages.find((p) => p.type === (section as PassageType));
    if (!passage) return true;
    return passage.questions.every((q) => q.isCorrect === true);
  }, [session]);

  const isAllComplete = useMemo(() => {
    return sections.every((s) => isSectionComplete(s));
  }, [isSectionComplete]);

  useEffect(() => {
    if (isAllComplete && session) {
      router.push(`/daily/result/${sessionId}`);
    }
  }, [isAllComplete, session, sessionId, router]);

  const handleCheckAnswer = () => {
    if (!currentQuestion || selectedAnswer === null) return;

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowExplanation(true);

    if (session) {
      const updateQuestion = (q: SessionQuestion) => {
        if (q.questionId !== currentQuestion.questionId) return q;
        return {
          ...q,
          studentAnswer: selectedAnswer,
          isCorrect: correct,
          attempts: q.attempts + 1,
          answeredAt: new Date().toISOString(),
        };
      };

      const updatedSession: DailySession = {
        ...session,
        passages: session.passages.map((p) => ({
          ...p,
          questions: p.questions.map(updateQuestion),
        })),
        grammarQuestions: session.grammarQuestions.map(updateQuestion),
      };

      if (correct) {
        const xp = currentQuestion.attempts === 0 ? 10 : currentQuestion.attempts === 1 ? 5 : 2;
        setXpPopup(xp);
        setTimeout(() => setXpPopup(null), 1500);
        updatedSession.xpEarned = (updatedSession.xpEarned || 0) + xp;
        if (currentQuestion.attempts === 0) {
          updatedSession.correctOnFirstTry = (updatedSession.correctOnFirstTry || 0) + 1;
        }
      }

      setSession(updatedSession);
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsCorrect(null);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsCorrect(null);

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < sectionQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      const currentIdx = sections.indexOf(currentSection);
      for (let i = currentIdx + 1; i < sections.length; i++) {
        if (!isSectionComplete(sections[i])) {
          setCurrentSection(sections[i]);
          setCurrentQuestionIndex(0);
          return;
        }
      }
    }
  };

  const handleSectionClick = (section: SectionType) => {
    setCurrentSection(section);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsCorrect(null);
  };

  if (!user && !loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-6xl mb-4">&#128049;</div>
          <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  if (!session || !currentQuestion || loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">
            {loadingSession ? 'AI가 맞춤 학습을 만들고 있어요...' : '학습을 준비하고 있어요...'}
          </p>
          {loadingSession && (
            <p className="mt-1 text-xs text-gray-400">잠시만 기다려 주세요</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-bold text-gray-700">
              {totalAnswered}/{session.totalQuestions}
            </span>
            <div className="flex-1">
              <ProgressBar
                value={(totalAnswered / session.totalQuestions) * 100}
                size="sm"
                color="primary"
              />
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timerSeconds)}</span>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-2">
            {sections.map((section) => {
              const config = sectionConfig[section];
              const complete = isSectionComplete(section);
              const active = currentSection === section;

              return (
                <button
                  key={section}
                  onClick={() => handleSectionClick(section)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? `${config.bgColor} ${config.color} ring-2 ring-offset-1 ring-current`
                      : complete
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {complete ? <Check className="w-3 h-3" /> : config.icon}
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row min-h-0">
          {/* Passage (Left on desktop, Top on mobile) */}
          {currentPassage && (
            <div className="lg:w-1/2 lg:border-r lg:border-gray-200 bg-white">
              {/* Mobile toggle */}
              <button
                onClick={() => setPassageCollapsed(!passageCollapsed)}
                className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 cursor-pointer"
              >
                <span className="text-sm font-bold text-gray-700">
                  {currentPassage.title}
                </span>
                {passageCollapsed ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                )}
              </button>

              <AnimatePresence>
                {!passageCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden lg:!h-auto lg:!opacity-100"
                  >
                    <div className="p-4 lg:p-6 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto">
                      <div className="hidden lg:block mb-3">
                        <h2 className="text-lg font-bold text-gray-900">{currentPassage.title}</h2>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${sectionConfig[currentSection].bgColor} ${sectionConfig[currentSection].color}`}>
                          {sectionConfig[currentSection].label}
                        </span>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-800 leading-7 whitespace-pre-wrap text-[15px]">
                          {currentPassage.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Question (Right on desktop, Bottom on mobile) */}
          <div className={`flex-1 p-4 lg:p-6 ${currentPassage ? '' : 'lg:max-w-2xl lg:mx-auto'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.questionId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Question Number */}
                {currentSection === 'grammar' && (
                  <span className={`inline-block mb-2 px-2 py-0.5 rounded text-xs font-medium ${sectionConfig.grammar.bgColor} ${sectionConfig.grammar.color}`}>
                    문법
                  </span>
                )}

                <h3 className="text-base font-bold text-gray-900 mb-4 leading-relaxed">
                  {currentQuestion.question}
                </h3>

                {/* Choices */}
                <div className="space-y-2.5">
                  {currentQuestion.choices.map((choice: Choice) => {
                    const isSelected = selectedAnswer === choice.number;
                    const isAnswer = choice.number === currentQuestion.correctAnswer;
                    const showResult = showExplanation;

                    let choiceStyle = 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50';
                    if (showResult && isAnswer) {
                      choiceStyle = 'border-emerald-500 bg-emerald-50';
                    } else if (showResult && isSelected && !isCorrect) {
                      choiceStyle = 'border-red-500 bg-red-50';
                    } else if (isSelected && !showResult) {
                      choiceStyle = 'border-indigo-500 bg-indigo-50';
                    }

                    return (
                      <button
                        key={choice.number}
                        onClick={() => !showExplanation && setSelectedAnswer(choice.number)}
                        disabled={showExplanation}
                        className={`w-full flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer disabled:cursor-default ${choiceStyle}`}
                      >
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          showResult && isAnswer
                            ? 'bg-emerald-500 text-white'
                            : showResult && isSelected && !isCorrect
                            ? 'bg-red-500 text-white'
                            : isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {showResult && isAnswer ? (
                            <Check className="w-4 h-4" />
                          ) : showResult && isSelected && !isCorrect ? (
                            <X className="w-4 h-4" />
                          ) : (
                            choice.number
                          )}
                        </span>
                        <span className={`text-sm leading-relaxed ${
                          showResult && isAnswer ? 'text-emerald-700 font-medium' : 'text-gray-800'
                        }`}>
                          {choice.text}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* XP Popup */}
                <AnimatePresence>
                  {xpPopup !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      className="fixed top-20 right-4 bg-amber-400 text-white px-4 py-2 rounded-xl shadow-lg font-bold z-50"
                    >
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        +{xpPopup} XP
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Check Answer / Navigation */}
                <div className="mt-6">
                  {!showExplanation && (
                    <Button
                      onClick={handleCheckAnswer}
                      disabled={selectedAnswer === null}
                      className="w-full"
                      size="lg"
                    >
                      <Check className="w-5 h-5" />
                      정답 확인
                    </Button>
                  )}
                </div>

                {/* Explanation Panel */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      className="mt-4"
                    >
                      <div className={`p-4 rounded-xl border-2 ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {isCorrect ? (
                            <>
                              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                <Check className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-lg font-bold text-emerald-700">
                                정답이에요!
                              </span>
                              <span className="text-2xl ml-1">&#128049;</span>
                            </>
                          ) : (
                            <>
                              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                                <X className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-lg font-bold text-red-700">
                                아쉬워요!
                              </span>
                            </>
                          )}
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed">
                          {isCorrect
                            ? currentQuestion.explanation
                            : selectedAnswer && currentQuestion.wrongExplanations[selectedAnswer]
                            ? currentQuestion.wrongExplanations[selectedAnswer]
                            : currentQuestion.explanation}
                        </p>
                      </div>

                      <div className="mt-3 flex gap-2">
                        {!isCorrect && (
                          <Button
                            variant="outline"
                            onClick={handleRetry}
                            className="flex-1"
                            size="lg"
                          >
                            <RotateCcw className="w-4 h-4" />
                            다시 풀기
                          </Button>
                        )}
                        {isCorrect && (
                          <Button
                            onClick={handleNext}
                            className="flex-1"
                            size="lg"
                          >
                            다음
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
