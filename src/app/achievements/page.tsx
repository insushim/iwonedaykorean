'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Trophy, Flame, Target, Star, Sparkles } from 'lucide-react';
import Card, { CardBody } from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { useAuthStore } from '@/store/useAuthStore';
import { ACHIEVEMENTS } from '@/data/gamification';
import type { Achievement } from '@/types';

type CategoryTab = 'all' | 'streak' | 'accuracy' | 'completion' | 'special';

const categoryTabs: { key: CategoryTab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'streak', label: '연속학습' },
  { key: 'accuracy', label: '정확도' },
  { key: 'completion', label: '완료' },
  { key: 'special', label: '특별' },
];

const categoryIcons: Record<string, React.ReactNode> = {
  streak: <Flame className="w-6 h-6" />,
  accuracy: <Target className="w-6 h-6" />,
  completion: <Trophy className="w-6 h-6" />,
  special: <Star className="w-6 h-6" />,
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  streak: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
  accuracy: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
  completion: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
  special: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
};

function AchievementCard({ achievement, unlocked }: { achievement: Achievement; unlocked: boolean }) {
  const colors = categoryColors[achievement.category] || categoryColors.special;

  return (
    <motion.div
      whileHover={unlocked ? { scale: 1.02 } : {}}
      className={`p-4 rounded-2xl border-2 transition-all ${
        unlocked
          ? `${colors.bg} ${colors.border}`
          : 'bg-gray-100 border-gray-200 opacity-70'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          unlocked ? `${colors.bg} ${colors.text}` : 'bg-gray-200 text-gray-400'
        }`}>
          {unlocked ? (
            <span className="text-2xl">{achievement.icon}</span>
          ) : (
            <Lock className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-bold ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
            {unlocked ? achievement.name : '???'}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            {unlocked ? achievement.description : `조건: ${achievement.condition.type} >= ${achievement.condition.value}`}
          </p>
          {unlocked && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-amber-600 font-medium flex items-center gap-0.5">
                <Sparkles className="w-3 h-3" />
                +{achievement.xpReward} XP
              </span>
              <span className="text-xs text-amber-600 font-medium">
                +{achievement.coinReward} 코인
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function AchievementsPage() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');

  const userBadges = user?.badges || [];

  const filteredAchievements = activeTab === 'all'
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter((a) => a.category === activeTab);

  const unlockedCount = ACHIEVEMENTS.filter((a) => userBadges.includes(a.id)).length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/dashboard" className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">업적</h1>
              <p className="text-xs text-gray-500">{unlockedCount}/{totalCount} 달성</p>
            </div>
          </div>

          <ProgressBar
            value={(unlockedCount / totalCount) * 100}
            color="accent"
            size="sm"
            showLabel
          />

          {/* Category Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {categoryTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4">
        <div className="grid grid-cols-1 gap-3">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AchievementCard
                achievement={achievement}
                unlocked={userBadges.includes(achievement.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
