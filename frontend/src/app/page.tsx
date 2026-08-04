'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Triangle, Loader2 } from 'lucide-react';

const FLOATING_AVATARS = [
  { initial: 'D', color: '#F59E0B', top: '25%', left: '15%', size: 44 },
  { initial: 'S', color: '#EF4444', top: '60%', right: '12%', size: 40 },
  { initial: 'A', color: '#10B981', bottom: '20%', left: '20%', size: 36 },
  { initial: 'M', color: '#3B82F6', top: '15%', right: '20%', size: 32 },
  { initial: 'R', color: '#8B5CF6', bottom: '35%', right: '25%', size: 38 },
];

export default function LoginPage() {
  const { guestLogin, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleGuestLogin = async () => {
    setIsLoggingIn(true);
    try {
      await guestLogin();
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <Loader2
          className="animate-spin-slow"
          size={32}
          style={{ color: 'var(--brand-primary)' }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Floating avatars */}
      {FLOATING_AVATARS.map((avatar, i) => (
        <div
          key={i}
          className="hidden md:flex absolute rounded-full items-center justify-center text-white font-bold shadow-lg animate-fade-in"
          style={{
            backgroundColor: avatar.color,
            width: avatar.size,
            height: avatar.size,
            fontSize: avatar.size * 0.35,
            top: avatar.top,
            left: avatar.left,
            right: avatar.right,
            bottom: avatar.bottom,
            animationDelay: `${i * 0.15}s`,
            animationFillMode: 'both',
            boxShadow: `0 0 20px ${avatar.color}40`,
          }}
        >
          {avatar.initial}
        </div>
      ))}

      {/* Login card */}
      <div
        className="w-full max-w-[400px] rounded-[6px] p-8 animate-scale-in relative z-10"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <Triangle size={20} style={{ color: 'var(--text-primary)' }} />
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Pyramid
          </span>
        </div>

        {/* Heading */}
        <h1
          className="text-xl font-bold text-center mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Let&apos;s get back on track
        </h1>
        <p
          className="text-sm text-center mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          Enter your email below to login to your account.
        </p>

        {/* Continue as Guest button */}
        <button
          onClick={handleGuestLogin}
          disabled={isLoggingIn}
          className="w-full py-2.5 rounded-[6px] text-sm font-medium mb-3 transition-colors flex items-center justify-center gap-2"
          style={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
          }}
        >
          {isLoggingIn ? <Loader2 className="animate-spin-slow" size={16} /> : null}
          Continue as Guest
        </button>

        {/* Google login button */}
        <button
          className="w-full py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-[var(--bg-card-hover)] flex items-center justify-center gap-2.5"
          style={{
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Login with Google
        </button>

        {/* Terms */}
        <p
          className="text-[11px] text-center mt-8 leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
        >
          By clicking continue, you agree to our{' '}
          <a href="#" className="underline hover:opacity-80">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:opacity-80">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
