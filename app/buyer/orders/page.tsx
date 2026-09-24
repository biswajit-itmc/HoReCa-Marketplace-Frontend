'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { useApp } from '@/lib/store';
import { formatINRFull, formatDate } from '@/lib/format';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils';

type FilterTab = 'all' | 'active' | 'delivered' | 'cancelled';

const tabs: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function OrdersPage() {
  const { orders } = useApp();
  const [tab, setTab] = useState<FilterTab>('all');

  const filtered = useMemo(() => {
    const sorted = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (tab === 'all') return sorted;
    if (tab === 'delivered') return sorted.filter((o) => o.status === 'delivered');
    if (tab === 'cancelled') return sorted.filter((o) => o.status === 'cancelled' || o.status === 'rejected');
    return sorted.filter((o) => !['delivered', 'cancelled', 'rejected'].includes(o.status));
  }, [orders, tab]);

  return (
    <div className="space-y-6">
      <PageHeader title="My Orders" description="Track and manage all your orders" />

      <div className="flex gap-1 overflow-x-auto rounded-lg bg-muted p-1">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              'shrink-0 rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              tab === t.value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders found"
          description="You don't have any orders in this category yet."
          actionLabel="Browse Marketplace"
          actionHref="/buyer/marketplace"
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                >
                  <td className="px-4 py-3">
                    <Link href={`/buyer/orders/${order.id}`} className="font-medium text-forest-600 hover:underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-foreground">{order.supplierName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(order.date)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.items.length}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{formatINRFull(order.total)}</td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
