'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
  isActive?: boolean;
  className?: string;
}

function getFlameSize(streak: number): number {
  if (streak >= 30) return 28;
  if (streak >= 14) return 24;
  if (streak >= 7) return 22;
  return 20;
}

function getFlameColor(streak: number, isActive: boolean): string {
  if (!isActive) return 'text-gray-300';
  if (streak >= 30) return 'text-red-500';
  if (streak >= 14) return 'text-orange-500';
  if (streak >= 7) return 'text-amber-500';
  return 'text-amber-400';
}

export default function StreakCounter({
  streak,
  isActive = true,
  className = '',
}: StreakCounterProps) {
  const flameSize = getFlameSize(streak);
  const flameColor = getFlameColor(streak, isActive);

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <motion.div
        animate={
          isActive
            ? {
                scale: [1, 1.15, 1],
                rotate: [-3, 3, -3],
              }
            : {}
        }
        transition={
          isActive
            ? {
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : {}
        }
        className={flameColor}
      >
        <Flame size={flameSize} fill={isActive ? 'currentColor' : 'none'} />
      </motion.div>
      <span
        className={`text-lg font-bold tabular-nums ${
          isActive ? 'text-gray-800' : 'text-gray-400'
        }`}
      >
        {streak}
      </span>
    </div>
  );
}
