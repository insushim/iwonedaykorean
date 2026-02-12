'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import { BookOpen, Feather, PenLine } from 'lucide-react';
import type { PassageType, Grade } from '@/types';

interface PassageReaderProps {
  title: string;
  content: string;
  type: PassageType;
  grade: Grade;
  author?: string;
  source?: string;
  className?: string;
}

const typeConfig: Record<
  PassageType,
  {
    label: string;
    variant: 'info' | 'success' | 'warning';
    icon: React.ReactNode;
  }
> = {
  nonfiction: {
    label: '비문학',
    variant: 'info',
    icon: <BookOpen size={14} />,
  },
  fiction: {
    label: '문학',
    variant: 'success',
    icon: <PenLine size={14} />,
  },
  poetry: {
    label: '시',
    variant: 'warning',
    icon: <Feather size={14} />,
  },
};

function getFontSize(grade: Grade): string {
  if (grade <= 2) return 'text-[20px]';
  if (grade <= 4) return 'text-[18px]';
  return 'text-[16px]';
}

function getLineHeight(grade: Grade): string {
  if (grade <= 2) return 'leading-[2]';
  if (grade <= 4) return 'leading-[1.9]';
  return 'leading-[1.8]';
}

function shouldShowLineNumbers(grade: Grade): boolean {
  return grade >= 3;
}

export default function PassageReader({
  title,
  content,
  type,
  grade,
  author,
  source,
  className = '',
}: PassageReaderProps) {
  const config = typeConfig[type];
  const showLineNumbers = shouldShowLineNumbers(grade);
  const isPoetry = type === 'poetry';
  const lines = content.split('\n');

  return (
    <div
      className={`bg-white rounded-2xl shadow-md overflow-hidden ${className}`}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Badge variant={config.variant} size="sm" icon={config.icon}>
            {config.label}
          </Badge>
          <h3 className="font-bold text-gray-900 text-base">{title}</h3>
        </div>
        {author && (
          <span className="text-sm text-gray-500">{author}</span>
        )}
      </div>

      {/* Content area */}
      <div className="p-5 max-h-[400px] overflow-y-auto">
        {isPoetry ? (
          <div
            className={`${getFontSize(grade)} ${getLineHeight(grade)} text-gray-800 text-center whitespace-pre-wrap font-serif`}
          >
            {lines.map((line, i) => (
              <div key={i} className="flex items-start justify-center gap-3">
                {showLineNumbers && (
                  <span className="text-xs text-gray-300 w-6 text-right shrink-0 mt-1 select-none font-mono">
                    {i + 1}
                  </span>
                )}
                <span className={line.trim() === '' ? 'h-4' : ''}>
                  {line}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${getFontSize(grade)} ${getLineHeight(grade)} text-gray-800`}>
            {showLineNumbers ? (
              <div className="space-y-0">
                {lines.map((line, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xs text-gray-300 w-6 text-right shrink-0 mt-1.5 select-none font-mono">
                      {i + 1}
                    </span>
                    <span className={line.trim() === '' ? 'h-4' : ''}>
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{content}</p>
            )}
          </div>
        )}
      </div>

      {/* Source footer */}
      {source && (
        <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100">
          <span className="text-xs text-gray-400">출처: {source}</span>
        </div>
      )}
    </div>
  );
}
