'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2, User } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Loader2 className="animate-spin-slow" size={32} style={{ color: 'var(--brand-primary)' }} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />

      <main className="md:ml-[240px] flex">
        {/* Settings Secondary Sidebar */}
        <div className="w-[240px] h-screen hidden md:block pt-8 px-4" style={{ borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <h2 className="text-xs font-semibold mb-4 px-2" style={{ color: 'var(--text-muted)' }}>SETTINGS</h2>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-[var(--sidebar-active)]" style={{ color: 'var(--sidebar-text-active)' }}>
              <User size={16} />
              My Profile
            </a>
          </nav>
        </div>

        {/* Profile Content */}
        <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8 max-w-2xl">
          <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>My Profile</h1>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold"
                style={{ backgroundColor: 'var(--brand-primary)', color: '#FFFFFF' }}
              >
                {user?.displayName?.charAt(0)?.toUpperCase() || 'G'}
              </div>
              <div>
                <h3 className="font-medium text-lg" style={{ color: 'var(--text-primary)' }}>{user?.displayName || 'Guest User'}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user?.email || 'guest@example.com'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Display Name</label>
                <input
                  type="text"
                  defaultValue={user?.displayName || 'Guest User'}
                  className="w-full px-3 py-2 rounded-[6px] text-sm"
                  style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || 'guest@example.com'}
                  disabled
                  className="w-full px-3 py-2 rounded-[6px] text-sm opacity-60"
                  style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <button
                className="px-4 py-2 rounded-[6px] text-sm font-medium mt-4 transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--brand-primary)', color: '#FFFFFF' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
