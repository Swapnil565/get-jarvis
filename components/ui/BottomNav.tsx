"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { navItemVariants } from '@/lib/animations';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { copy } from '@/lib/copy';
import { 
  Home, 
  Waves, 
  TrendingUp, 
  BarChart3, 
  Zap, 
  Bell, 
  User 
} from 'lucide-react';

const items = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/progress', label: 'Patterns', icon: TrendingUp },
  { href: '/log', label: 'Log', icon: Waves },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/interventions', label: 'Interventions', icon: Zap },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  // Don't show navigation on the landing page or onboarding
  if (pathname === '/' || pathname === '/onboarding') return null;

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto glass-card rounded-full px-4 py-3 flex items-center gap-2 md:gap-6 overflow-x-auto max-w-[95vw]">
        {items.map((it) => {
          const active = pathname === it.href;
          const Icon = it.icon;
          return (
            <motion.div key={it.href} variants={navItemVariants} initial="rest" whileHover="hover" whileTap="tap">
              <Link
                href={it.href}
                className={`flex flex-col items-center text-center px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-jarvis-cyan/60 focus:ring-offset-1 transition-colors min-w-[60px] ${active ? 'text-jarvis-cyan' : 'text-jarvis-text-secondary hover:text-jarvis-text-primary'}`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[9px] font-medium uppercase tracking-wider mt-1 truncate w-full">{it.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
};
