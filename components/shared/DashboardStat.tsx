'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface DashboardStatProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  index?: number;
  accent?: 'forest' | 'beige' | 'amber' | 'blue';
}

const accentConfig = {
  forest: { bg: 'bg-forest-50', icon: 'text-forest-600', iconBg: 'bg-forest-100' },
  beige: { bg: 'bg-beige-50', icon: 'text-forest-600', iconBg: 'bg-beige-100' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', iconBg: 'bg-amber-100' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', iconBg: 'bg-blue-100' },
};

export function DashboardStat({
  icon: Icon,
  label,
  value,
  trend,
  trendUp = true,
  index = 0,
  accent = 'forest',
}: DashboardStatProps) {
  const colors = accentConfig[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.08, 0.4) }}
      className={cn('rounded-xl border border-border p-5', colors.bg)}
    >
      <div className="flex items-start justify-between">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-lg', colors.iconBg)}>
          <Icon className={cn('h-5 w-5', colors.icon)} />
        </div>
        {trend && (
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              trendUp ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-serif text-2xl font-bold text-foreground">{value}</p>
    </motion.div>
  );
}
