'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('이메일을 입력해 주세요.');
      return;
    }
    if (!password) {
      setError('비밀번호를 입력해 주세요.');
      return;
    }

    setLoading(true);

    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const profileDoc = await getDoc(doc(db, 'users', uid));
      if (profileDoc.exists()) {
        setUser(profileDoc.data() as Parameters<typeof setUser>[0]);
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      switch (firebaseError.code) {
        case 'auth/user-not-found':
          setError('등록되지 않은 이메일입니다.');
          break;
        case 'auth/wrong-password':
          setError('비밀번호가 올바르지 않습니다.');
          break;
        case 'auth/invalid-email':
          setError('올바른 이메일 형식이 아닙니다.');
          break;
        case 'auth/too-many-requests':
          setError('너무 많은 시도가 있었습니다. 잠시 후 다시 시도해 주세요.');
          break;
        default:
          if (firebaseError.code) {
            setError('로그인에 실패했습니다. 다시 시도해 주세요.');
          } else {
            setError('Firebase가 설정되지 않았습니다. 데모 모드로 이동합니다.');
            setTimeout(() => {
              router.push('/dashboard');
            }, 1500);
          }
      }
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
        {/* HaruCat */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="inline-block"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center mx-auto shadow-lg">
              <span className="text-5xl">&#128049;</span>
            </div>
          </motion.div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">하루국어</h1>
          <p className="mt-1 text-gray-500">로그인하고 오늘의 학습을 시작해요!</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="비밀번호를 입력하세요"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
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

            {/* Submit */}
            <Button type="submit" loading={loading} className="w-full" size="lg">
              로그인
            </Button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              아직 계정이 없나요?{' '}
              <Link href="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
