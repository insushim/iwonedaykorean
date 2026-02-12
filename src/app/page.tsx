'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { BookOpen, Brain, Gamepad2, ChevronRight, Sparkles, Star, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function HaruCatHero() {
  return (
    <motion.div
      className="relative w-48 h-48 md:w-64 md:h-64 mx-auto"
      animate={{ y: [0, -12, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center shadow-xl">
        <div className="text-center">
          <div className="text-7xl md:text-8xl">
            <span role="img" aria-label="하루캣">
              &#128049;
            </span>
          </div>
          <motion.div
            className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-2 shadow-lg"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const features = [
  {
    icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
    title: '수능형 구조 학습',
    description: '비문학, 문학, 시, 문법까지 수능 국어의 핵심 구조를 초등학생 눈높이에 맞춰 학습해요.',
    gradient: 'from-indigo-50 to-indigo-100',
    borderColor: 'border-indigo-200',
  },
  {
    icon: <Brain className="w-8 h-8 text-emerald-600" />,
    title: '완전학습 시스템',
    description: '틀린 문제는 다시 풀고, 해설로 이해하고, 오답 노트로 복습까지. 완벽하게 이해할 때까지!',
    gradient: 'from-emerald-50 to-emerald-100',
    borderColor: 'border-emerald-200',
  },
  {
    icon: <Gamepad2 className="w-8 h-8 text-amber-600" />,
    title: '재미있는 게이미피케이션',
    description: 'XP, 레벨, 뱃지, 연속 학습 보상으로 매일매일 학습이 즐거워져요!',
    gradient: 'from-amber-50 to-amber-100',
    borderColor: 'border-amber-200',
  },
];

const grades = [1, 2, 3, 4, 5, 6] as const;

export default function LandingPage() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const gradesRef = useRef(null);
  const statsRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });
  const gradesInView = useInView(gradesRef, { once: true });
  const statsInView = useInView(statsRef, { once: true });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">&#128049;</span>
            <span className="text-xl font-bold text-indigo-600">하루국어</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">로그인</Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm">시작하기</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <HaruCatHero />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mt-8 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight"
            >
              하루 한 걸음,
              <br />
              <span className="text-indigo-600">국어의 힘</span>이 자라는 시간
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              매일 15분, 수능형 국어 학습을 초등학생 눈높이에 맞춰 즐겁게!
              <br className="hidden sm:block" />
              비문학, 문학, 시, 문법을 체계적으로 학습하세요.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="min-w-[200px]">
                  <Zap className="w-5 h-5" />
                  무료로 시작하기
                </Button>
              </Link>
              <Link href="/daily">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  체험해 보기
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Grade Selection */}
      <section ref={gradesRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate={gradesInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl font-bold text-gray-900">
              우리 아이 학년을 선택하세요
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-3 text-gray-600">
              학년별 맞춤 교육과정으로 학습해요
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8 grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-lg sm:max-w-2xl mx-auto">
              {grades.map((grade) => (
                <Link
                  key={grade}
                  href={`/signup?grade=${grade}`}
                  className="group relative"
                >
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                    <span className="text-2xl font-bold text-indigo-600">{grade}</span>
                    <span className="text-sm text-indigo-500 font-medium">학년</span>
                  </div>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate={featuresInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl sm:text-3xl font-bold text-gray-900 text-center"
            >
              왜 하루국어인가요?
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${feature.gradient} border ${feature.borderColor} shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section ref={statsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-indigo-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate={statsInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl font-bold text-white">
              함께 성장하고 있어요
            </motion.h2>
            <motion.div variants={fadeInUp} className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-extrabold text-white">
                  <AnimatedCounter target={15420} />
                </div>
                <div className="mt-2 text-indigo-200 font-medium">총 학습 완료 수</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-extrabold text-white">
                  <AnimatedCounter target={2847} />
                </div>
                <div className="mt-2 text-indigo-200 font-medium">학습 중인 친구들</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-extrabold text-white">
                  <AnimatedCounter target={94} />%
                </div>
                <div className="mt-2 text-indigo-200 font-medium">평균 만족도</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">
              <span role="img" aria-label="하루캣">&#128049;</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              오늘부터 시작해 볼까요?
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              하루 15분으로 국어 실력이 쑥쑥 자라요!
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg" className="min-w-[250px]">
                  <Star className="w-5 h-5" />
                  시작하기
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">&#128049;</span>
            <span className="text-lg font-bold text-indigo-600">하루국어</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; 2026 하루국어. 하루 한 걸음, 국어의 힘이 자라는 시간.
          </p>
        </div>
      </footer>
    </div>
  );
}
