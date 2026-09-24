'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatINRFull, formatDate } from '@/lib/format';
import { sellerCustomers } from '@/data/mock';

export default function SellerCustomersPage() {
  const customers = [...sellerCustomers].sort(
    (a, b) => new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime()
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Buyers who have ordered from your store." />

      {customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Once buyers order from your store, they'll appear here."
        />
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-100 text-xs font-semibold text-forest-700">
                          {customer.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{customer.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{customer.phone}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{customer.location}</TableCell>
                    <TableCell className="text-sm text-foreground">{customer.totalOrders}</TableCell>
                    <TableCell className="text-sm font-medium text-foreground">
                      {formatINRFull(customer.totalSpent)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(customer.lastOrder)}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/seller/orders?buyer=${encodeURIComponent(customer.name)}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-forest-600 hover:text-forest-700"
                      >
                        View Orders <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
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
