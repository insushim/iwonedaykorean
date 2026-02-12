'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import type { Grade, Semester } from '@/types';

const grades: Grade[] = [1, 2, 3, 4, 5, 6];
const semesters: Semester[] = [1, 2];

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedGrade = searchParams.get('grade');
  const { signup } = useAuthStore();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(
    preselectedGrade ? (Number(preselectedGrade) as Grade) : null
  );
  const [selectedSemester, setSelectedSemester] = useState<Semester>(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateStep1 = (): boolean => {
    if (!email.trim()) {
      setError('이메일을 입력해 주세요.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return false;
    }
    if (!password) {
      setError('비밀번호를 입력해 주세요.');
      return false;
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    if (!displayName.trim()) {
      setError('표시 이름을 입력해 주세요.');
      return false;
    }
    if (displayName.trim().length < 2) {
      setError('표시 이름은 2자 이상이어야 합니다.');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    setError('');

    if (!selectedGrade) {
      setError('학년을 선택해 주세요.');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, displayName.trim(), selectedGrade, selectedSemester);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '회원가입에 실패했습니다. 다시 시도해 주세요.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center mx-auto shadow-lg">
              <span className="text-4xl">&#128049;</span>
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">회원가입</h1>
          <p className="mt-1 text-gray-500">
            {step === 1 ? '기본 정보를 입력해 주세요' : '학년과 학기를 선택해 주세요'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {step > 1 ? <Check className="w-5 h-5" /> : '1'}
          </div>
          <div className={`w-12 h-1 rounded-full transition-colors ${
            step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'
          }`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    이메일
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Display Name */}
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    표시 이름
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="친구들에게 보일 이름"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      maxLength={20}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="6자 이상"
                      className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                    비밀번호 확인
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="비밀번호를 다시 입력하세요"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <span className="text-sm text-red-600">{error}</span>
                  </motion.div>
                )}

                <Button onClick={handleNextStep} className="w-full" size="lg">
                  다음
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Grade Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    학년 선택
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {grades.map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setSelectedGrade(grade)}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                          selectedGrade === grade
                            ? 'border-indigo-500 bg-indigo-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
                        }`}
                      >
                        <span className={`text-2xl font-bold ${
                          selectedGrade === grade ? 'text-indigo-600' : 'text-gray-700'
                        }`}>
                          {grade}
                        </span>
                        <span className={`block text-sm mt-0.5 ${
                          selectedGrade === grade ? 'text-indigo-500' : 'text-gray-500'
                        }`}>
                          학년
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Semester Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    학기 선택
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {semesters.map((semester) => (
                      <button
                        key={semester}
                        type="button"
                        onClick={() => setSelectedSemester(semester)}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                          selectedSemester === semester
                            ? 'border-emerald-500 bg-emerald-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
                        }`}
                      >
                        <span className={`text-xl font-bold ${
                          selectedSemester === semester ? 'text-emerald-600' : 'text-gray-700'
                        }`}>
                          {semester}학기
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <span className="text-sm text-red-600">{error}</span>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => { setStep(1); setError(''); }}
                    className="flex-1"
                    size="lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    이전
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    loading={loading}
                    className="flex-1"
                    size="lg"
                  >
                    회원가입
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              이미 계정이 있나요?{' '}
              <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
