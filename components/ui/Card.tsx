'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { motionTransition } from '../../lib/motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  ...rest
}) => {
  const cardClass = glow ? 'glass-glow' : 'glass-card';
  const clickable = !!(rest as React.HTMLAttributes<HTMLDivElement>).onClick;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition}
      className={`${cardClass} ${clickable ? 'cursor-pointer hover:scale-[1.04] transition-transform' : ''} ${className}`}
      {...(rest as any)}
    >
      {children}
    </motion.div>
  );
};
