"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  Play,
  CheckCircle,
  Trophy,
  Star,
  BookOpen,
  ChevronRight,
  Home,
  BarChart3,
  Award,
  User as UserIcon,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import type { DailyExpression } from "@/data/daily-expressions";
import type { DailyChallenge } from "@/data/daily-challenges";
import Button from "@/components/ui/Button";
import Card, { CardBody } from "@/components/ui/Card";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getLevelProgress,
  getStreakMessage,
  calculateAccuracy,
} from "@/lib/utils";

const weekDays = ["월", "화", "수", "목", "금", "토", "일"];

function CircularProgress({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-[76px] h-[76px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
          <circle
            cx="38"
            cy="38"
            r={radius}
            stroke="#F1F5F9"
            strokeWidth="5"
            fill="none"
          />
          <motion.circle
            cx="38"
            cy="38"
            r={radius}
            stroke={color}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-800">{value}%</span>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-500">{label}</span>
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [todayStatus, setTodayStatus] = useState<
    "not_started" | "in_progress" | "completed"
  >("not_started");
  const [todaySessionId, setTodaySessionId] = useState<string | null>(null);
  const [weekCompletion, setWeekCompletion] = useState<boolean[]>(
    Array(7).fill(false),
  );
  const [dailyExpression, setDailyExpression] =
    useState<DailyExpression | null>(null);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/sessions/today")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setTodayStatus(data.status || "not_started");
          setTodaySessionId(data.sessionId || null);
        }
      })
      .catch(() => {});
    fetch("/api/sessions/weekly")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.weekCompletion)
          setWeekCompletion(data.weekCompletion);
      })
      .catch(() => {});
    fetch("/api/daily-expression")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.expression)
          setDailyExpression(data.expression);
      })
      .catch(() => {});
    fetch("/api/daily-challenges")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.challenges)
          setDailyChallenges(data.challenges);
      })
      .catch(() => {});
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFF]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white font-bold">H</span>
          </div>
          <p className="text-gray-500 mb-4">로그인이 필요합니다.</p>
          <Link href="/login">
            <Button>로그인하기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const levelInfo = getLevelProgress(user.xp);
  const domainScores = user.stats.domainScores;
  const readingScore = calculateAccuracy(
    domainScores.reading.correctAnswers,
    domainScores.reading.totalQuestions,
  );
  const literatureScore = calculateAccuracy(
    domainScores.literature.correctAnswers,
    domainScores.literature.totalQuestions,
  );
  const grammarScore = calculateAccuracy(
    domainScores.grammar.correctAnswers,
    domainScores.grammar.totalQuestions,
  );

  const recentBadges = user.badges.slice(-3);

  return (
    <div className="min-h-screen bg-[#FAFBFF] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-white px-4 pt-6 pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-lg mx-auto relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl font-bold">H</span>
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold">안녕, {user.displayName}!</h1>
              <p className="text-white/60 text-sm">
                Lv.{levelInfo.currentLevel} {levelInfo.title}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-xl backdrop-blur-sm">
              <Flame className="w-4 h-4 text-orange-300" />
              <span className="text-sm font-bold">{user.streak}</span>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-xs text-white/50 mb-1.5">
              <span>Lv.{levelInfo.currentLevel}</span>
              <span>
                {user.xp} / {levelInfo.nextLevelXP} XP
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-5 space-y-4">
        {/* Today's Study */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated">
            <CardBody>
              {todayStatus === "not_started" && (
                <div className="text-center py-2">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    오늘의 학습을 시작해볼까요?
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">
                    비문학 + 문학 + 시 + 문법 | 약 15분
                  </p>
                  <Link href="/daily">
                    <Button size="lg" className="w-full">
                      <Play className="w-5 h-5" />
                      학습 시작하기
                    </Button>
                  </Link>
                </div>
              )}
              {todayStatus === "in_progress" && (
                <div className="text-center py-2">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-7 h-7 text-amber-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    학습 중! 이어서 할까요?
                  </h2>
                  <Link
                    href={
                      todaySessionId ? `/daily/${todaySessionId}` : "/daily"
                    }
                  >
                    <Button size="lg" className="w-full mt-3">
                      <Play className="w-5 h-5" />
                      이어서 학습하기
                    </Button>
                  </Link>
                </div>
              )}
              {todayStatus === "completed" && (
                <div className="text-center py-2">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-bold text-emerald-600 mb-0.5">
                    오늘 학습 완료!
                  </h2>
                  <p className="text-sm text-gray-400">내일 또 만나요</p>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {/* Streak & Weekly */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card>
            <CardBody className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-2xl font-extrabold text-gray-900">
                  {user.streak}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">연속 학습</p>
              <p className="text-[11px] text-orange-500 mt-1 font-medium">
                {getStreakMessage(user.streak)}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs text-gray-400 font-medium mb-2 text-center">
                이번 주
              </p>
              <div className="flex justify-between">
                {weekDays.map((day, i) => (
                  <div key={day} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-400">{day}</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${weekCompletion[i] ? "bg-emerald-500" : "bg-gray-100"}`}
                    >
                      {weekCompletion[i] && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Daily Expression */}
        {dailyExpression && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card>
              <CardBody>
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-violet-500" />
                  <h3 className="text-sm font-bold text-gray-700">
                    오늘의 표현
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 font-medium border border-violet-100">
                    {dailyExpression.type === "proverb"
                      ? "속담"
                      : dailyExpression.type === "idiom"
                        ? "관용어"
                        : "사자성어"}
                  </span>
                </div>
                <p className="text-base font-bold text-gray-900 mb-1">
                  {dailyExpression.expression}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  {dailyExpression.meaning}
                </p>
                <div className="bg-violet-50/60 rounded-xl p-2.5 border border-violet-100/50">
                  <p className="text-xs text-violet-700">
                    <span className="font-semibold">예문:</span>{" "}
                    {dailyExpression.example}
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Domain Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardBody>
              <h3 className="text-sm font-bold text-gray-700 mb-4">
                영역별 정확도
              </h3>
              <div className="flex justify-around">
                <CircularProgress
                  value={readingScore}
                  label="읽기"
                  color="#6366F1"
                />
                <CircularProgress
                  value={literatureScore}
                  label="문학"
                  color="#10B981"
                />
                <CircularProgress
                  value={grammarScore}
                  label="문법"
                  color="#F59E0B"
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Daily Challenges */}
        {dailyChallenges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card>
              <CardBody>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-gray-700">
                    오늘의 미션
                  </h3>
                </div>
                <div className="space-y-2">
                  {dailyChallenges.map((challenge) => {
                    const isCompleted =
                      todayStatus === "completed" &&
                      challenge.type === "completion";
                    return (
                      <div
                        key={challenge.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border ${isCompleted ? "bg-emerald-50/50 border-emerald-200/60" : "bg-gray-50/50 border-gray-100"}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? "bg-emerald-500" : "bg-gray-200"}`}
                        >
                          {isCompleted && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-bold ${isCompleted ? "text-emerald-700" : "text-gray-700"}`}
                          >
                            {challenge.title}
                          </p>
                          <p className="text-[10px] text-gray-400 truncate">
                            {challenge.description}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[10px] font-bold text-amber-600">
                            +{challenge.xpReward} XP
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Recent Badges */}
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
                  <Link
                    href="/achievements"
                    className="text-xs text-indigo-600 flex items-center gap-0.5 font-medium"
                  >
                    전체 보기 <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="flex gap-3">
                  {recentBadges.map((badgeId) => (
                    <div
                      key={badgeId}
                      className="flex-1 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl text-center border border-amber-100"
                    >
                      <Trophy className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                      <p className="text-[10px] font-medium text-gray-500 truncate">
                        {badgeId.replace(/_/g, " ")}
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
              <h3 className="text-sm font-bold text-gray-700 mb-3">
                학습 통계
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                  <p className="text-xl font-bold text-indigo-600">
                    {user.totalDaysCompleted}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">총 학습일</p>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                  <p className="text-xl font-bold text-emerald-600">
                    {user.stats.totalQuestionsAnswered}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    풀어본 문제
                  </p>
                </div>
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                  <p className="text-xl font-bold text-amber-600">
                    {Math.round(user.stats.averageAccuracy)}%
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    평균 정확도
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100/50 px-2 py-2 z-40">
        <div className="max-w-lg mx-auto flex justify-around">
          {[
            {
              icon: <Home className="w-5 h-5" />,
              label: "홈",
              href: "/dashboard",
              active: true,
            },
            {
              icon: <BookOpen className="w-5 h-5" />,
              label: "학습",
              href: "/daily",
              active: false,
            },
            {
              icon: <BarChart3 className="w-5 h-5" />,
              label: "순위",
              href: "/ranking",
              active: false,
            },
            {
              icon: <Award className="w-5 h-5" />,
              label: "뱃지",
              href: "/achievements",
              active: false,
            },
            {
              icon: <UserIcon className="w-5 h-5" />,
              label: "프로필",
              href: "/profile",
              active: false,
            },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                item.active
                  ? "text-indigo-600"
                  : "text-gray-400 hover:text-gray-500"
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
