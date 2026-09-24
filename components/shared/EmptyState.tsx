import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-50 text-forest-500">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button className="mt-5 bg-forest-500 text-white hover:bg-forest-600">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
