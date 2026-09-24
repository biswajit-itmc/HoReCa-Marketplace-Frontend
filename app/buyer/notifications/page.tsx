'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Tag, CreditCard, Info, Bell, CheckCheck } from 'lucide-react';
import { useApp } from '@/lib/store';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import type { Notification } from '@/types';

const iconMap: Record<Notification['type'], typeof Package> = {
  order: Package,
  product: Info,
  offer: Tag,
  payment: CreditCard,
  system: Info,
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  const buyerNotifications = useMemo(() => {
    return notifications
      .filter((n) => n.role === 'buyer' || n.role === 'all')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [notifications]);

  const unreadCount = buyerNotifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>
            <CheckCheck className="mr-1.5 h-4 w-4" /> Mark all read
          </Button>
        )}
      </PageHeader>

      {buyerNotifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up. New updates will appear here." />
      ) : (
        <div className="space-y-2">
          {buyerNotifications.map((n, i) => {
            const Icon = iconMap[n.type] || Info;
            return (
              <motion.button
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                onClick={() => !n.read && markNotificationRead(n.id)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors',
                  n.read ? 'border-border bg-card' : 'border-forest-200 bg-forest-50/50'
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                    n.read ? 'bg-muted text-muted-foreground' : 'bg-forest-500 text-white'
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-forest-500" />}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.date)}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
