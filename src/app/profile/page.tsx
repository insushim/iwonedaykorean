'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Settings, LogOut, ChevronRight, Edit3,
  Volume2, VolumeX, ShoppingBag, Users, Copy, Check,
  Flame, Trophy, Target, BookOpen,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardBody } from '@/components/ui/Card';
import { useAuthStore } from '@/store/useAuthStore';
import { getLevelProgress, getGradeLabel, getSemesterLabel, calculateAccuracy } from '@/lib/utils';
import type { Grade, Semester } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);

  const [soundOn, setSoundOn] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [editingGrade, setEditingGrade] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

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
  const accuracy = Math.round(user.stats.averageAccuracy);

  const handleLogout = async () => {
    try {
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      await signOut(auth);
    } catch {
      // Firebase not configured; proceed with local logout
    }
    clearUser();
    router.push('/');
  };

  const handleSaveName = () => {
    if (newName.trim().length >= 2) {
      setEditingName(false);
    }
  };

  const handleGenerateInviteCode = () => {
    const code = `HARU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setInviteCode(code);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white px-4 pt-4 pb-8 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-lg font-bold">프로필</h1>
            <div className="w-8" />
          </div>

          {/* Avatar & Info */}
          <div className="text-center">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="inline-block"
            >
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto shadow-xl ring-4 ring-white/30">
                <span className="text-5xl">&#128049;</span>
              </div>
            </motion.div>

            {editingName ? (
              <div className="mt-3 flex items-center justify-center gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-white/20 text-white placeholder:text-white/50 px-3 py-1.5 rounded-lg text-center text-sm outline-none focus:ring-2 focus:ring-white/50"
                  maxLength={20}
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <h2 className="text-xl font-bold">{user.displayName}</h2>
                <button
                  onClick={() => setEditingName(true)}
                  className="p-1 rounded hover:bg-white/10 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-white/70" />
                </button>
              </div>
            )}

            <p className="text-indigo-200 text-sm mt-0.5">
              Lv.{levelInfo.currentLevel} {levelInfo.title}
            </p>
            <p className="text-indigo-200 text-xs mt-0.5">
              {getGradeLabel(user.grade)} {getSemesterLabel(user.semester)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 space-y-3">
        {/* Stats Overview */}
        <Card variant="elevated">
          <CardBody>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="w-8 h-8 mx-auto rounded-lg bg-orange-100 flex items-center justify-center mb-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <p className="text-lg font-bold text-gray-900">{user.streak}</p>
                <p className="text-[10px] text-gray-500">연속</p>
              </div>
              <div>
                <div className="w-8 h-8 mx-auto rounded-lg bg-indigo-100 flex items-center justify-center mb-1">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                </div>
                <p className="text-lg font-bold text-gray-900">{user.totalDaysCompleted}</p>
                <p className="text-[10px] text-gray-500">학습일</p>
              </div>
              <div>
                <div className="w-8 h-8 mx-auto rounded-lg bg-emerald-100 flex items-center justify-center mb-1">
                  <Target className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-lg font-bold text-gray-900">{accuracy}%</p>
                <p className="text-[10px] text-gray-500">정확도</p>
              </div>
              <div>
                <div className="w-8 h-8 mx-auto rounded-lg bg-amber-100 flex items-center justify-center mb-1">
                  <Trophy className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-lg font-bold text-gray-900">{user.badges.length}</p>
                <p className="text-[10px] text-gray-500">뱃지</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Settings */}
        <Card>
          <CardBody className="p-0">
            {/* Grade/Semester Change */}
            <button
              onClick={() => setEditingGrade(!editingGrade)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-800">학년/학기 변경</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-gray-500">{getGradeLabel(user.grade)} {getSemesterLabel(user.semester)}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>

            {editingGrade && (
              <div className="px-5 pb-3">
                <div className="grid grid-cols-6 gap-2 mb-2">
                  {([1, 2, 3, 4, 5, 6] as Grade[]).map((g) => (
                    <button
                      key={g}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        user.grade === g ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {g}학년
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {([1, 2] as Semester[]).map((s) => (
                    <button
                      key={s}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        user.semester === s ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {s}학기
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-100" />

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundOn(!soundOn)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {soundOn ? (
                  <Volume2 className="w-5 h-5 text-gray-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-800">소리</span>
              </div>
              <div className={`w-11 h-6 rounded-full transition-colors ${soundOn ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                <motion.div
                  className="w-5 h-5 rounded-full bg-white shadow mt-0.5"
                  animate={{ x: soundOn ? 22 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </button>

            <div className="border-t border-gray-100" />

            {/* Coin Shop */}
            <Link href="#" className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-800">코인 상점</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-amber-600">{user.coins} 코인</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </Link>
          </CardBody>
        </Card>

        {/* Parent Link */}
        <Card>
          <CardBody>
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-bold text-gray-800">학부모 연동</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              초대 코드를 생성하여 학부모님과 학습 현황을 공유하세요.
            </p>
            {!inviteCode ? (
              <Button variant="outline" size="sm" onClick={handleGenerateInviteCode} className="w-full">
                초대 코드 생성
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono text-gray-800 text-center">
                  {inviteCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors cursor-pointer"
                >
                  {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Logout */}
        <Button
          variant="danger"
          onClick={handleLogout}
          className="w-full"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </Button>
      </div>
    </div>
  );
}
