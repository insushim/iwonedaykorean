import React from 'react';

interface LevelBadgeProps {
  level: number;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getTierColors(level: number): {
  bg: string;
  border: string;
  text: string;
  ring: string;
} {
  if (level >= 50) {
    return {
      bg: 'bg-gradient-to-br from-yellow-400 to-amber-500',
      border: 'border-yellow-300',
      text: 'text-white',
      ring: 'ring-yellow-200',
    };
  }
  if (level >= 30) {
    return {
      bg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      border: 'border-purple-300',
      text: 'text-white',
      ring: 'ring-purple-200',
    };
  }
  if (level >= 15) {
    return {
      bg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      border: 'border-blue-300',
      text: 'text-white',
      ring: 'ring-blue-200',
    };
  }
  if (level >= 5) {
    return {
      bg: 'bg-gradient-to-br from-emerald-400 to-green-500',
      border: 'border-emerald-300',
      text: 'text-white',
      ring: 'ring-emerald-200',
    };
  }
  return {
    bg: 'bg-gradient-to-br from-gray-300 to-gray-400',
    border: 'border-gray-200',
    text: 'text-white',
    ring: 'ring-gray-200',
  };
}

const sizeConfig: Record<string, { circle: string; text: string; titleText: string }> = {
  sm: { circle: 'w-8 h-8', text: 'text-xs', titleText: 'text-[10px]' },
  md: { circle: 'w-11 h-11', text: 'text-sm', titleText: 'text-xs' },
  lg: { circle: 'w-14 h-14', text: 'text-lg', titleText: 'text-sm' },
};

export default function LevelBadge({
  level,
  title,
  size = 'md',
  className = '',
}: LevelBadgeProps) {
  const tier = getTierColors(level);
  const sizeConf = sizeConfig[size];

  return (
    <div className={`inline-flex flex-col items-center gap-0.5 ${className}`}>
      <div
        className={`
          ${sizeConf.circle} ${tier.bg} ${tier.border} ${tier.text}
          rounded-full border-2 ring-2 ${tier.ring}
          flex items-center justify-center
          font-bold shadow-sm
          ${sizeConf.text}
        `}
      >
        {level}
      </div>
      {title && (
        <span className={`${sizeConf.titleText} font-medium text-gray-600 text-center leading-tight`}>
          {title}
        </span>
      )}
    </div>
  );
}
