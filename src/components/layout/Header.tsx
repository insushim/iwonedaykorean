'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Coins,
  User,
  Home,
  BookOpen,
  ClipboardList,
  Trophy,
} from 'lucide-react';
import StreakCounter from '@/components/gamification/StreakCounter';
import XPBar from '@/components/gamification/XPBar';

interface HeaderProps {
  isLoggedIn?: boolean;
  level?: number;
  levelTitle?: string;
  currentXP?: number;
  requiredXP?: number;
  streak?: number;
  streakActive?: boolean;
  coins?: number;
  avatarUrl?: string;
  onProfileClick?: () => void;
  onNavigate?: (path: string) => void;
  className?: string;
}

const mobileNavItems = [
  { label: '홈', icon: Home, path: '/' },
  { label: '학습', icon: BookOpen, path: '/learn' },
  { label: '오답노트', icon: ClipboardList, path: '/wrong-notes' },
  { label: '업적', icon: Trophy, path: '/achievements' },
  { label: '프로필', icon: User, path: '/profile' },
];

export default function Header({
  isLoggedIn = false,
  level = 1,
  levelTitle,
  currentXP = 0,
  requiredXP = 1000,
  streak = 0,
  streakActive = false,
  coins = 0,
  onProfileClick,
  onNavigate,
  className = '',
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 ${className}`}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-extrabold text-[#4F46E5]">
            하루국어
          </span>
        </div>

        {/* Center: XP bar (desktop, logged in) */}
        {isLoggedIn && (
          <div className="hidden md:flex flex-1 max-w-xs">
            <XPBar
              currentXP={currentXP}
              requiredXP={requiredXP}
              level={level}
              levelTitle={levelTitle}
              className="w-full"
            />
          </div>
        )}

        {/* Right: Streak, coins, profile (desktop) */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <StreakCounter streak={streak} isActive={streakActive} />

            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
              <Coins size={18} className="text-[#F59E0B]" />
              <span className="tabular-nums">{coins.toLocaleString()}</span>
            </div>

            <button
              onClick={onProfileClick}
              className="w-9 h-9 rounded-full bg-[#4F46E5]/10 flex items-center justify-center hover:bg-[#4F46E5]/20 transition-colors cursor-pointer"
              aria-label="프로필"
            >
              <User size={18} className="text-[#4F46E5]" />
            </button>
          </div>
        )}

        {/* Mobile: Hamburger */}
        <div className="md:hidden flex items-center gap-3">
          {isLoggedIn && (
            <StreakCounter streak={streak} isActive={streakActive} />
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="메뉴"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
          >
            {isLoggedIn && (
              <div className="px-4 py-3 border-b border-gray-50">
                <XPBar
                  currentXP={currentXP}
                  requiredXP={requiredXP}
                  level={level}
                  levelTitle={levelTitle}
                />
                <div className="flex items-center gap-1.5 mt-2 text-sm font-bold text-gray-700">
                  <Coins size={16} className="text-[#F59E0B]" />
                  <span>{coins.toLocaleString()} 코인</span>
                </div>
              </div>
            )}
            <nav className="py-2">
              {mobileNavItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate?.(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <item.icon size={20} className="text-gray-500" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
