'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  BookOpen,
  ClipboardList,
  Trophy,
  User,
} from 'lucide-react';

interface BottomNavProps {
  activeItem?: string;
  onNavigate?: (path: string) => void;
  className?: string;
}

const navItems = [
  { id: 'home', label: '홈', icon: Home, path: '/' },
  { id: 'learn', label: '학습', icon: BookOpen, path: '/learn' },
  { id: 'wrong-notes', label: '오답노트', icon: ClipboardList, path: '/wrong-notes' },
  { id: 'achievements', label: '업적', icon: Trophy, path: '/achievements' },
  { id: 'profile', label: '프로필', icon: User, path: '/profile' },
];

export default function BottomNav({
  activeItem = 'home',
  onNavigate,
  className = '',
}: BottomNavProps) {
  return (
    <nav
      className={`
        fixed bottom-0 left-0 right-0 z-40
        bg-white border-t border-gray-200
        md:hidden
        ${className}
      `}
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = item.id === activeItem;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.path)}
              className="relative flex flex-col items-center justify-center gap-0.5 w-16 py-1 cursor-pointer"
              aria-label={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-0.5 w-8 h-1 rounded-full bg-[#4F46E5]"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
              <item.icon
                size={22}
                className={`transition-colors ${
                  isActive ? 'text-[#4F46E5]' : 'text-gray-400'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] font-semibold transition-colors ${
                  isActive ? 'text-[#4F46E5]' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
