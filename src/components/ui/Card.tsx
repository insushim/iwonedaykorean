import React from "react";

type CardVariant = "default" | "elevated" | "outlined" | "glass" | "gradient";

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  onClick?: () => void;
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-white border border-gray-100 shadow-sm",
  elevated:
    "bg-white border border-gray-100/80 shadow-md shadow-gray-900/[0.04]",
  outlined: "bg-white border-2 border-gray-200",
  glass: "glass-card",
  gradient:
    "bg-gradient-to-br from-white to-gray-50/80 border border-gray-100/50 shadow-md",
};

export default function Card({
  variant = "default",
  className = "",
  children,
  hover = true,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl overflow-hidden transition-all duration-200 ${variantClasses[variant]} ${hover ? "card-lift" : ""} ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }: CardHeaderProps) {
  return (
    <div className={`px-5 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ className = "", children }: CardBodyProps) {
  return <div className={`px-5 py-5 ${className}`}>{children}</div>;
}

export function CardFooter({ className = "", children }: CardFooterProps) {
  return (
    <div
      className={`px-5 py-4 border-t border-gray-50 bg-gray-50/30 ${className}`}
    >
      {children}
    </div>
  );
}
