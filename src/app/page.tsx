"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  BookOpen,
  Brain,
  Gamepad2,
  Sparkles,
  Star,
  Zap,
  ArrowRight,
  Shield,
  Clock,
} from "lucide-react";
import Button from "@/components/ui/Button";

function AnimatedCounter({
  target,
  duration = 2000,
}: {
  target: number;
  duration?: number;
}) {
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
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const features = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "수능형 구조 학습",
    description:
      "비문학, 문학, 시, 문법까지 수능 국어의 핵심을 초등학생 눈높이에 맞춰 학습해요.",
    iconBg: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "완전학습 시스템",
    description:
      "틀린 문제는 다시 풀고, 해설로 이해하고, 오답 노트로 복습까지!",
    iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: <Gamepad2 className="w-6 h-6" />,
    title: "게이미피케이션",
    description: "XP, 레벨, 뱃지, 연속 학습 보상으로 매일 학습이 즐거워져요!",
    iconBg: "bg-amber-50 text-amber-600",
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
    <div className="min-h-screen bg-[#FAFBFF]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <span className="text-lg font-bold text-gradient-primary">
              하루국어
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                로그인
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">시작하기</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-indigo-100/40 via-violet-100/30 to-cyan-100/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium border border-indigo-100">
                <Sparkles className="w-3.5 h-3.5" />
                1,200+ 문제 풀 보유
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]"
            >
              <span className="text-gray-900">하루 한 걸음,</span>
              <br />
              <span className="text-gradient-hero">국어의 힘</span>
              <span className="text-gray-900">이 자라는 시간</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed"
            >
              매일 15분, 수능형 국어 학습을 초등학생 눈높이에 맞춰 즐겁게.
              비문학, 문학, 시, 문법을 체계적으로 학습하세요.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link href="/signup">
                <Button size="lg" className="min-w-[200px] text-base">
                  <Zap className="w-5 h-5" />
                  무료로 시작하기
                </Button>
              </Link>
              <Link href="/daily">
                <Button
                  variant="outline"
                  size="lg"
                  className="min-w-[200px] text-base"
                >
                  체험해 보기
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400"
            >
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> 무료
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> 15분/일
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4" /> 1~6학년
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Grade Selection */}
      <section ref={gradesRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            animate={gradesInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl sm:text-3xl font-bold text-gray-900"
            >
              우리 아이 학년을 선택하세요
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-3 text-gray-500">
              학년별 맞춤 교육과정으로 학습해요
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="mt-8 grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-lg sm:max-w-2xl mx-auto"
            >
              {grades.map((grade) => (
                <Link key={grade} href={`/signup?grade=${grade}`}>
                  <div className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 hover:-translate-y-0.5">
                    <span className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {grade}
                    </span>
                    <span className="text-xs text-gray-400 font-medium mt-0.5">
                      학년
                    </span>
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
            animate={featuresInView ? "visible" : "hidden"}
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
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group relative p-6 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-900/[0.04] transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-4`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-10 sm:p-14 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <motion.h2
                variants={fadeInUp}
                className="text-2xl sm:text-3xl font-bold text-white text-center relative"
              >
                함께 성장하고 있어요
              </motion.h2>
              <motion.div
                variants={fadeInUp}
                className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 relative"
              >
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-extrabold text-white">
                    <AnimatedCounter target={15420} />
                  </div>
                  <div className="mt-2 text-indigo-200 text-sm font-medium">
                    총 학습 완료 수
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-extrabold text-white">
                    <AnimatedCounter target={2847} />
                  </div>
                  <div className="mt-2 text-indigo-200 text-sm font-medium">
                    학습 중인 친구들
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-extrabold text-white">
                    <AnimatedCounter target={94} />%
                  </div>
                  <div className="mt-2 text-indigo-200 text-sm font-medium">
                    평균 만족도
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
              <span className="text-4xl text-white font-bold">H</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              오늘부터 시작해 볼까요?
            </h2>
            <p className="mt-3 text-gray-500 text-lg">
              하루 15분으로 국어 실력이 쑥쑥 자라요!
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg" className="min-w-[250px] text-base">
                  <Star className="w-5 h-5" />
                  시작하기
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">H</span>
            </div>
            <span className="text-sm font-bold text-gradient-primary">
              하루국어
            </span>
          </div>
          <p className="text-xs text-gray-400">
            &copy; 2026 하루국어. 하루 한 걸음, 국어의 힘이 자라는 시간.
          </p>
        </div>
      </footer>
    </div>
  );
}
