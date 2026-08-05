'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ViewMode, FieldVisibility } from '@/types';
import { SlidersHorizontal, LayoutGrid, List } from 'lucide-react';

interface FieldsDropdownProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  fieldVisibility: FieldVisibility;
  onFieldVisibilityChange: (fields: FieldVisibility) => void;
}

export default function FieldsDropdown({
  viewMode,
  onViewModeChange,
  fieldVisibility,
  onFieldVisibilityChange,
}: FieldsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleField = (field: keyof FieldVisibility) => {
    onFieldVisibilityChange({ ...fieldVisibility, [field]: !fieldVisibility[field] });
  };

  const fields: { key: keyof FieldVisibility; label: string }[] = [
    { key: 'priority', label: 'Priority' },
    { key: 'members', label: 'Members' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'labels', label: 'Labels' },
    { key: 'status', label: 'Status' },
    { key: 'reporter', label: 'Reporter' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
        style={{
          border: '1px solid var(--border-color)',
          color: 'var(--text-secondary)',
          backgroundColor: isOpen ? 'var(--bg-card)' : 'transparent',
        }}
      >
        <SlidersHorizontal size={14} />
        Fields
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-10 w-56 rounded-xl shadow-2xl z-30 animate-scale-in overflow-hidden"
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
        >
          {/* View switcher */}
          <div className="flex p-2 gap-1" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <button
              onClick={() => onViewModeChange('list')}
              className={`flex items-center gap-2 flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors`}
              style={{
                backgroundColor: viewMode === 'list' ? 'var(--brand-primary)' : 'transparent',
                color: viewMode === 'list' ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              <List size={14} /> List
            </button>
            <button
              onClick={() => onViewModeChange('board')}
              className={`flex items-center gap-2 flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors`}
              style={{
                backgroundColor: viewMode === 'board' ? 'var(--brand-primary)' : 'transparent',
                color: viewMode === 'board' ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              <LayoutGrid size={14} /> Board
            </button>
          </div>

          {/* Field toggles */}
          <div className="p-2">
            <p className="px-2 py-1 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Fields</p>
            {fields.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleField(key)}
                className="flex items-center justify-between w-full px-2 py-1.5 rounded-lg text-sm transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span>{label}</span>
                <div
                  className="w-8 h-4.5 rounded-full relative transition-colors"
                  style={{
                    backgroundColor: fieldVisibility[key] ? 'var(--brand-primary)' : 'var(--border-color)',
                    padding: '2px',
                  }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all"
                    style={{ left: fieldVisibility[key] ? '16px' : '2px' }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
