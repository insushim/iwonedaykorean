'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Medal, Award, Flame, Trophy, ChevronDown } from 'lucide-react';
import Card, { CardBody } from '@/components/ui/Card';
import { useAuthStore } from '@/store/useAuthStore';
import type { LeaderboardEntry, Grade } from '@/types';

type PeriodTab = 'weekly' | 'monthly';

const mockLeaderboard: LeaderboardEntry[] = [
  { uid: 'user-001', displayName: '국어왕서연', avatarId: 'cat', grade: 3, level: 12, xp: 4200, streak: 32, totalDaysCompleted: 45, rank: 1, weeklyXp: 580 },
  { uid: 'user-002', displayName: '독서소년민준', avatarId: 'dog', grade: 3, level: 11, xp: 3900, streak: 28, totalDaysCompleted: 40, rank: 2, weeklyXp: 520 },
  { uid: 'user-003', displayName: '문학소녀지유', avatarId: 'rabbit', grade: 4, level: 10, xp: 3600, streak: 21, totalDaysCompleted: 38, rank: 3, weeklyXp: 490 },
  { uid: 'user-004', displayName: '꼼꼼하은', avatarId: 'bear', grade: 3, level: 9, xp: 3100, streak: 18, totalDaysCompleted: 35, rank: 4, weeklyXp: 450 },
  { uid: 'mock-user-001', displayName: '하루학생', avatarId: 'default-cat', grade: 3, level: 5, xp: 1250, streak: 7, totalDaysCompleted: 23, rank: 5, weeklyXp: 380 },
  { uid: 'user-005', displayName: '열공예준', avatarId: 'penguin', grade: 3, level: 8, xp: 2800, streak: 15, totalDaysCompleted: 32, rank: 6, weeklyXp: 350 },
  { uid: 'user-006', displayName: '책벌레다은', avatarId: 'cat', grade: 4, level: 7, xp: 2500, streak: 12, totalDaysCompleted: 28, rank: 7, weeklyXp: 320 },
  { uid: 'user-007', displayName: '문법박사시우', avatarId: 'dragon', grade: 3, level: 6, xp: 2200, streak: 10, totalDaysCompleted: 25, rank: 8, weeklyXp: 290 },
  { uid: 'user-008', displayName: '호기심하린', avatarId: 'unicorn', grade: 3, level: 5, xp: 1900, streak: 8, totalDaysCompleted: 20, rank: 9, weeklyXp: 260 },
  { uid: 'user-009', displayName: '즐공이서', avatarId: 'cat', grade: 4, level: 4, xp: 1600, streak: 5, totalDaysCompleted: 15, rank: 10, weeklyXp: 230 },
];

const avatarEmojis: Record<string, string> = {
  cat: '&#128049;',
  'default-cat': '&#128049;',
  dog: '&#128054;',
  rabbit: '&#128048;',
  bear: '&#128059;',
  penguin: '&#128039;',
  dragon: '&#128050;',
  unicorn: '&#129412;',
};

const rankColors = ['', 'from-amber-400 to-amber-500', 'from-gray-300 to-gray-400', 'from-amber-600 to-amber-700'];
const rankIcons = [null, <Crown key="1" className="w-5 h-5 text-white" />, <Medal key="2" className="w-5 h-5 text-white" />, <Award key="3" className="w-5 h-5 text-white" />];

export default function RankingPage() {
  const user = useAuthStore((s) => s.user);
  const [period, setPeriod] = useState<PeriodTab>('weekly');
  const [gradeFilter, setGradeFilter] = useState<Grade | 'all'>('all');

  const filteredLeaderboard = gradeFilter === 'all'
    ? mockLeaderboard
    : mockLeaderboard.filter((e) => e.grade === gradeFilter);

  const top3 = filteredLeaderboard.slice(0, 3);
  const rest = filteredLeaderboard.slice(3);

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white px-4 pt-4 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/dashboard" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-xl font-bold">순위표</h1>
          </div>

          {/* Period Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setPeriod('weekly')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                period === 'weekly' ? 'bg-white text-indigo-600' : 'bg-white/10 text-white/80'
              }`}
            >
              주간
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                period === 'monthly' ? 'bg-white text-indigo-600' : 'bg-white/10 text-white/80'
              }`}
            >
              월간
            </button>
          </div>

          {/* Grade Filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setGradeFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                gradeFilter === 'all' ? 'bg-white text-indigo-600' : 'bg-white/10 text-white/70'
              }`}
            >
              전체
            </button>
            {([1, 2, 3, 4, 5, 6] as Grade[]).map((grade) => (
              <button
                key={grade}
                onClick={() => setGradeFilter(grade)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  gradeFilter === grade ? 'bg-white text-indigo-600' : 'bg-white/10 text-white/70'
                }`}
              >
                {grade}학년
              </button>
            ))}
          </div>

          {/* Top 3 Podium */}
          {top3.length >= 3 && (
            <div className="flex items-end justify-center gap-3 mt-6">
              {/* 2nd Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center flex-1"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-lg mb-1">
                  <span className="text-2xl" dangerouslySetInnerHTML={{ __html: avatarEmojis[top3[1].avatarId] || '&#128049;' }} />
                </div>
                <p className="text-xs font-bold text-white truncate">{top3[1].displayName}</p>
                <p className="text-[10px] text-indigo-200">Lv.{top3[1].level}</p>
                <div className="bg-white/10 rounded-t-xl mt-1 py-3 px-2">
                  <Medal className="w-4 h-4 text-gray-300 mx-auto" />
                  <p className="text-xs font-bold text-white mt-0.5">{top3[1].weeklyXp} XP</p>
                </div>
              </motion.div>

              {/* 1st Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center flex-1"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-xl mb-1 ring-4 ring-amber-300/50">
                  <span className="text-3xl" dangerouslySetInnerHTML={{ __html: avatarEmojis[top3[0].avatarId] || '&#128049;' }} />
                </div>
                <p className="text-sm font-bold text-white truncate">{top3[0].displayName}</p>
                <p className="text-[10px] text-indigo-200">Lv.{top3[0].level}</p>
                <div className="bg-white/10 rounded-t-xl mt-1 py-4 px-2">
                  <Crown className="w-5 h-5 text-amber-400 mx-auto" />
                  <p className="text-sm font-bold text-white mt-0.5">{top3[0].weeklyXp} XP</p>
                </div>
              </motion.div>

              {/* 3rd Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center flex-1"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-lg mb-1">
                  <span className="text-2xl" dangerouslySetInnerHTML={{ __html: avatarEmojis[top3[2].avatarId] || '&#128049;' }} />
                </div>
                <p className="text-xs font-bold text-white truncate">{top3[2].displayName}</p>
                <p className="text-[10px] text-indigo-200">Lv.{top3[2].level}</p>
                <div className="bg-white/10 rounded-t-xl mt-1 py-2 px-2">
                  <Award className="w-4 h-4 text-amber-600 mx-auto" />
                  <p className="text-xs font-bold text-white mt-0.5">{top3[2].weeklyXp} XP</p>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Rest of Leaderboard */}
      <div className="max-w-lg mx-auto px-4 mt-4">
        <div className="space-y-2">
          {rest.map((entry, index) => {
            const isCurrentUser = entry.uid === user?.uid;

            return (
              <motion.div
                key={entry.uid}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={isCurrentUser ? 'ring-2 ring-indigo-500' : ''}>
                  <CardBody className="p-3">
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      <span className="w-8 text-center text-sm font-bold text-gray-400">
                        {entry.rank}
                      </span>

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center shrink-0">
                        <span className="text-xl" dangerouslySetInnerHTML={{ __html: avatarEmojis[entry.avatarId] || '&#128049;' }} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={`text-sm font-bold truncate ${isCurrentUser ? 'text-indigo-600' : 'text-gray-900'}`}>
                            {entry.displayName}
                          </p>
                          {isCurrentUser && (
                            <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[10px] font-bold shrink-0">
                              나
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <span>Lv.{entry.level}</span>
                          <span className="flex items-center gap-0.5">
                            <Flame className="w-3 h-3 text-orange-400" />
                            {entry.streak}일
                          </span>
                        </div>
                      </div>

                      {/* XP */}
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-indigo-600">{entry.weeklyXp}</p>
                        <p className="text-[10px] text-gray-400">XP</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
