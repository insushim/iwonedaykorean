'use client';

import React from 'react';
import { motion } from 'framer-motion';

type ProgressColor = 'primary' | 'secondary' | 'accent';
type ProgressSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  value: number;
  color?: ProgressColor;
  size?: ProgressSize;
  showLabel?: boolean;
  className?: string;
}

const colorClasses: Record<ProgressColor, string> = {
  primary: 'bg-[#4F46E5]',
  secondary: 'bg-[#10B981]',
  accent: 'bg-[#F59E0B]',
};

const trackColorClasses: Record<ProgressColor, string> = {
  primary: 'bg-[#4F46E5]/10',
  secondary: 'bg-[#10B981]/10',
  accent: 'bg-[#F59E0B]/10',
};

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-3',
  lg: 'h-5',
};

export default function ProgressBar({
  value,
  color = 'primary',
  size = 'md',
  showLabel = false,
  className = '',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-gray-600">진행률</span>
          <span className="text-sm font-bold text-gray-800">
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}
      <div
        className={`w-full rounded-full overflow-hidden ${trackColorClasses[color]} ${sizeClasses[size]}`}
      >
        <motion.div
          className={`h-full rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 100,
          }}
        />
      </div>
    </div>
  );
}
