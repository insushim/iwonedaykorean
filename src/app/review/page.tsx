'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Feather, Music, SpellCheck, ChevronDown, ChevronUp,
  RotateCcw, CheckCircle, Filter, Calendar, ArrowLeft,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardBody } from '@/components/ui/Card';
import { useAuthStore } from '@/store/useAuthStore';
import type { WrongAnswerNote, Domain } from '@/types';

type FilterTab = 'all' | Domain;

const filterTabs: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: '전체', icon: null },
  { key: 'reading', label: '비문학', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { key: 'literature', label: '문학', icon: <Feather className="w-3.5 h-3.5" /> },
  { key: 'grammar', label: '문법', icon: <SpellCheck className="w-3.5 h-3.5" /> },
];

function WrongAnswerCard({
  note,
  onMarkReviewed,
}: {
  note: WrongAnswerNote;
  onMarkReviewed: (id: string) => void;
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  const domainConfig: Record<Domain, { color: string; bgColor: string; label: string }> = {
    reading: { color: 'text-indigo-600', bgColor: 'bg-indigo-100', label: '비문학' },
    literature: { color: 'text-emerald-600', bgColor: 'bg-emerald-100', label: '문학' },
    grammar: { color: 'text-amber-600', bgColor: 'bg-amber-100', label: '문법' },
  };

  const config = domainConfig[note.domain];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className={`mb-3 ${note.reviewed ? 'opacity-60' : ''}`}>
        <CardBody className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.bgColor} ${config.color}`}>
                {config.label}
              </span>
              <span className="text-xs text-gray-400">{note.category}</span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(note.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          {note.passageTitle && (
            <p className="text-xs text-gray-500 mb-1.5">
              지문: <span className="font-medium">{note.passageTitle}</span>
            </p>
          )}

          <p className="text-sm font-medium text-gray-800 mb-3 leading-relaxed">
            {note.question}
          </p>

          <div className="space-y-1.5 mb-3">
            <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
              <span className="text-xs font-bold text-red-500 shrink-0 mt-0.5">내 답:</span>
              <span className="text-xs text-red-600">{note.studentAnswer}</span>
            </div>
            <div className="flex items-start gap-2 p-2 bg-emerald-50 rounded-lg">
              <span className="text-xs font-bold text-emerald-500 shrink-0 mt-0.5">정답:</span>
              <span className="text-xs text-emerald-600">{note.correctAnswer}</span>
            </div>
          </div>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1 text-xs text-indigo-600 font-medium hover:text-indigo-700 cursor-pointer mb-3"
          >
            {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            해설 {showExplanation ? '숨기기' : '보기'}
          </button>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 leading-relaxed mb-3">
                  <p className="font-medium text-gray-800 mb-1">해설:</p>
                  <p>{note.explanation}</p>
                  {note.wrongExplanation && (
                    <>
                      <p className="font-medium text-gray-800 mt-2 mb-1">왜 틀렸을까요?</p>
                      <p>{note.wrongExplanation}</p>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onMarkReviewed(note.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                note.reviewed
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {note.reviewed ? '복습 완료' : '복습 완료 표시'}
            </button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

export default function ReviewPage() {
  const user = useAuthStore((s) => s.user);
  const [wrongAnswerNotes, setWrongAnswerNotes] = useState<WrongAnswerNote[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch('/api/sessions/wrong-notes')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.wrongNotes) {
          setWrongAnswerNotes(data.wrongNotes);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const markNoteReviewed = (noteId: string) => {
    setWrongAnswerNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? { ...note, reviewed: true, reviewedAt: new Date().toISOString() }
          : note
      )
    );
  };

  const filteredNotes = useMemo(() => {
    if (activeFilter === 'all') return wrongAnswerNotes;
    return wrongAnswerNotes.filter((n) => n.domain === activeFilter);
  }, [wrongAnswerNotes, activeFilter]);

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/dashboard" className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">오답 노트</h1>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === tab.key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="mt-3 text-sm text-gray-500">오답 노트를 불러오고 있어요...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="inline-block"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center mx-auto shadow-lg">
                <span className="text-5xl">&#128049;</span>
              </div>
            </motion.div>
            <h2 className="mt-4 text-lg font-bold text-emerald-600">
              오답이 없어요! 대단해요!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              학습을 계속하면서 실력을 더 키워보세요.
            </p>
          </motion.div>
        ) : (
          <div>
            <p className="text-xs text-gray-500 mb-3">
              총 {filteredNotes.length}개의 오답
            </p>
            <AnimatePresence>
              {filteredNotes.map((note) => (
                <WrongAnswerCard
                  key={note.id}
                  note={note}
                  onMarkReviewed={markNoteReviewed}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
