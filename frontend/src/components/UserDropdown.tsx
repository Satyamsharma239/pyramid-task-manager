import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme, ThemeColor, Theme } from '@/contexts/ThemeContext';
import { Check, LogOut, Moon, Sun, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const { theme, setTheme, color, setColor } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const initial = user?.displayName?.charAt(0)?.toUpperCase() || 'G';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const colors: { name: string; value: ThemeColor; hex: string }[] = [
    { name: 'Amber', value: 'amber', hex: '#f59e0b' },
    { name: 'Blue', value: 'blue', hex: '#3b82f6' },
    { name: 'Pink', value: 'pink', hex: '#ec4899' },
    { name: 'Rose', value: 'rose', hex: '#f43f5e' },
    { name: 'Emerald', value: 'emerald', hex: '#10b981' },
    { name: 'Black', value: 'black', hex: '#111827' },
  ];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-2 py-1.5 rounded-[6px] hover:bg-[var(--sidebar-hover)] transition-colors"
      >
        <div
          className="w-5 h-5 rounded-[4px] flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
          style={{ backgroundColor: 'var(--brand-primary)', color: '#FFFFFF' }}
        >
          {initial}
        </div>
        <span className="font-medium text-[13px] truncate" style={{ color: 'var(--text-primary)' }}>
          {user?.displayName || 'Guest'}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1 w-[240px] rounded-[6px] shadow-lg z-50 p-1"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div className="px-3 py-2 border-b border-[var(--border-color)]">
            <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              {user?.email || 'guest@example.com'}
            </p>
          </div>

          <div className="py-1 border-b border-[var(--border-color)]">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/settings/profile');
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-[var(--bg-card-hover)] transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <Settings size={14} />
              Settings
            </button>
          </div>

          <div className="py-2 px-3 border-b border-[var(--border-color)]">
            <p className="text-[11px] font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              THEME
            </p>
            <div className="flex gap-1 mb-3">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[4px] text-xs border ${
                  theme === 'light' ? 'bg-[var(--bg-card-hover)] border-[var(--border-color)]' : 'border-transparent hover:bg-[var(--bg-card-hover)]'
                }`}
                style={{ color: 'var(--text-primary)' }}
              >
                <Sun size={12} /> Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[4px] text-xs border ${
                  theme === 'dark' ? 'bg-[var(--bg-card-hover)] border-[var(--border-color)]' : 'border-transparent hover:bg-[var(--bg-card-hover)]'
                }`}
                style={{ color: 'var(--text-primary)' }}
              >
                <Moon size={12} /> Dark
              </button>
            </div>

            <p className="text-[11px] font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              COLOR
            </p>
            <div className="grid grid-cols-6 gap-1">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className="w-6 h-6 rounded-full mx-auto flex items-center justify-center relative"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {color === c.value && <Check size={12} color="#FFFFFF" />}
                </button>
              ))}
            </div>
          </div>

          <div className="py-1">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-[var(--bg-card-hover)] transition-colors text-red-500"
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
