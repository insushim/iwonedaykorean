'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger: boolean;
}

export default function Confetti({ trigger }: ConfettiProps) {
  const prevTriggerRef = useRef(false);

  useEffect(() => {
    if (trigger && !prevTriggerRef.current) {
      const duration = 2000;
      const end = Date.now() + duration;

      const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
    prevTriggerRef.current = trigger;
  }, [trigger]);

  return null;
}
