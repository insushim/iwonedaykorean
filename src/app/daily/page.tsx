'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, BookOpen, Feather, Music, SpellCheck, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardBody } from '@/components/ui/Card';
import { useAuthStore } from '@/store/useAuthStore';
import { formatDate, generateSessionId } from '@/lib/utils';

const studyStructure = [
  { icon: <BookOpen className="w-5 h-5 text-indigo-600" />, label: '비문학', desc: '1지문 + 2~3문제', color: 'bg-indigo-50 border-indigo-200' },
  { icon: <Feather className="w-5 h-5 text-emerald-600" />, label: '문학', desc: '1지문 + 2~3문제', color: 'bg-emerald-50 border-emerald-200' },
  { icon: <Music className="w-5 h-5 text-purple-600" />, label: '시', desc: '1지문 + 2문제', color: 'bg-purple-50 border-purple-200' },
  { icon: <SpellCheck className="w-5 h-5 text-amber-600" />, label: '문법', desc: '2~4문제', color: 'bg-amber-50 border-amber-200' },
];

export default function DailyPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const todayFormatted = formatDate(today, 'full');

  const handleStartStudy = async () => {
    setLoading(true);

    try {
      const sessionId = generateSessionId(user?.uid);
      router.push(`/daily/${sessionId}`);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 flex flex-col items-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Date */}
        <div className="flex items-center justify-center gap-2 text-gray-500 mb-6">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">{todayFormatted}</span>
        </div>

        {/* HaruCat Cheering */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="inline-block"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center mx-auto shadow-xl">
              <span className="text-6xl">&#128049;</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="mt-6 text-2xl font-extrabold text-gray-900">
              오늘의 학습 시작!
            </h1>
            <p className="mt-2 text-gray-500">
              {user?.displayName || '학생'}아, 오늘도 화이팅!
            </p>
          </motion.div>
        </div>

        {/* Study Structure Preview */}
        <Card variant="elevated" className="mb-6">
          <CardBody>
            <h3 className="text-sm font-bold text-gray-700 mb-3">오늘의 학습 구성</h3>
            <div className="space-y-2.5">
              {studyStructure.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index + 0.4 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${item.color}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-xl text-center">
              <p className="text-xs text-gray-500">
                예상 소요 시간: <span className="font-bold text-gray-700">약 15분</span>
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={handleStartStudy}
            loading={loading}
            size="lg"
            className="w-full"
          >
            <Play className="w-5 h-5" />
            학습 시작하기
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
