'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container, PageLayout } from '@/components/ui';
import { InterventionFeed } from '@/components/interventions/InterventionFeed';
import { Intervention } from '@/types/intervention';

// Mock data - will be replaced with API polling in Phase 9
const mockInterventions: Intervention[] = [
  {
    id: '1',
    title: 'You might want to take it easier today',
    message: "You've logged high stress 3 days in a row, and your last 2 workouts were marked as 'struggled'. Your body might need a lighter session or rest day.",
    reasoning: "Based on your pattern: high stress + poor workout performance usually means your recovery is suffering. I've seen this lead to injury or burnout in the past 2 weeks when you pushed through it.",
    priority: 'high',
    category: 'rest',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Block some no-meeting time this afternoon',
    message: 'You have 4 meetings back-to-back today. Based on your patterns, this usually leaves you drained and unable to focus on deep work.',
    reasoning: "Every time you've had 3+ consecutive meetings in the past 2 weeks, you reported feeling 'exhausted' or 'scattered' afterward. Protecting even 30 minutes between meetings helps you stay sharp.",
    priority: 'medium',
    category: 'work',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: 'Consider an earlier bedtime tonight',
    message: "You're averaging 6.2 hours of sleep this week (down from your usual 7+). Tomorrow is a training day, and you perform 40% better on 7+ hours.",
    reasoning: "Your workout performance is directly tied to sleep. Last time you trained on <6 hours of sleep, you cut the session short and reported low motivation for 2 days after.",
    priority: 'medium',
    category: 'rest',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    title: 'Take a walk before your 2 PM meeting',
    message: "It's 1:45 PM and you're about to hit your usual afternoon focus dip. A 10-minute walk has helped you stay sharp in similar situations.",
    reasoning: "You've logged the '2-3 PM crash' 8 times in the past 2 weeks. On days when you took a short walk around 2 PM, you reported better energy and focus for the rest of the afternoon.",
    priority: 'low',
    category: 'movement',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    title: 'Your streak is at risk',
    message: "You haven't logged anything today. Quick check-in? Even 30 seconds helps me spot patterns and keep your 12-day streak alive 🔥",
    reasoning: "Consistency is what makes the insights valuable. The more data points I have, the better I can help you spot patterns before they become problems.",
    priority: 'low',
    category: 'general',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  }
];

export const InterventionsPage: React.FC = () => {
  const [interventions, setInterventions] = useState<Intervention[]>(mockInterventions);
  const router = useRouter();

  const handleDismiss = (id: string) => {
    console.log('Dismissed intervention:', id);
    setInterventions(prev => prev.filter(i => i.id !== id));
    // TODO: Send to API in Phase 9
  };

  const handleSnooze = (id: string, hours: number) => {
    console.log(`Snoozed intervention ${id} for ${hours} hours`);
    const snoozeUntil = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    setInterventions(prev =>
      prev.map(i => (i.id === id ? { ...i, snoozedUntil: snoozeUntil } : i))
    );
    // TODO: Send to API in Phase 9
  };

  const handleAction = (id: string, action: string) => {
    console.log('Action taken:', id, action);
    // TODO: Send to API in Phase 9
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
            <h1 className="heading-xl">Interventions 🤝</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-jarvis-gray hover:text-jarvis-cyan transition-colors text-sm"
            >
              ← Back to dashboard
            </button>
          </div>
          <p className="text-jarvis-gray text-lg">
            Timely nudges to help you stay balanced. Dismiss what doesn't resonate.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="glass-card p-4 text-center">
            <div className="text-3xl font-bold text-jarvis-cyan mb-1">
              {interventions.length}
            </div>
            <div className="text-sm text-jarvis-gray">Active</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-3xl font-bold text-jarvis-green mb-1">
              {interventions.filter(i => i.priority === 'high').length}
            </div>
            <div className="text-sm text-jarvis-gray">Important</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-3xl font-bold text-jarvis-amber mb-1">
              {interventions.filter(i => i.priority === 'medium').length}
            </div>
            <div className="text-sm text-jarvis-gray">Heads up</div>
          </div>
        </motion.div>

        {/* Intervention feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <InterventionFeed
            interventions={interventions}
            onDismiss={handleDismiss}
            onSnooze={handleSnooze}
            onAction={handleAction}
          />
        </motion.div>

        {/* Help text */}
        {interventions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-6 glass-card"
          >
            <h3 className="heading-sm mb-3 flex items-center gap-2">
              <span>💡</span> How interventions work
            </h3>
            <ul className="space-y-2 text-sm text-jarvis-gray">
              <li className="flex items-start gap-2">
                <span className="text-jarvis-cyan">→</span>
                <span>I only show interventions when I'm confident they'll help based on your patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jarvis-cyan">→</span>
                <span>Swipe left/right to dismiss, or click the X if you don't find it helpful</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jarvis-cyan">→</span>
                <span>Snooze if the timing isn't right—I'll remind you later</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jarvis-cyan">→</span>
                <span>Click "Why am I seeing this?" to understand the reasoning behind each nudge</span>
              </li>
            </ul>
          </motion.div>
        )}
      </Container>
    </PageLayout>
  );
};
