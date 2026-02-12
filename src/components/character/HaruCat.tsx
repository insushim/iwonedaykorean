'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

type Emotion = 'default' | 'cheering' | 'celebrating' | 'thinking' | 'sad';
type CatSize = 'sm' | 'md' | 'lg';

interface HaruCatProps {
  emotion?: Emotion;
  size?: CatSize;
  className?: string;
}

const sizeMap: Record<CatSize, number> = {
  sm: 80,
  md: 140,
  lg: 200,
};

export default function HaruCat({
  emotion = 'default',
  size = 'md',
  className = '',
}: HaruCatProps) {
  const px = sizeMap[size];
  const blinkControls = useAnimation();

  useEffect(() => {
    const blinkLoop = async () => {
      while (true) {
        await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1500));
        await blinkControls.start({
          scaleY: 0.1,
          transition: { duration: 0.08 },
        });
        await blinkControls.start({
          scaleY: 1,
          transition: { duration: 0.08 },
        });
      }
    };
    blinkLoop();
  }, [blinkControls]);

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      animate={{ scale: 1 }}
      initial={{ scale: 0.8 }}
      transition={{ type: 'spring', damping: 12, stiffness: 200 }}
      key={emotion}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tail - wagging animation */}
        <motion.path
          d="M140 150 Q160 130 170 110 Q180 90 175 80"
          stroke="#F59E0B"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              'M140 150 Q160 130 170 110 Q180 90 175 80',
              'M140 150 Q165 125 178 108 Q188 85 180 72',
              'M140 150 Q160 130 170 110 Q180 90 175 80',
              'M140 150 Q155 135 162 112 Q172 95 170 88',
              'M140 150 Q160 130 170 110 Q180 90 175 80',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Body */}
        <ellipse cx="100" cy="140" rx="50" ry="40" fill="#F59E0B" />

        {/* Belly patch */}
        <ellipse cx="100" cy="145" rx="30" ry="25" fill="#FDE68A" />

        {/* Head */}
        <circle cx="100" cy="85" r="40" fill="#F59E0B" />

        {/* Left ear */}
        <polygon points="68,55 58,20 85,48" fill="#F59E0B" />
        <polygon points="71,52 64,28 82,48" fill="#FBBF24" />

        {/* Right ear */}
        <polygon points="132,55 142,20 115,48" fill="#F59E0B" />
        <polygon points="129,52 136,28 118,48" fill="#FBBF24" />

        {/* Inner face area */}
        <ellipse cx="100" cy="92" rx="28" ry="22" fill="#FDE68A" />

        {/* Eyes - change based on emotion */}
        <AnimatePresence mode="wait">
          {emotion === 'celebrating' ? (
            <React.Fragment key="celebrating-eyes">
              {/* Happy closed eyes - arcs */}
              <motion.path
                d="M82 80 Q87 72 92 80"
                stroke="#1E293B"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.path
                d="M108 80 Q113 72 118 80"
                stroke="#1E293B"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </React.Fragment>
          ) : emotion === 'sad' ? (
            <React.Fragment key="sad-eyes">
              {/* Teary eyes */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.circle cx="87" cy="80" r="5" fill="#1E293B" animate={blinkControls} style={{ originX: '87px', originY: '80px' }} />
                <circle cx="87" cy="80" r="2" fill="white" />
                <circle cx="113" cy="80" r="5" fill="#1E293B" />
                <motion.circle cx="113" cy="80" r="5" fill="#1E293B" animate={blinkControls} style={{ originX: '113px', originY: '80px' }} />
                <circle cx="113" cy="80" r="2" fill="white" />
                {/* Tear drops */}
                <motion.ellipse
                  cx="92"
                  cy="90"
                  rx="2"
                  ry="3"
                  fill="#60A5FA"
                  animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.ellipse
                  cx="118"
                  cy="90"
                  rx="2"
                  ry="3"
                  fill="#60A5FA"
                  animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
              </motion.g>
            </React.Fragment>
          ) : emotion === 'cheering' ? (
            <React.Fragment key="cheering-eyes">
              {/* Sparkle eyes */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <circle cx="87" cy="80" r="6" fill="#1E293B" />
                <circle cx="85" cy="78" r="2.5" fill="white" />
                <motion.circle
                  cx="90"
                  cy="76"
                  r="1.5"
                  fill="white"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <circle cx="113" cy="80" r="6" fill="#1E293B" />
                <circle cx="111" cy="78" r="2.5" fill="white" />
                <motion.circle
                  cx="116"
                  cy="76"
                  r="1.5"
                  fill="white"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                />
              </motion.g>
            </React.Fragment>
          ) : emotion === 'thinking' ? (
            <React.Fragment key="thinking-eyes">
              {/* One eyebrow raised */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.circle cx="87" cy="80" r="5" fill="#1E293B" animate={blinkControls} style={{ originX: '87px', originY: '80px' }} />
                <circle cx="86" cy="78" r="2" fill="white" />
                <motion.circle cx="113" cy="80" r="5" fill="#1E293B" animate={blinkControls} style={{ originX: '113px', originY: '80px' }} />
                <circle cx="112" cy="78" r="2" fill="white" />
                {/* Raised eyebrow */}
                <line x1="106" y1="68" x2="120" y2="65" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="80" y1="71" x2="94" y2="71" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
              </motion.g>
            </React.Fragment>
          ) : (
            <React.Fragment key="default-eyes">
              {/* Normal eyes with blink */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.circle cx="87" cy="80" r="5" fill="#1E293B" animate={blinkControls} style={{ originX: '87px', originY: '80px' }} />
                <circle cx="86" cy="78" r="2" fill="white" />
                <motion.circle cx="113" cy="80" r="5" fill="#1E293B" animate={blinkControls} style={{ originX: '113px', originY: '80px' }} />
                <circle cx="112" cy="78" r="2" fill="white" />
              </motion.g>
            </React.Fragment>
          )}
        </AnimatePresence>

        {/* Nose */}
        <ellipse cx="100" cy="90" rx="3" ry="2" fill="#F97316" />

        {/* Whiskers */}
        <line x1="60" y1="88" x2="80" y2="90" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="58" y1="95" x2="79" y2="94" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="120" y1="90" x2="140" y2="88" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="121" y1="94" x2="142" y2="95" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />

        {/* Mouth - changes per emotion */}
        {emotion === 'cheering' && (
          <motion.path
            d="M92 97 Q100 110 108 97"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="#F87171"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          />
        )}
        {emotion === 'celebrating' && (
          <motion.path
            d="M88 96 Q100 112 112 96"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="#F87171"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          />
        )}
        {emotion === 'sad' && (
          <motion.path
            d="M92 100 Q100 93 108 100"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
        {emotion === 'thinking' && (
          <motion.path
            d="M95 98 Q100 96 105 98"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
        {emotion === 'default' && (
          <path
            d="M93 96 Q100 104 107 96"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Arms / paws */}
        {emotion === 'cheering' ? (
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {/* Left arm up */}
            <path d="M58 120 Q45 95 40 85" stroke="#F59E0B" strokeWidth="10" strokeLinecap="round" fill="none" />
            <circle cx="38" cy="83" r="6" fill="#FDE68A" />
            {/* Right arm up */}
            <path d="M142 120 Q155 95 160 85" stroke="#F59E0B" strokeWidth="10" strokeLinecap="round" fill="none" />
            <circle cx="162" cy="83" r="6" fill="#FDE68A" />
          </motion.g>
        ) : emotion === 'thinking' ? (
          <>
            {/* Left arm normal */}
            <path d="M58 125 Q50 140 45 148" stroke="#F59E0B" strokeWidth="10" strokeLinecap="round" fill="none" />
            <circle cx="44" cy="150" r="6" fill="#FDE68A" />
            {/* Right arm - paw on chin */}
            <path d="M130 110 Q140 100 135 92" stroke="#F59E0B" strokeWidth="10" strokeLinecap="round" fill="none" />
            <circle cx="134" cy="90" r="6" fill="#FDE68A" />
          </>
        ) : (
          <>
            {/* Normal arms */}
            <path d="M58 125 Q50 140 45 148" stroke="#F59E0B" strokeWidth="10" strokeLinecap="round" fill="none" />
            <circle cx="44" cy="150" r="6" fill="#FDE68A" />
            <path d="M142 125 Q150 140 155 148" stroke="#F59E0B" strokeWidth="10" strokeLinecap="round" fill="none" />
            <circle cx="156" cy="150" r="6" fill="#FDE68A" />
          </>
        )}

        {/* Book - held or nearby */}
        <rect x="82" y="148" width="36" height="26" rx="3" fill="#4F46E5" />
        <rect x="84" y="150" width="32" height="22" rx="2" fill="#6366F1" />
        <line x1="100" y1="150" x2="100" y2="172" stroke="#4F46E5" strokeWidth="1.5" />
        <line x1="89" y1="157" x2="97" y2="157" stroke="#C7D2FE" strokeWidth="1" />
        <line x1="89" y1="161" x2="97" y2="161" stroke="#C7D2FE" strokeWidth="1" />
        <line x1="103" y1="157" x2="111" y2="157" stroke="#C7D2FE" strokeWidth="1" />
        <line x1="103" y1="161" x2="111" y2="161" stroke="#C7D2FE" strokeWidth="1" />

        {/* Feet */}
        <ellipse cx="80" cy="175" rx="14" ry="6" fill="#F59E0B" />
        <ellipse cx="120" cy="175" rx="14" ry="6" fill="#F59E0B" />

        {/* Celebrating extras - stars */}
        {emotion === 'celebrating' && (
          <>
            <motion.g
              animate={{ rotate: 360, scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <polygon
                points="35,50 38,42 41,50 49,50 43,55 45,63 38,58 31,63 33,55 27,50"
                fill="#F59E0B"
              />
            </motion.g>
            <motion.g
              animate={{ rotate: -360, scale: [1, 1.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
            >
              <polygon
                points="165,45 168,37 171,45 179,45 173,50 175,58 168,53 161,58 163,50 157,45"
                fill="#F59E0B"
              />
            </motion.g>
            <motion.g
              animate={{ rotate: 180, scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
            >
              <polygon
                points="155,18 157,13 159,18 164,18 160,21 161,26 157,23 153,26 154,21 150,18"
                fill="#10B981"
              />
            </motion.g>
          </>
        )}
      </svg>
    </motion.div>
  );
}
