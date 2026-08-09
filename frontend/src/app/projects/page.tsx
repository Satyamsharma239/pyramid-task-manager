'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ProjectsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
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

      <main className="md:ml-[240px] p-4 md:p-8 pt-16 md:pt-8">
        <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Projects</h1>

        <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
          <table className="w-full text-sm text-left">
            <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th className="px-6 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Project Name</th>
                <th className="px-6 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Status</th>
                <th className="px-6 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Owner</th>
                <th className="px-6 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Website Redesign', status: 'Active', owner: 'Alice', date: '2 hours ago' },
                { name: 'Mobile App V2', status: 'Planning', owner: 'Bob', date: '1 day ago' },
                { name: 'API Migration', status: 'On Hold', owner: 'Charlie', date: '3 days ago' },
              ].map((project, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td className="px-6 py-4 font-medium" style={{ color: 'var(--text-primary)' }}>{project.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-[11px] font-medium" style={{ backgroundColor: 'var(--tag-bg)', color: 'var(--tag-text)' }}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{project.owner}</td>
                  <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{project.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
