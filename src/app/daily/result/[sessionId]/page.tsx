'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Trophy, Target, Clock, Sparkles, Coins, ChevronDown,
  ChevronUp, BookOpen, Feather, Music, SpellCheck,
  ArrowRight, Home, NotebookPen,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardBody } from '@/components/ui/Card';
import { useAuthStore } from '@/store/useAuthStore';
import { formatTimeKorean, calculateAccuracy, getPerformanceRating } from '@/lib/utils';

interface DomainResult {
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  correct: number;
  total: number;
}

interface WrongAnswer {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export default function ResultPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const user = useAuthStore((s) => s.user);
  const [showWrongAnswers, setShowWrongAnswers] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const totalCorrect = 10;
  const totalQuestions = 14;
  const firstTryCorrect = 8;
  const timeSpent = 842;
  const xpEarned = 150;
  const coinsEarned = 35;

  const accuracy = calculateAccuracy(totalCorrect, totalQuestions);
  const firstTryAccuracy = calculateAccuracy(firstTryCorrect, totalQuestions);
  const rating = getPerformanceRating(firstTryAccuracy);

  const domainResults: DomainResult[] = [
    { label: '비문학', icon: <BookOpen className="w-4 h-4" />, color: 'text-indigo-600', bgColor: 'bg-indigo-500', correct: 3, total: 3 },
    { label: '문학', icon: <Feather className="w-4 h-4" />, color: 'text-emerald-600', bgColor: 'bg-emerald-500', correct: 2, total: 3 },
    { label: '시', icon: <Music className="w-4 h-4" />, color: 'text-purple-600', bgColor: 'bg-purple-500', correct: 2, total: 2 },
    { label: '문법', icon: <SpellCheck className="w-4 h-4" />, color: 'text-amber-600', bgColor: 'bg-amber-500', correct: 3, total: 4 },
  ];

  const mockWrongAnswers: WrongAnswer[] = [
    {
      question: '이 이야기에서 토끼가 깨달은 교훈은 무엇인가요?',
      yourAnswer: '빨리 달리는 것이 가장 중요하다.',
      correctAnswer: '모든 것을 잘하는 사람은 없고, 서로 다른 능력이 중요하다.',
      explanation: '토끼가 마지막에 "모든 것을 잘하는 사람은 없구나. 서로 다른 능력이 중요한 거야."라고 깨달은 것이 이 이야기의 교훈입니다.',
    },
    {
      question: '다음 중 높임말로 바르게 고친 것은?',
      yourAnswer: '"밥 먹어." -> "밥 드세요."',
      correctAnswer: '"밥 먹어." -> "밥 잡수세요."',
      explanation: '"먹다"의 높임말은 "잡수시다/드시다"입니다. "밥 잡수세요"가 가장 바른 높임 표현입니다.',
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899'],
      });
    }, 500);

    const timer2 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-slate-50 to-slate-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Celebration Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-block"
          >
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mx-auto shadow-xl">
              <span className="text-6xl">&#128049;</span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-3xl font-extrabold text-gray-900"
          >
            학습 완료!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`mt-1 text-lg font-bold ${rating.color}`}
          >
            {rating.label}
          </motion.p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="elevated" className="mb-4">
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-indigo-50 rounded-xl">
                  <Target className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
                  <p className="text-2xl font-extrabold text-indigo-600">
                    {totalCorrect}/{totalQuestions}
                  </p>
                  <p className="text-xs text-gray-500">총 정답</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <Trophy className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                  <p className="text-2xl font-extrabold text-emerald-600">
                    {firstTryAccuracy}%
                  </p>
                  <p className="text-xs text-gray-500">첫 시도 정확도</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <Clock className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-2xl font-extrabold text-purple-600">
                    {formatTimeKorean(timeSpent)}
                  </p>
                  <p className="text-xs text-gray-500">소요 시간</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <Coins className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-lg font-extrabold text-amber-600">
                    +{xpEarned} XP / +{coinsEarned}
                  </p>
                  <p className="text-xs text-gray-500">획득 보상</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Domain Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="mb-4">
            <CardBody>
              <h3 className="text-sm font-bold text-gray-700 mb-3">영역별 결과</h3>
              <div className="space-y-3">
                {domainResults.map((domain) => {
                  const pct = domain.total > 0 ? (domain.correct / domain.total) * 100 : 0;
                  return (
                    <div key={domain.label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={domain.color}>{domain.icon}</span>
                          <span className="text-sm font-medium text-gray-700">{domain.label}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-800">
                          {domain.correct}/{domain.total}
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${domain.bgColor}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Wrong Answers Summary */}
        {mockWrongAnswers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="mb-4">
              <CardBody>
                <button
                  onClick={() => setShowWrongAnswers(!showWrongAnswers)}
                  className="w-full flex items-center justify-between cursor-pointer"
                >
                  <h3 className="text-sm font-bold text-gray-700">
                    틀린 문제 ({mockWrongAnswers.length}개)
                  </h3>
                  {showWrongAnswers ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {showWrongAnswers && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 space-y-3"
                  >
                    {mockWrongAnswers.map((wrong, i) => (
                      <div key={i} className="p-3 bg-red-50 rounded-xl border border-red-200">
                        <p className="text-sm font-medium text-gray-800 mb-2">{wrong.question}</p>
                        <div className="text-xs space-y-1">
                          <p className="text-red-600">
                            <span className="font-medium">내 답:</span> {wrong.yourAnswer}
                          </p>
                          <p className="text-emerald-600">
                            <span className="font-medium">정답:</span> {wrong.correctAnswer}
                          </p>
                        </div>
                        <p className="mt-2 text-xs text-gray-600 bg-white p-2 rounded-lg">
                          {wrong.explanation}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-3"
        >
          <Link href="/review" className="block">
            <Button variant="outline" className="w-full" size="lg">
              <NotebookPen className="w-5 h-5" />
              오답 노트 보기
            </Button>
          </Link>
          <Link href="/dashboard" className="block">
            <Button className="w-full" size="lg">
              <Home className="w-5 h-5" />
              대시보드로
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
