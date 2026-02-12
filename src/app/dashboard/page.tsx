'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Flame, Play, CheckCircle, Clock, Trophy, Star,
  BookOpen, Feather, SpellCheck, ChevronRight,
  Home, BarChart3, Award, User as UserIcon,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardBody } from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { useAuthStore } from '@/store/useAuthStore';
import { getLevelProgress, formatTimeKorean, getStreakMessage, calculateAccuracy } from '@/lib/utils';

const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
const mockWeekCompletion = [true, true, true, true, true, false, false];

function CircularProgress({ value, label, color }: { value: number; label: string; color: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} stroke="#E5E7EB" strokeWidth="6" fill="none" />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-800">{value}%</span>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-600">{label}</span>
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-6xl mb-4">&#128049;</div>
          <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
          <Link href="/login">
            <Button>로그인하기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const levelInfo = getLevelProgress(user.xp);
  const [todayStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');
  const domainScores = user.stats.domainScores;
  const readingScore = calculateAccuracy(domainScores.reading.correctAnswers, domainScores.reading.totalQuestions);
  const literatureScore = calculateAccuracy(domainScores.literature.correctAnswers, domainScores.literature.totalQuestions);
  const grammarScore = calculateAccuracy(domainScores.grammar.correctAnswers, domainScores.grammar.totalQuestions);

  const recentBadges = user.badges.slice(-3);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white px-4 pt-6 pb-8 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center"
            >
              <span className="text-3xl">&#128049;</span>
            </motion.div>
            <div className="flex-1">
              <h1 className="text-lg font-bold">
                안녕, {user.displayName}! 오늘도 화이팅!
              </h1>
              <p className="text-indigo-200 text-sm">
                Lv.{levelInfo.currentLevel} {levelInfo.title}
              </p>
            </div>
          </div>

          {/* Level/XP Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-indigo-200 mb-1">
              <span>Lv.{levelInfo.currentLevel}</span>
              <span>{user.xp} / {levelInfo.nextLevelXP} XP</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-amber-400"
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 space-y-4">
        {/* Today's Study Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated">
            <CardBody>
              {todayStatus === 'not_started' && (
                <div className="text-center py-2">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-5xl mb-3"
                  >
                    &#128049;
                  </motion.div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    오늘의 학습을 시작해볼까요?
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    비문학 + 문학 + 시 + 문법으로 구성된 15분 학습이에요
                  </p>
                  <Link href="/daily">
                    <Button size="lg" className="w-full">
                      <Play className="w-5 h-5" />
                      학습 시작하기
                    </Button>
                  </Link>
                </div>
              )}
              {todayStatus === 'in_progress' && (
                <div className="text-center py-2">
                  <div className="text-5xl mb-3">&#128049;</div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    학습 중이에요! 이어서 할까요?
                  </h2>
                  <Link href="/daily">
                    <Button size="lg" className="w-full mt-3">
                      <Play className="w-5 h-5" />
                      이어서 학습하기
                    </Button>
                  </Link>
                </div>
              )}
              {todayStatus === 'completed' && (
                <div className="text-center py-2">
                  <div className="text-5xl mb-3">&#128049;</div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-lg font-bold text-emerald-600">
                      오늘 학습 완료! 대단해요!
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500">내일 또 만나요!</p>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {/* Streak & Weekly Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          {/* Streak */}
          <Card>
            <CardBody className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Flame className="w-6 h-6 text-orange-500" />
                <span className="text-3xl font-extrabold text-gray-900">{user.streak}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">연속 학습</p>
              <p className="text-xs text-orange-500 mt-1">{getStreakMessage(user.streak)}</p>
            </CardBody>
          </Card>

          {/* Weekly Calendar */}
          <Card>
            <CardBody>
              <p className="text-xs text-gray-500 font-medium mb-2 text-center">이번 주</p>
              <div className="flex justify-between">
                {weekDays.map((day, i) => (
                  <div key={day} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-400">{day}</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        mockWeekCompletion[i]
                          ? 'bg-emerald-500'
                          : 'bg-gray-200'
                      }`}
                    >
                      {mockWeekCompletion[i] && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Domain Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardBody>
              <h3 className="text-sm font-bold text-gray-700 mb-4">영역별 정확도</h3>
              <div className="flex justify-around">
                <CircularProgress value={readingScore} label="읽기" color="#4F46E5" />
                <CircularProgress value={literatureScore} label="문학" color="#10B981" />
                <CircularProgress value={grammarScore} label="문법" color="#F59E0B" />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Recent Achievements */}
        {recentBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardBody>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-700">최근 뱃지</h3>
                  <Link href="/achievements" className="text-xs text-indigo-600 flex items-center gap-0.5">
                    전체 보기 <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="flex gap-3">
                  {recentBadges.map((badgeId) => (
                    <div
                      key={badgeId}
                      className="flex-1 p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl text-center border border-amber-200"
                    >
                      <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                      <p className="text-[10px] font-medium text-gray-600 truncate">
                        {badgeId.replace(/_/g, ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardBody>
              <h3 className="text-sm font-bold text-gray-700 mb-3">학습 통계</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <p className="text-xl font-bold text-indigo-600">{user.totalDaysCompleted}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">총 학습 일수</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <p className="text-xl font-bold text-emerald-600">{user.stats.totalQuestionsAnswered}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">풀어본 문제</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl">
                  <p className="text-xl font-bold text-amber-600">{Math.round(user.stats.averageAccuracy)}%</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">평균 정확도</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40">
        <div className="max-w-lg mx-auto flex justify-around">
          {[
            { icon: <Home className="w-5 h-5" />, label: '홈', href: '/dashboard', active: true },
            { icon: <BookOpen className="w-5 h-5" />, label: '학습', href: '/daily', active: false },
            { icon: <BarChart3 className="w-5 h-5" />, label: '순위', href: '/ranking', active: false },
            { icon: <Award className="w-5 h-5" />, label: '뱃지', href: '/achievements', active: false },
            { icon: <UserIcon className="w-5 h-5" />, label: '프로필', href: '/profile', active: false },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                item.active
                  ? 'text-indigo-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
