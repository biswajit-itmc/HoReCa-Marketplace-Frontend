'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, Clock, Hash } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { DashboardStat } from '@/components/shared/DashboardStat';
import { PaymentStatusBadge } from '@/components/shared/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatINR, formatINRFull, formatDate } from '@/lib/format';
import { sellerPayments } from '@/data/mock';
import type { PaymentMethod, PaymentStatus } from '@/types';

export default function SellerPaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | PaymentMethod>('all');

  const totalReceived = sellerPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingSettlements = sellerPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const filtered = useMemo(
    () =>
      sellerPayments
        .filter((p) => statusFilter === 'all' || p.status === statusFilter)
        .filter((p) => methodFilter === 'all' || p.method === methodFilter)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [statusFilter, methodFilter]
  );

  const methods: PaymentMethod[] = ['UPI', 'Bank Transfer', 'Cash on Delivery', 'Credit / Pay Later'];

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" description="Track your payments and settlements." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardStat icon={Wallet} label="Total Received" value={formatINR(totalReceived)} index={0} accent="forest" />
        <DashboardStat icon={Clock} label="Pending Settlements" value={formatINR(pendingSettlements)} index={1} accent="amber" />
        <DashboardStat icon={Hash} label="Total Transactions" value={sellerPayments.length.toString()} index={2} accent="blue" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | PaymentStatus)}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Select value={methodFilter} onValueChange={(v) => setMethodFilter(v as 'all' | PaymentMethod)}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="All Methods" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            {methods.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
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
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium text-foreground">{payment.id}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{payment.orderId}</TableCell>
                    <TableCell className="text-sm text-foreground">{payment.buyerName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(payment.date)}</TableCell>
                    <TableCell className="text-sm font-medium text-foreground">{formatINRFull(payment.amount)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{payment.method}</TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={payment.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
