import React from 'react';
import Badge from '@/components/ui/Badge';

interface QuestionCardProps {
  questionText: string;
  questionNumber: number;
  totalQuestions: number;
  category?: string;
  className?: string;
}

const categoryConfig: Record<string, { label: string; variant: 'info' | 'success' | 'warning' | 'default' }> = {
  comprehension: { label: '내용 이해', variant: 'info' },
  inference: { label: '추론', variant: 'success' },
  vocabulary: { label: '어휘', variant: 'warning' },
  grammar: { label: '문법', variant: 'default' },
  expression: { label: '표현', variant: 'info' },
  structure: { label: '구조', variant: 'success' },
  main_idea: { label: '중심 내용', variant: 'warning' },
  detail: { label: '세부 내용', variant: 'default' },
};

export default function QuestionCard({
  questionText,
  questionNumber,
  totalQuestions,
  category,
  className = '',
}: QuestionCardProps) {
  const catConfig = category ? categoryConfig[category] : null;

  return (
    <div
      className={`bg-white rounded-2xl shadow-md p-5 ${className}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm font-bold text-[#4F46E5] bg-[#4F46E5]/10 px-3 py-1 rounded-full">
          문제 {questionNumber}/{totalQuestions}
        </span>
        {catConfig && (
          <Badge variant={catConfig.variant} size="sm">
            {catConfig.label}
          </Badge>
        )}
      </div>
      <p className="text-gray-900 text-[17px] leading-relaxed font-medium whitespace-pre-wrap">
        {questionText}
      </p>
    </div>
  );
}
