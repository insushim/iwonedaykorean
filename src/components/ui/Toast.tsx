'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const toastConfig: Record<
  ToastType,
  { icon: React.ReactNode; bgClass: string; borderClass: string; textClass: string }
> = {
  success: {
    icon: <CheckCircle size={20} />,
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-800',
  },
  error: {
    icon: <XCircle size={20} />,
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200',
    textClass: 'text-red-800',
  },
  warning: {
    icon: <AlertTriangle size={20} />,
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-800',
  },
  info: {
    icon: <Info size={20} />,
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-800',
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      counterRef.current += 1;
      const id = `toast-${counterRef.current}-${Date.now()}`;
      const newToast: Toast = { id, type, message };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 3000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const config = toastConfig[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={`
                  pointer-events-auto flex items-center gap-3
                  px-4 py-3 rounded-xl border shadow-lg
                  min-w-[280px] max-w-[400px]
                  ${config.bgClass} ${config.borderClass} ${config.textClass}
                `}
              >
                <span className="shrink-0">{config.icon}</span>
                <p className="flex-1 text-sm font-medium">{toast.message}</p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 p-0.5 rounded hover:bg-black/5 transition-colors cursor-pointer"
                  aria-label="닫기"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
