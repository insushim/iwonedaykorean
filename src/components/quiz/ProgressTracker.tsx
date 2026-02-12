'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Section {
  name: string;
  total: number;
  completed: number;
}

interface ProgressTrackerProps {
  sections: Section[];
  currentIndex?: number;
  className?: string;
}

export default function ProgressTracker({
  sections,
  currentIndex = 0,
  className = '',
}: ProgressTrackerProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center gap-1">
        {sections.map((section, index) => {
          const isCompleted = section.completed >= section.total;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex && !isCompleted;

          return (
            <React.Fragment key={section.name}>
              {/* Step indicator */}
              <div className="flex-1 flex flex-col items-center gap-1.5">
                {/* Tab button */}
                <motion.div
                  className={`
                    w-full py-2 px-2 rounded-lg text-center text-sm font-semibold
                    transition-colors
                    ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isCurrent
                          ? 'bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20'
                          : 'bg-gray-50 text-gray-400 border border-gray-100'
                    }
                  `}
                  animate={isCurrent ? { scale: [1, 1.02, 1] } : {}}
                  transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    {isCompleted && (
                      <Check size={14} className="text-emerald-600" strokeWidth={3} />
                    )}
                    <span className="truncate">{section.name}</span>
                  </div>
                </motion.div>

                {/* Progress bar under tab */}
                <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      isCompleted
                        ? 'bg-emerald-400'
                        : isCurrent
                          ? 'bg-[#4F46E5]'
                          : 'bg-gray-200'
                    }`}
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        section.total > 0
                          ? `${(section.completed / section.total) * 100}%`
                          : '0%',
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                  />
                </div>

                {/* Count */}
                <span
                  className={`text-xs font-medium ${
                    isCompleted
                      ? 'text-emerald-600'
                      : isCurrent
                        ? 'text-[#4F46E5]'
                        : 'text-gray-400'
                  }`}
                >
                  {section.completed}/{section.total}
                </span>
              </div>

              {/* Connector line */}
              {index < sections.length - 1 && (
                <div
                  className={`w-4 h-0.5 mt-[-20px] shrink-0 rounded ${
                    isCompleted ? 'bg-emerald-300' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
