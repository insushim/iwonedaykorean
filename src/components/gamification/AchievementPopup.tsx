'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Coins } from 'lucide-react';
import Button from '@/components/ui/Button';
import Confetti from './Confetti';
import type { Achievement } from '@/types';

interface AchievementPopupProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const popupVariants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    rotate: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring' as const,
      damping: 15,
      stiffness: 200,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    rotate: 10,
    transition: { duration: 0.2 },
  },
};

export default function AchievementPopup({
  achievement,
  isOpen,
  onClose,
}: AchievementPopupProps) {
  if (!achievement) return null;

  return (
    <>
      <Confetti trigger={isOpen} />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="absolute inset-0 bg-black/60"
              variants={backdropVariants}
              onClick={onClose}
            />
            <motion.div
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden text-center"
              variants={popupVariants}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10 cursor-pointer"
                aria-label="닫기"
              >
                <X size={20} />
              </button>

              {/* Gradient header */}
              <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] px-6 pt-8 pb-6">
                <motion.p
                  className="text-amber-300 text-sm font-bold mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  축하합니다!
                </motion.p>
                <motion.div
                  className="text-6xl mb-3"
                  animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                  }}
                >
                  {achievement.icon}
                </motion.div>
                <h2 className="text-xl font-bold text-white">
                  {achievement.name}
                </h2>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                  {achievement.description}
                </p>

                {/* Rewards */}
                <div className="flex items-center justify-center gap-6 mb-5">
                  {achievement.xpReward > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Star
                        size={18}
                        className="text-[#4F46E5]"
                        fill="#4F46E5"
                      />
                      <span className="text-sm font-bold text-gray-800">
                        +{achievement.xpReward} XP
                      </span>
                    </div>
                  )}
                  {achievement.coinReward > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Coins size={18} className="text-[#F59E0B]" />
                      <span className="text-sm font-bold text-gray-800">
                        +{achievement.coinReward} 코인
                      </span>
                    </div>
                  )}
                </div>

                <Button variant="primary" size="lg" onClick={onClose} className="w-full">
                  확인
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
