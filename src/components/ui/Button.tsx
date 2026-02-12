'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#4F46E5] text-white hover:bg-[#4338CA] active:bg-[#3730A3] shadow-sm',
  secondary:
    'bg-[#10B981] text-white hover:bg-[#059669] active:bg-[#047857] shadow-sm',
  outline:
    'border-2 border-[#4F46E5] text-[#4F46E5] bg-transparent hover:bg-[#4F46E5]/5 active:bg-[#4F46E5]/10',
  ghost:
    'text-[#4F46E5] bg-transparent hover:bg-[#4F46E5]/5 active:bg-[#4F46E5]/10',
  danger:
    'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-base rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-lg rounded-xl gap-2.5',
};

const spinnerSizes: Record<ButtonSize, number> = {
  sm: 14,
  md: 18,
  lg: 22,
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:ring-offset-2
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        ${className}
      `.trim()}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Loader2
          size={spinnerSizes[size]}
          className="animate-spin shrink-0"
        />
      )}
      {children}
    </button>
  );
}
