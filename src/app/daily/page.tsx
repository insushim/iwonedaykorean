"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Play,
  BookOpen,
  Feather,
  Music,
  SpellCheck,
  Calendar,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card, { CardBody } from "@/components/ui/Card";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDate, generateSessionId } from "@/lib/utils";

const studyStructure = [
  {
    icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
    label: "비문학",
    desc: "1지문 + 2~3문제",
    color: "bg-indigo-50 border-indigo-200",
  },
  {
    icon: <Feather className="w-5 h-5 text-emerald-600" />,
    label: "문학",
    desc: "1지문 + 2~3문제",
    color: "bg-emerald-50 border-emerald-200",
  },
  {
    icon: <Music className="w-5 h-5 text-purple-600" />,
    label: "시",
    desc: "1지문 + 2문제",
    color: "bg-purple-50 border-purple-200",
  },
  {
    icon: <SpellCheck className="w-5 h-5 text-amber-600" />,
    label: "문법",
    desc: "2~4문제",
    color: "bg-amber-50 border-amber-200",
  },
];

export default function DailyPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const todayFormatted = formatDate(today, "full");

  const handleStartStudy = async () => {
    setLoading(true);

    try {
      const sessionId = generateSessionId(user?.uid);
      router.push(`/daily/${sessionId}`);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex flex-col items-center px-4 py-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Date */}
        <div className="flex items-center justify-center gap-2 text-gray-600 mb-8">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
            <Calendar className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold">{todayFormatted}</span>
        </div>

        {/* HaruCat Cheering */}
        <div className="text-center mb-10">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="inline-block"
          >
            <div className="w-36 h-36 rounded-3xl bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 flex items-center justify-center mx-auto shadow-2xl border-4 border-white/50 relative">
              <span className="text-7xl">&#128049;</span>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-lg">✨</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="mt-8 text-3xl font-extrabold text-gradient-primary">
              오늘의 학습 시작!
            </h1>
            <p className="mt-3 text-gray-600 font-medium">
              {user?.displayName || "학생"}아, 오늘도 화이팅! 🔥
            </p>
          </motion.div>
        </div>

        {/* Study Structure Preview */}
        <Card
          variant="glass"
          className="card-modern mb-8 border border-white/20"
        >
          <CardBody className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-5 text-center">
              오늘의 학습 구성
            </h3>
            <div className="space-y-3">
              {studyStructure.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index + 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${item.color} shadow-sm hover:shadow-md transition-all duration-200`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-gray-800">
                      {item.label}
                    </p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  <div className="text-2xl opacity-20">{index + 1}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl text-center border border-gray-100">
              <p className="text-sm text-gray-600">
                예상 소요 시간:{" "}
                <span className="font-bold text-indigo-600 text-lg">
                  약 15분
                </span>
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleStartStudy}
            loading={loading}
            size="lg"
            className="w-full py-4 text-lg shadow-2xl shadow-indigo-500/25"
          >
            <Play className="w-6 h-6" />
            학습 시작하기
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
