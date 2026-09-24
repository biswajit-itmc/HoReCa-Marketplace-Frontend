'use client';

import { motion } from 'framer-motion';
import {
  Bell,
  ShoppingBag,
  Package,
  Tag,
  Info,
  Wallet,
  CheckCheck,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format';
import type { Notification } from '@/types';

const typeIconMap: Record<Notification['type'], typeof Bell> = {
  order: ShoppingBag,
  product: Package,
  offer: Tag,
  system: Info,
  payment: Wallet,
};

const roleLabel: Record<Notification['role'], string> = {
  buyer: 'Buyer',
  seller: 'Seller',
  admin: 'Admin',
  all: 'All',
  guest: 'Guest',
};

const roleClass: Record<Notification['role'], string> = {
  buyer: 'bg-blue-100 text-blue-700 border-blue-200',
  seller: 'bg-forest-100 text-forest-700 border-forest-200',
  admin: 'bg-purple-100 text-purple-700 border-purple-200',
  all: 'bg-amber-100 text-amber-700 border-amber-200',
  guest: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function AdminNotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Full visibility into platform notifications across all roles."
      >
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={markAllNotificationsRead}
            className="gap-2 rounded-lg"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </PageHeader>

      {sorted.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="There are no notifications on the platform yet."
        />
      ) : (
        <div className="space-y-3">
          {sorted.map((notification, index) => {
            const Icon = typeIconMap[notification.type] || Bell;
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
              >
                <Card
                  className={cn(
                    'cursor-pointer rounded-xl transition-colors',
                    !notification.read && 'border-forest-200 bg-forest-50/40'
                  )}
                  onClick={() => !notification.read && markNotificationRead(notification.id)}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                        notification.read ? 'bg-muted text-muted-foreground' : 'bg-forest-100 text-forest-600'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">{notification.title}</p>
                        <Badge variant="outline" className={cn('text-xs', roleClass[notification.role])}>
                          {roleLabel[notification.role]}
                        </Badge>
                        {!notification.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-forest-500" />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                      <p className="mt-1.5 text-xs text-muted-foreground">{formatDate(notification.date)}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
