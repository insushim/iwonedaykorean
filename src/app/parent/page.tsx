'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Link2, UserPlus, Calendar, Flame,
  Target, BookOpen, Feather, SpellCheck, TrendingUp,
  BarChart3, Clock, Users,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardBody } from '@/components/ui/Card';

const mockChildData = {
  displayName: '하루학생',
  grade: 3,
  semester: 1,
  level: 5,
  xp: 1250,
  streak: 7,
  longestStreak: 14,
  totalDaysCompleted: 23,
  averageAccuracy: 78.5,
  domainScores: {
    reading: 78,
    literature: 85,
    grammar: 72,
  },
  weeklyStats: {
    daysStudied: 5,
    questionsAnswered: 70,
    accuracy: 81,
    timeSpent: 4200,
  },
  monthlyStats: {
    daysStudied: 18,
    questionsAnswered: 252,
    accuracy: 79,
    timeSpent: 15120,
  },
  calendarData: generateCalendarData(),
  accuracyTrend: [72, 74, 76, 78, 75, 80, 82, 78, 81, 79, 83, 85],
  streakHistory: [3, 5, 7, 4, 8, 7, 10, 12, 9, 14, 7, 7],
};

function generateCalendarData(): Record<string, number> {
  const data: Record<string, number> = {};
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const random = Math.random();
    if (random > 0.3) {
      data[key] = random > 0.7 ? 2 : 1;
    } else {
      data[key] = 0;
    }
  }
  return data;
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

function TrendLine({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="h-20 w-full">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>12주 전</span>
        <span>이번 주</span>
      </div>
    </div>
  );
}

export default function ParentPage() {
  const [linked, setLinked] = useState(true);
  const [inviteCode, setInviteCode] = useState('');
  const [statPeriod, setStatPeriod] = useState<'weekly' | 'monthly'>('weekly');

  const child = mockChildData;
  const stats = statPeriod === 'weekly' ? child.weeklyStats : child.monthlyStats;

  if (!linked) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center mx-auto shadow-lg mb-6">
            <Users className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">학부모 대시보드</h1>
          <p className="text-gray-500 mb-6">
            자녀의 초대 코드를 입력하여 학습 현황을 확인하세요.
          </p>

          <Card>
            <CardBody>
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="초대 코드 입력 (예: HARU-ABC123)"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-mono text-sm"
                  maxLength={15}
                />
              </div>
              <Button
                onClick={() => setLinked(true)}
                className="w-full mt-3"
                disabled={inviteCode.length < 6}
              >
                <UserPlus className="w-4 h-4" />
                자녀 연동하기
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white px-4 pt-4 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
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
              <p className="text-lg font-bold">{child.averageAccuracy}%</p>
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

        {/* Period Stats */}
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                학습 통계
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setStatPeriod('weekly')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    statPeriod === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  주간
                </button>
                <button
                  onClick={() => setStatPeriod('monthly')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    statPeriod === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  월간
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-indigo-50 rounded-xl text-center">
                <p className="text-xl font-bold text-indigo-600">{stats.daysStudied}일</p>
                <p className="text-[10px] text-gray-500">학습일 수</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-center">
                <p className="text-xl font-bold text-emerald-600">{stats.questionsAnswered}개</p>
                <p className="text-[10px] text-gray-500">풀어본 문제</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-center">
                <p className="text-xl font-bold text-amber-600">{stats.accuracy}%</p>
                <p className="text-[10px] text-gray-500">정확도</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl text-center">
                <p className="text-xl font-bold text-purple-600">{Math.round(stats.timeSpent / 60)}분</p>
                <p className="text-[10px] text-gray-500">총 학습 시간</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Domain Strength (Radar-like using bars) */}
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

        {/* Accuracy Trend */}
        <Card>
          <CardBody>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              정확도 추세
            </h3>
            <TrendLine data={child.accuracyTrend} color="#4F46E5" />
          </CardBody>
        </Card>

        {/* Streak Trend */}
        <Card>
          <CardBody>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-gray-400" />
              연속 학습 추세
            </h3>
            <TrendLine data={child.streakHistory} color="#F59E0B" />
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-gray-500">최고 연속: <span className="font-bold text-amber-600">{child.longestStreak}일</span></span>
              <span className="text-gray-500">현재 연속: <span className="font-bold text-orange-600">{child.streak}일</span></span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
