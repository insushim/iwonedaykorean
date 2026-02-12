import React from 'react';

type CardVariant = 'default' | 'elevated' | 'outlined';

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
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
  default: 'bg-white shadow-md',
  elevated: 'bg-white shadow-xl',
  outlined: 'bg-white border-2 border-gray-200',
};

export default function Card({
  variant = 'default',
  className = '',
  children,
}: CardProps) {
  return (
    <div
      className={`rounded-2xl overflow-hidden ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ className = '', children }: CardBodyProps) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}

export function CardFooter({ className = '', children }: CardFooterProps) {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-100 bg-gray-50/50 ${className}`}
    >
      {children}
    </div>
  );
}
