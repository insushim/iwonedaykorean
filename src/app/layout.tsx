import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '하루국어 - 하루 한 걸음, 국어의 힘이 자라는 시간',
  description:
    '초등학생을 위한 수능형 국어 학습 앱. 비문학, 문학, 시, 문법을 하루 15분씩 완전학습하고, 재미있는 게이미피케이션으로 꾸준히 성장하세요.',
  keywords: ['국어', '초등', '학습', '수능', '비문학', '문학', '문법'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
