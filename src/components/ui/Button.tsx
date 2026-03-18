"use client";

import React from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]",
  secondary:
    "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-[0.98]",
  outline:
    "border-2 border-indigo-200 text-indigo-600 bg-white hover:bg-indigo-50 hover:border-indigo-300 active:scale-[0.98]",
  ghost:
    "text-indigo-600 bg-transparent hover:bg-indigo-50 active:scale-[0.98]",
  danger:
    "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md shadow-red-500/20 hover:shadow-lg active:scale-[0.98]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-sm rounded-xl gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3.5 text-base rounded-2xl gap-2.5",
};

const spinnerSizes: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 20,
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-2
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
        ${className}
      `.trim()}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Loader2 size={spinnerSizes[size]} className="animate-spin shrink-0" />
      )}
      {children}
    </button>
  );
}
