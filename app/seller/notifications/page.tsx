'use client';

import { motion } from 'framer-motion';
import { Bell, Package, CreditCard, Tag, Info, CheckCheck } from 'lucide-react';
import { useApp } from '@/lib/store';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types';

const iconMap: Record<Notification['type'], typeof Package> = {
  order: Package,
  payment: CreditCard,
  product: Tag,
  offer: Tag,
  system: Info,
};

export default function SellerNotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  const sellerNotifications = [...notifications]
    .filter((n) => n.role === 'seller' || n.role === 'all')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const unreadCount = sellerNotifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Stay up to date with your store activity.">
        {unreadCount > 0 && (
          <Button variant="outline" onClick={() => markAllNotificationsRead()}>
            <CheckCheck className="mr-1.5 h-4 w-4" /> Mark all read
          </Button>
        )}
      </PageHeader>

      {sellerNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up. New notifications will appear here."
        />
      ) : (
        <div className="space-y-2">
          {sellerNotifications.map((notification, index) => {
            const Icon = iconMap[notification.type] ?? Info;
            return (
              <motion.button
                key={notification.id}
                type="button"
                onClick={() => !notification.read && markNotificationRead(notification.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl border border-border p-4 text-left transition-colors',
                  notification.read ? 'bg-card' : 'bg-forest-50/60 hover:bg-forest-50'
                )}
              >
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                    notification.read ? 'bg-muted text-muted-foreground' : 'bg-forest-100 text-forest-600'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{notification.title}</p>
                    {!notification.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-forest-500" />}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{notification.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(notification.date)}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
