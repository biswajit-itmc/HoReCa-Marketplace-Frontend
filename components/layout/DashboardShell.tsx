'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardShellProps {
  title: string;
  subtitle: string;
  navItems: DashboardNavItem[];
  children: React.ReactNode;
}

export function DashboardShell({ title, subtitle, navItems, children }: DashboardShellProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24">
            <div className="mb-4 px-2">
              <p className="font-serif text-lg font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-forest-500 text-white shadow-sm'
                      : 'text-muted-foreground hover:bg-forest-50 hover:text-forest-700'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile top scroll nav */}
        <div className="fixed inset-x-0 top-16 z-40 border-b border-border bg-background/95 backdrop-blur lg:hidden">
          <nav className="scrollbar-hide flex gap-1 overflow-x-auto px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-forest-500 text-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <main className="min-w-0 flex-1 pt-12 lg:pt-0">{children}</main>
      </div>
    </div>
  );
}
