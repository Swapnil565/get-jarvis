"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/dashboard', label: 'Home', emoji: '🏠' },
  { href: '/log', label: 'Log', emoji: '🎙️' },
  { href: '/insights', label: 'Insights', emoji: '📊' },
  { href: '/settings', label: 'You', emoji: '⚙️' }
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-jarvis-deep-navy/80 backdrop-blur rounded-3xl px-4 py-2 flex items-center gap-4 shadow-lg">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link key={it.href} href={it.href} className={`flex flex-col items-center text-center px-3 py-2 rounded-lg ${active ? 'text-jarvis-cyan' : 'text-jarvis-soft-gray'}`}>
              <span className="text-xl">{it.emoji}</span>
              <span className="text-xs mt-1">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
