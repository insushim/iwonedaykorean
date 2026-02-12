'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface TimerBarProps {
  elapsedSeconds: number;
  pulse?: boolean;
  className?: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function TimerBar({
  elapsedSeconds,
  pulse = false,
  className = '',
}: TimerBarProps) {
  return (
    <motion.div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 ${className}`}
      animate={pulse ? { scale: [1, 1.05, 1] } : {}}
      transition={pulse ? { duration: 1, repeat: Infinity } : {}}
    >
      <Clock size={16} className="text-gray-500" />
      <span className="text-sm font-mono font-semibold tabular-nums">
        {formatTime(elapsedSeconds)}
      </span>
    </motion.div>
  );
}
