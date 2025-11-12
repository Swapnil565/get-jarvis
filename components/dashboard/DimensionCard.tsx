'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui';
import { motionTransition, hoverSpring } from '../../lib/motion';

interface DimensionCardProps {
  dimension: 'physical' | 'mental' | 'spiritual';
  status: 'great' | 'good' | 'warning' | 'alert';
  score?: number;
  insight?: string;
  emoji: string;
}

export const DimensionCard: React.FC<DimensionCardProps> = ({
  dimension,
  status,
  score,
  insight,
  emoji
}) => {
  const router = useRouter();
  const dimensionConfig = {
    physical: {
      title: 'Physical',
      color: 'text-jarvis-cyan',
      bgGradient: 'from-jarvis-cyan/20 to-jarvis-cyan/5'
    },
    mental: {
      title: 'Mental',
      color: 'text-jarvis-amber',
      bgGradient: 'from-jarvis-amber/20 to-jarvis-amber/5'
    },
    spiritual: {
      title: 'Spiritual',
      color: 'text-jarvis-green',
      bgGradient: 'from-jarvis-green/20 to-jarvis-green/5'
    }
  };

  const statusConfig = {
    great: { label: 'Great', color: 'text-jarvis-green', ring: 'ring-jarvis-green/30' },
    good: { label: 'Good', color: 'text-jarvis-cyan', ring: 'ring-jarvis-cyan/30' },
    warning: { label: 'Watch', color: 'text-jarvis-amber', ring: 'ring-jarvis-amber/30' },
    alert: { label: 'Alert', color: 'text-red-400', ring: 'ring-red-400/30' }
  };

  const config = dimensionConfig[dimension];
  const statusInfo = statusConfig[status];

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ ...hoverSpring, stiffness: 320 }}
    >
  <Card className="cursor-pointer" onClick={() => router.push(`/insights?dimension=${dimension}`)}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{emoji}</span>
              <div>
                <h3 className={`heading-sm ${config.color}`}>{config.title}</h3>
                <span className={`text-xs ${statusInfo.color}`}>{statusInfo.label}</span>
              </div>
            </div>
            {score !== undefined && (
              <div className={`text-4xl font-bold ${config.color}`}>
                {score}
                <span className="text-lg text-jarvis-gray">/10</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {score !== undefined && (
            <div className="relative h-2 bg-jarvis-navy-light rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score * 10}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${config.bgGradient} ${statusInfo.ring} ring-1`}
              />
            </div>
          )}

          {/* Insight */}
          {insight && (
            <p className="text-sm text-jarvis-gray leading-relaxed">{insight}</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default (props: DimensionCardProps) => {
  const router = useRouter();
  return <DimensionCard {...props} />;
};
