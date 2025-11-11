'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container, PageLayout, Button, Card } from '@/components/ui';
import { DimensionCard } from '@/components/dashboard/DimensionCard';
import { StreakCounter } from '@/components/dashboard/StreakCounter';
import { QuickMoodCheck } from '@/components/dashboard/QuickMoodCheck';

export const Dashboard: React.FC = () => {
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [hasInterventions, setHasInterventions] = useState(true); // Mock - will come from API in Phase 9

  // Mock data - will be replaced with real data from API in Phase 9
  const dimensionsData = {
    physical: {
      status: 'good' as const,
      score: 7.5,
      insight: 'Workouts consistent. Recovery could be better.',
      emoji: '💪'
    },
    mental: {
      status: 'warning' as const,
      score: 6.0,
      insight: 'Focus is slipping. Consider reducing context switching.',
      emoji: '🧠'
    },
    spiritual: {
      status: 'great' as const,
      score: 8.5,
      insight: 'Great balance. Keep prioritizing what matters.',
      emoji: '✨'
    }
  };

  const handleMoodSelect = (mood: number) => {
    console.log('Mood selected:', mood);
    setSelectedMood(mood);
    // TODO: Send to API in Phase 9
  };

  const handleLogSomething = () => {
    window.location.href = '/log';
  };

  return (
    <PageLayout>
      <Container size="lg" className="py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="heading-lg">Welcome back</h1>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/progress'}
                className="text-jarvis-gray hover:text-jarvis-cyan transition-colors relative text-2xl"
                title="View Progress"
              >
                <span aria-hidden>📈</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/insights'}
                className="text-jarvis-gray hover:text-jarvis-cyan transition-colors relative text-2xl"
                title="View Insights"
              >
                <span aria-hidden>📊</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/interventions'}
                className="text-jarvis-gray hover:text-jarvis-cyan transition-colors relative text-2xl"
                title="Interventions"
              >
                <span aria-hidden>🔔</span>
                {hasInterventions && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-jarvis-amber rounded-full border-2 border-jarvis-navy" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/settings'}
                className="text-jarvis-gray hover:text-jarvis-cyan transition-colors text-2xl"
                title="Settings"
              >
                <span aria-hidden>⚙️</span>
              </motion.button>
            </div>
          </div>
          <p className="text-jarvis-gray">Here's where you stand today</p>
        </motion.div>

        {/* Mood selector (prominent) */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="heading-md">Morning. How we feeling?</h2>
            <p className="text-sm text-jarvis-gray">Quick check-in</p>
          </div>

          <div className="flex items-center gap-3">
            {[
              { emoji: '🔥', label: "Let's go" },
              { emoji: '😌', label: 'Good' },
              { emoji: '😐', label: 'Meh' },
              { emoji: '😓', label: 'Struggling' },
              { emoji: '💤', label: 'Cooked' }
            ].map((m, i) => (
              <button
                key={m.label}
                onClick={() => handleMoodSelect(i)}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-transform focus:outline-none ${selectedMood === i ? 'ring-2 ring-jarvis-cyan bg-jarvis-cyan/10 scale-105' : 'bg-jarvis-navy-light/30 hover:bg-jarvis-navy-light/50'}`}
                aria-pressed={selectedMood === i}
                title={m.label}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[11px] text-jarvis-gray mt-1">{m.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Unified Today's Status (glass card) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mb-8"
        >
          <div className="glass-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Today's Status</h3>
                <p className="text-sm text-jarvis-gray mt-1">You hit 2/3 dimensions</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-jarvis-cyan font-medium">Streak: 4 days</div>
                <div className="text-xs text-jarvis-gray mt-1">Longest: 28 days</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-start gap-2">
                <div className="text-sm text-jarvis-gray">Workout</div>
                <div className="text-base font-medium">✗</div>
              </div>
              <div className="flex flex-col items-start gap-2">
                <div className="text-sm text-jarvis-gray">Tasks</div>
                <div className="text-base font-medium">2/3</div>
              </div>
              <div className="flex flex-col items-start gap-2">
                <div className="text-sm text-jarvis-gray">Meditation</div>
                <div className="text-base font-medium">✗</div>
              </div>
            </div>

            <div className="mt-4 text-sm text-jarvis-gray">I'll keep watching for patterns and nudge you when it matters.</div>
          </div>
        </motion.div>

        {/* Dimension Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <DimensionCard
            dimension="physical"
            status={dimensionsData.physical.status}
            score={dimensionsData.physical.score}
            insight={dimensionsData.physical.insight}
            emoji={dimensionsData.physical.emoji}
          />
          <DimensionCard
            dimension="mental"
            status={dimensionsData.mental.status}
            score={dimensionsData.mental.score}
            insight={dimensionsData.mental.insight}
            emoji={dimensionsData.mental.emoji}
          />
          <DimensionCard
            dimension="spiritual"
            status={dimensionsData.spiritual.status}
            score={dimensionsData.spiritual.score}
            insight={dimensionsData.spiritual.insight}
            emoji={dimensionsData.spiritual.emoji}
          />
        </motion.div>

        {/* Primary actions: Voice Log prominent, manual log secondary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-stretch gap-4"
        >
          <div className="glass-card p-4 cursor-pointer" onClick={() => window.location.href = '/log'}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-jarvis-cyan/15 flex items-center justify-center">
                <span className="text-2xl">🎤</span>
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Voice Log</div>
                <div className="text-sm text-jarvis-gray">Hold to speak — quick and easy</div>
              </div>
              <div className="text-jarvis-cyan font-medium">Hold to record</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={handleLogSomething} variant="secondary" className="flex-1 px-8 py-3">
              Log manually
            </Button>

            {!showMoodCheck && (
              <button
                onClick={() => setShowMoodCheck(true)}
                className="text-sm text-jarvis-gray hover:text-jarvis-cyan transition-colors"
              >
                or quick mood check
              </button>
            )}
          </div>
        </motion.div>

        {/* Bottom spacing */}
        <div className="h-8" />
      </Container>
    </PageLayout>
  );
};
