'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Medal, Award, Flame } from 'lucide-react';
import Card, { CardBody } from '@/components/ui/Card';
import { useAuthStore } from '@/store/useAuthStore';
import type { LeaderboardEntry, Grade } from '@/types';

type PeriodTab = 'weekly' | 'monthly';

const avatarEmojis: Record<string, string> = {
  cat: '&#128049;',
  'default-cat': '&#128049;',
  default: '&#128049;',
  dog: '&#128054;',
  rabbit: '&#128048;',
  bear: '&#128059;',
  penguin: '&#128039;',
  dragon: '&#128050;',
  unicorn: '&#129412;',
};

export default function RankingPage() {
  const user = useAuthStore((s) => s.user);
  const [period, setPeriod] = useState<PeriodTab>('weekly');
  const [gradeFilter, setGradeFilter] = useState<Grade | 'all'>('all');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ period });
    if (gradeFilter !== 'all') params.set('grade', String(gradeFilter));

    fetch(`/api/leaderboard?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.entries) {
          setLeaderboard(data.entries);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period, gradeFilter]);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

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

          {loading && (
            <div className="text-center mt-6">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            </div>
          )}

          {!loading && leaderboard.length === 0 && (
            <div className="text-center mt-6 text-indigo-200 text-sm">
              아직 참여한 학생이 없어요. 첫 번째 주인공이 되어보세요!
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
                      <span className="w-8 text-center text-sm font-bold text-gray-400">
                        {entry.rank}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center shrink-0">
                        <span className="text-xl" dangerouslySetInnerHTML={{ __html: avatarEmojis[entry.avatarId] || '&#128049;' }} />
                      </div>
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
