'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ClipboardList,
  FolderKanban,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import UserDropdown from './UserDropdown';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg md:hidden"
        style={{ backgroundColor: 'var(--sidebar-bg)', color: 'var(--text-primary)' }}
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: 'var(--overlay-bg)' }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        style={{
          width: isCollapsed ? '64px' : '240px',
          backgroundColor: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--border-color)',
        }}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 p-1 rounded md:hidden"
          style={{ color: 'var(--text-secondary)' }}
        >
          <X size={18} />
        </button>

        {/* User profile section */}
        <div className="p-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
          {!isCollapsed && <UserDropdown />}
        </div>

        {/* Workspace section */}
        <div className="px-3 pt-4">
          {!isCollapsed && (
            <button className="flex items-center gap-2 w-full px-2 py-1.5 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Workspace
              <ChevronDown size={14} />
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2 space-y-1 pl-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-[6px] text-[13px] font-medium transition-colors"
            style={{
              backgroundColor: pathname === '/dashboard' || pathname === '/' ? 'var(--sidebar-active)' : 'transparent',
              color: pathname === '/dashboard' || pathname === '/' ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
            }}
            onMouseEnter={(e) => {
              if (pathname !== '/dashboard' && pathname !== '/') e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
            }}
            onMouseLeave={(e) => {
              if (pathname !== '/dashboard' && pathname !== '/') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ClipboardList size={16} />
            {!isCollapsed && 'Tasks'}
          </Link>
          <Link
            href="/projects"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-[6px] text-[13px] font-medium transition-colors"
            style={{
              backgroundColor: pathname === '/projects' ? 'var(--sidebar-active)' : 'transparent',
              color: pathname === '/projects' ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
            }}
            onMouseEnter={(e) => {
              if (pathname !== '/projects') e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
            }}
            onMouseLeave={(e) => {
              if (pathname !== '/projects') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <FolderKanban size={16} />
            {!isCollapsed && 'Projects'}
          </Link>
        </nav>

        {/* Bottom section */}
        <div className="p-3 space-y-2 mt-auto" style={{ borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center gap-3 w-full px-3 py-2 rounded-[6px] text-xs font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--sidebar-text)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <ChevronDown size={16} className={`transition-transform ${isCollapsed ? '-rotate-90' : 'rotate-90'}`} />
            {!isCollapsed && 'Collapse'}
          </button>

        </div>
      </aside>
    </>
  );
}
