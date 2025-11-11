'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { motionTransition, hoverSpring, tapSpring } from '../../lib/motion';
import { Card } from '@/components/ui';
import { Pattern } from '@/types/pattern';

interface PatternCardProps {
  pattern: Pattern;
  onClick: () => void;
}

export const PatternCard: React.FC<PatternCardProps> = ({ pattern, onClick }) => {
  const dimensionConfig = {
    physical: {
      emoji: '💪',
      color: 'text-jarvis-cyan',
      bgGradient: 'from-jarvis-cyan/20 to-jarvis-cyan/5',
      ring: 'ring-jarvis-cyan/30'
    },
    mental: {
      emoji: '🧠',
      color: 'text-jarvis-amber',
      bgGradient: 'from-jarvis-amber/20 to-jarvis-amber/5',
      ring: 'ring-jarvis-amber/30'
    },
    spiritual: {
      emoji: '✨',
      color: 'text-jarvis-green',
      bgGradient: 'from-jarvis-green/20 to-jarvis-green/5',
      ring: 'ring-jarvis-green/30'
    }
  };

  const typeConfig = {
    positive: {
      label: 'Strength',
      icon: '🎯',
      color: 'text-jarvis-green',
      bg: 'bg-jarvis-green/10'
    },
    warning: {
      label: 'Watch',
      icon: '⚠️',
      color: 'text-jarvis-amber',
      bg: 'bg-jarvis-amber/10'
    },
    alert: {
      label: 'Alert',
      icon: '🚨',
      color: 'text-red-400',
      bg: 'bg-red-400/10'
    }
  };

  const config = dimensionConfig[pattern.dimension];
  const typeInfo = typeConfig[pattern.type];

  const daysAgo = Math.floor(
    (Date.now() - new Date(pattern.discovered).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
      <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ ...motionTransition, hover: hoverSpring, tap: tapSpring }}
    >
      <Card
        onClick={onClick}
        className="cursor-pointer h-full focus:outline-none focus:ring-2 focus:ring-jarvis-cyan/60 focus:ring-offset-1"
        role="button"
        tabIndex={0}
        aria-label={`Open pattern ${pattern.title}`}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{config.emoji}</span>
              <div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeInfo.bg} ${typeInfo.color}`}
                >
                  <span>{typeInfo.icon}</span>
                  {typeInfo.label}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-jarvis-gray">
                {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div className="h-1.5 flex-1 bg-jarvis-navy-light rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pattern.confidence}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full bg-gradient-to-r ${config.bgGradient}`}
                  />
                </div>
                <span className={`text-xs ${config.color} font-medium`}>
                  {pattern.confidence}%
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className={`heading-sm ${config.color} leading-tight`}>
            {pattern.title}
          </h3>

          {/* Pattern description */}
          <p className="text-jarvis-gray text-sm leading-relaxed line-clamp-3">
            {pattern.pattern}
          </p>

          {/* Evidence count */}
          <div className="flex items-center justify-between pt-2 border-t border-jarvis-gray/10">
            <span className="text-xs text-jarvis-gray">
              {pattern.evidence.length} data point{pattern.evidence.length !== 1 ? 's' : ''}
            </span>
            <span className={`text-xs ${config.color}`}>
              Tap for details →
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
