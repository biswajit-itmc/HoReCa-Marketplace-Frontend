'use client';

import Link from 'next/link';
import { Bell, Package, Tag, CreditCard, Info } from 'lucide-react';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Role } from '@/types';

const iconMap = {
  order: Package,
  product: Tag,
  offer: Tag,
  payment: CreditCard,
  system: Info,
};

interface NotificationDropdownProps {
  unreadCount: number;
  role: Role;
}

export function NotificationDropdown({ unreadCount, role }: NotificationDropdownProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const roleNotifications = notifications
    .filter((n) => n.role === 'all' || n.role === role)
    .slice(0, 6);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-forest-500 text-xs font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="font-serif text-sm font-semibold text-foreground">Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-medium text-forest-600 hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {roleNotifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications</p>
          ) : (
            roleNotifications.map((n) => {
              const Icon = iconMap[n.type] || Info;
              return (
                <button
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={cn(
                    'flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted/50',
                    !n.read && 'bg-forest-50/50'
                  )}
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.date)}</p>
                  </div>
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-forest-500" />}
                </button>
              );
            })
          )}
        </div>
        <Link
          href={`/${role === 'admin' ? 'admin' : role}/notifications`}
          className="block border-t border-border px-4 py-2.5 text-center text-sm font-medium text-forest-600 hover:bg-muted/50"
        >
          View all notifications
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
