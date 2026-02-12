'use client';

import React from 'react';
import { motion } from 'framer-motion';
import HaruCat from '@/components/character/HaruCat';
import Button from '@/components/ui/Button';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface ExplanationPanelProps {
  isCorrect: boolean;
  explanation: string;
  wrongExplanation?: string;
  onNext: () => void;
  onRetry?: () => void;
  className?: string;
}

export default function ExplanationPanel({
  isCorrect,
  explanation,
  wrongExplanation,
  onNext,
  onRetry,
  className = '',
}: ExplanationPanelProps) {
  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className={`
        rounded-2xl overflow-hidden shadow-lg
        ${isCorrect ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-orange-50 border-2 border-orange-200'}
        ${className}
      `}
    >
      {/* Header */}
      <div
        className={`px-5 py-3 ${
          isCorrect ? 'bg-emerald-100' : 'bg-orange-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <HaruCat
            emotion={isCorrect ? 'celebrating' : 'sad'}
            size="sm"
          />
          <div>
            <h3
              className={`text-lg font-bold ${
                isCorrect ? 'text-emerald-800' : 'text-orange-800'
              }`}
            >
              {isCorrect ? '정답이에요!' : '아쉬워요!'}
            </h3>
            <p
              className={`text-sm ${
                isCorrect ? 'text-emerald-600' : 'text-orange-600'
              }`}
            >
              {isCorrect
                ? '잘했어요! 계속 이렇게 풀어보세요.'
                : '괜찮아요, 다음에는 맞출 수 있어요!'}
            </p>
          </div>
        </div>
      </div>

      {/* Explanation body */}
      <div className="px-5 py-4 space-y-3">
        {/* Wrong explanation first if applicable */}
        {!isCorrect && wrongExplanation && (
          <div className="bg-white/70 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-orange-700 mb-1">
              선택한 답이 틀린 이유
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {wrongExplanation}
            </p>
          </div>
        )}

        <div className="bg-white/70 rounded-xl px-4 py-3">
          <p
            className={`text-sm font-semibold mb-1 ${
              isCorrect ? 'text-emerald-700' : 'text-indigo-700'
            }`}
          >
            {isCorrect ? '풀이' : '정답 풀이'}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {explanation}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-5 py-4 flex items-center gap-3 justify-end">
        {!isCorrect && onRetry && (
          <Button variant="outline" size="md" onClick={onRetry}>
            <RotateCcw size={16} />
            다시 풀기
          </Button>
        )}
        <Button
          variant={isCorrect ? 'secondary' : 'primary'}
          size="md"
          onClick={onNext}
        >
          다음 문제
          <ArrowRight size={16} />
        </Button>
      </div>
    </motion.div>
  );
}
