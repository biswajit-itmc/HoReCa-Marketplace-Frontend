'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CreditCard } from 'lucide-react';
import { initialPayments } from '@/data/mock';
import { formatINRFull, formatDate } from '@/lib/format';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { PaymentStatusBadge } from '@/components/shared/StatusBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const methods = Array.from(new Set(initialPayments.map((p) => p.method)));
const statuses = Array.from(new Set(initialPayments.map((p) => p.status)));

export default function PaymentsPage() {
  const [method, setMethod] = useState('all');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    return [...initialPayments]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((p) => (method === 'all' || p.method === method) && (status === 'all' || p.status === status));
  }, [method, status]);

  return (
    <div className="space-y-6">
      <PageHeader title="Payment History" description="View all your past transactions" />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="h-10 w-full sm:w-52">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All methods</SelectItem>
            {methods.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-10 w-full sm:w-52">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payments found"
          description="Try adjusting your filters to see more transactions."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium text-foreground">{p.id}</td>
                  <td className="px-4 py-3">
                    <Link href={`/buyer/orders/${p.orderId}`} className="text-forest-600 hover:underline">
                      {p.orderId}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.supplierName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(p.date)}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{formatINRFull(p.amount)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.method}</td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
