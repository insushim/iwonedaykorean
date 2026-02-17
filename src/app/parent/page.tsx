'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Link2, UserPlus, Calendar, Flame,
  Target, BookOpen, Feather, SpellCheck, TrendingUp,
  BarChart3, Clock, Users,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardBody } from '@/components/ui/Card';
import { useAuthStore } from '@/store/useAuthStore';
import { calculateAccuracy } from '@/lib/utils';

interface ChildData {
  displayName: string;
  grade: number;
  semester: number;
  level: number;
  xp: number;
  streak: number;
  longestStreak: number;
  totalDaysCompleted: number;
  averageAccuracy: number;
  domainScores: {
    reading: number;
    literature: number;
    grammar: number;
  };
  calendarData: Record<string, number>;
}

function HeatmapCalendar({ data }: { data: Record<string, number> }) {
  const weeks = useMemo(() => {
    const today = new Date();
    const result: { date: string; value: number }[][] = [];
    let currentWeek: { date: string; value: number }[] = [];

    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      currentWeek.push({ date: key, value: data[key] || 0 });

      if (d.getDay() === 6 || i === 0) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }

    return result;
  }, [data]);

  const getColor = (value: number): string => {
    if (value === 0) return 'bg-gray-100';
    if (value === 1) return 'bg-emerald-300';
    return 'bg-emerald-600';
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-0.5 min-w-[350px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((day) => (
              <div
                key={day.date}
                className={`w-3 h-3 rounded-sm ${getColor(day.value)}`}
                title={`${day.date}: ${day.value > 0 ? '학습 완료' : '미학습'}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-500">
        <span>적음</span>
        <div className="w-3 h-3 rounded-sm bg-gray-100" />
        <div className="w-3 h-3 rounded-sm bg-emerald-300" />
        <div className="w-3 h-3 rounded-sm bg-emerald-600" />
        <span>많음</span>
      </div>
    </div>
  );
}

function SimpleBarChart({ data, labels, colors }: { data: number[]; labels: string[]; colors: string[] }) {
  const max = Math.max(...data, 1);

  return (
    <div className="flex items-end justify-around gap-3 h-32">
      {data.map((value, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-xs font-bold text-gray-700">{value}%</span>
          <motion.div
            className={`w-full rounded-t-lg ${colors[i]}`}
            initial={{ height: 0 }}
            animate={{ height: `${(value / max) * 100}%` }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            style={{ minHeight: 4 }}
          />
          <span className="text-[10px] text-gray-500">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function ParentPage() {
  const user = useAuthStore((s) => s.user);
  const [linked, setLinked] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [childData, setChildData] = useState<ChildData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user is logged in, show their own data as a demo (until parent-child linking is implemented)
    if (!user) {
      setLoading(false);
      return;
    }

    // Build child data from logged-in user's profile
    const ds = user.stats.domainScores;
    const readingAcc = calculateAccuracy(ds.reading.correctAnswers, ds.reading.totalQuestions);
    const litAcc = calculateAccuracy(ds.literature.correctAnswers, ds.literature.totalQuestions);
    const gramAcc = calculateAccuracy(ds.grammar.correctAnswers, ds.grammar.totalQuestions);

    // Fetch calendar data from sessions
    fetch('/api/sessions/weekly')
      .then((r) => r.json())
      .then(() => {
        // Build calendar data from user's real stats
        setChildData({
          displayName: user.displayName,
          grade: user.grade,
          semester: user.semester,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          longestStreak: user.longestStreak,
          totalDaysCompleted: user.totalDaysCompleted,
          averageAccuracy: user.stats.averageAccuracy,
          domainScores: {
            reading: readingAcc,
            literature: litAcc,
            grammar: gramAcc,
          },
          calendarData: {},
        });
        setLinked(true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!linked || !childData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center mx-auto shadow-lg mb-6">
            <Users className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">학부모 대시보드</h1>
          <p className="text-gray-500 mb-6">
            로그인 후 자녀의 학습 현황을 확인하세요.
          </p>

          <Link href="/login">
            <Button className="w-full">
              <UserPlus className="w-4 h-4" />
              로그인하기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const child = childData;

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white px-4 pt-4 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/dashboard" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-lg font-bold">학부모 대시보드</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-2xl">&#128049;</span>
            </div>
            <div>
              <h2 className="text-lg font-bold">{child.displayName}</h2>
              <p className="text-indigo-200 text-sm">
                {child.grade}학년 {child.semester}학기 | Lv.{child.level}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-white/10 rounded-xl p-2.5 text-center">
              <Flame className="w-4 h-4 text-orange-300 mx-auto mb-0.5" />
              <p className="text-lg font-bold">{child.streak}</p>
              <p className="text-[10px] text-indigo-200">연속 학습</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 text-center">
              <Calendar className="w-4 h-4 text-emerald-300 mx-auto mb-0.5" />
              <p className="text-lg font-bold">{child.totalDaysCompleted}</p>
              <p className="text-[10px] text-indigo-200">총 학습일</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 text-center">
              <Target className="w-4 h-4 text-amber-300 mx-auto mb-0.5" />
              <p className="text-lg font-bold">{Math.round(child.averageAccuracy)}%</p>
              <p className="text-[10px] text-indigo-200">평균 정확도</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-3 space-y-3">
        {/* Study Calendar Heatmap */}
        <Card variant="elevated">
          <CardBody>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              학습 달력
            </h3>
            <HeatmapCalendar data={child.calendarData} />
          </CardBody>
        </Card>

        {/* Domain Strength */}
        <Card>
          <CardBody>
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-gray-400" />
              영역별 강점
            </h3>
            <SimpleBarChart
              data={[child.domainScores.reading, child.domainScores.literature, child.domainScores.grammar]}
              labels={['읽기', '문학', '문법']}
              colors={['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500']}
            />
          </CardBody>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardBody>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              학습 현황
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-indigo-50 rounded-xl text-center">
                <p className="text-xl font-bold text-indigo-600">{child.totalDaysCompleted}일</p>
                <p className="text-[10px] text-gray-500">총 학습일 수</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-center">
                <p className="text-xl font-bold text-amber-600">{child.xp} XP</p>
                <p className="text-[10px] text-gray-500">총 경험치</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-center">
                <p className="text-xl font-bold text-emerald-600">{child.longestStreak}일</p>
                <p className="text-[10px] text-gray-500">최고 연속 학습</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl text-center">
                <p className="text-xl font-bold text-purple-600">Lv.{child.level}</p>
                <p className="text-[10px] text-gray-500">현재 레벨</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
