'use client';

import React from 'react';
import { motion } from 'framer-motion';
import LevelBadge from './LevelBadge';

interface XPBarProps {
  currentXP: number;
  requiredXP: number;
  level: number;
  levelTitle?: string;
  className?: string;
}

export default function XPBar({
  currentXP,
  requiredXP,
  level,
  levelTitle,
  className = '',
}: XPBarProps) {
  const progress = requiredXP > 0 ? Math.min(100, (currentXP / requiredXP) * 100) : 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LevelBadge level={level} title={levelTitle} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 80,
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 font-medium">
          {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP
        </p>
      </div>
    </div>
  );
}
