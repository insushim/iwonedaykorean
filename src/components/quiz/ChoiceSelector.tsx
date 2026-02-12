'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { Choice } from '@/types';

interface ChoiceSelectorProps {
  choices: Choice[];
  selectedAnswer?: number;
  correctAnswer?: number;
  isChecked: boolean;
  onSelect: (choiceNumber: number) => void;
  className?: string;
}

function getChoiceState(
  choiceNumber: number,
  selectedAnswer?: number,
  correctAnswer?: number,
  isChecked?: boolean
): 'default' | 'selected' | 'correct' | 'wrong' | 'missed-correct' {
  if (!isChecked) {
    return choiceNumber === selectedAnswer ? 'selected' : 'default';
  }
  if (choiceNumber === correctAnswer && choiceNumber === selectedAnswer) {
    return 'correct';
  }
  if (choiceNumber === selectedAnswer && choiceNumber !== correctAnswer) {
    return 'wrong';
  }
  if (choiceNumber === correctAnswer) {
    return 'missed-correct';
  }
  return 'default';
}

const stateClasses: Record<string, string> = {
  default:
    'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800',
  selected:
    'bg-[#4F46E5]/5 border-[#4F46E5] text-[#4F46E5] ring-1 ring-[#4F46E5]/20',
  correct:
    'bg-emerald-50 border-emerald-400 text-emerald-800 ring-1 ring-emerald-200',
  wrong:
    'bg-red-50 border-red-400 text-red-800 ring-1 ring-red-200',
  'missed-correct':
    'bg-emerald-50 border-emerald-400 text-emerald-800 ring-1 ring-emerald-200',
};

const numberLabels = ['①', '②', '③', '④'];

export default function ChoiceSelector({
  choices,
  selectedAnswer,
  correctAnswer,
  isChecked,
  onSelect,
  className = '',
}: ChoiceSelectorProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {choices.map((choice) => {
        const state = getChoiceState(
          choice.number,
          selectedAnswer,
          correctAnswer,
          isChecked
        );
        const isClickable = !isChecked;

        return (
          <motion.button
            key={choice.number}
            onClick={() => isClickable && onSelect(choice.number)}
            className={`
              flex items-center gap-3 min-h-[48px] px-4 py-3
              rounded-xl border-2 text-left transition-colors
              ${stateClasses[state]}
              ${isClickable ? 'cursor-pointer' : 'cursor-default'}
            `.trim()}
            disabled={isChecked}
            animate={
              isChecked && state === 'correct'
                ? { scale: [1, 1.03, 1] }
                : isChecked && state === 'wrong'
                  ? { x: [0, -6, 6, -4, 4, 0] }
                  : {}
            }
            transition={
              state === 'correct'
                ? { type: 'spring', damping: 10, stiffness: 300 }
                : { duration: 0.4 }
            }
            whileTap={isClickable ? { scale: 0.98 } : undefined}
          >
            <span className="text-lg font-bold shrink-0 w-7 text-center">
              {numberLabels[choice.number - 1]}
            </span>
            <span className="flex-1 text-[15px] leading-relaxed">
              {choice.text}
            </span>
            {isChecked && (state === 'correct' || state === 'missed-correct') && (
              <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check size={14} className="text-white" strokeWidth={3} />
              </span>
            )}
            {isChecked && state === 'wrong' && (
              <span className="shrink-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                <X size={14} className="text-white" strokeWidth={3} />
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
