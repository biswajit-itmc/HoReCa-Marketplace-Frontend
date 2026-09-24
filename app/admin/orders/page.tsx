'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Eye } from 'lucide-react';
import { useApp } from '@/lib/store';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate, formatINRFull } from '@/lib/format';
import type { Order } from '@/types';

export default function AdminOrdersPage() {
  const { orders } = useApp();
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    const sorted = [...orders].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (statusFilter === 'all') return sorted;
    return sorted.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Read-only oversight of all orders placed across the platform."
      />

      <Card className="rounded-xl">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full rounded-lg sm:w-48">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="placed">Placed</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="packed">Packed</SelectItem>
              <SelectItem value="dispatched">Dispatched</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4"
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No orders found"
            description="No orders match the selected filter yet."
          />
        ) : (
          <Card className="rounded-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="whitespace-nowrap font-medium">{order.id}</TableCell>
                        <TableCell className="whitespace-nowrap">{order.buyerName}</TableCell>
                        <TableCell className="whitespace-nowrap">{order.supplierName}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatINRFull(order.total)}</TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={order.paymentStatus} />
                        </TableCell>
                        <TableCell>
                          <OrderStatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{formatDate(order.date)}</TableCell>
                        <TableCell className="text-right">
                          <button
                            onClick={() => setDetailOrder(order)}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-forest-600 hover:bg-forest-50"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      <Dialog open={!!detailOrder} onOpenChange={(open) => !open && setDetailOrder(null)}>
        <DialogContent className="max-w-lg">
          {detailOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif">Order {detailOrder.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Buyer</p>
                    <p className="font-medium text-foreground">{detailOrder.buyerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Supplier</p>
                    <p className="font-medium text-foreground">{detailOrder.supplierName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <OrderStatusBadge status={detailOrder.status} />
                  <PaymentStatusBadge status={detailOrder.paymentStatus} />
                </div>
                <div className="divide-y divide-border rounded-lg border border-border">
                  {detailOrder.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between p-3">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {formatINRFull(item.price)}
                        </p>
                      </div>
                      <p className="font-medium">{formatINRFull(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 border-t border-border pt-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatINRFull(detailOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery Fee</span>
                    <span>{formatINRFull(detailOrder.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>{formatINRFull(detailOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between pt-1 text-base font-semibold text-foreground">
                    <span>Total</span>
                    <span>{formatINRFull(detailOrder.total)}</span>
                  </div>
                </div>
                <div className="border-t border-border pt-3 text-muted-foreground">
                  <p>Delivery: {detailOrder.deliveryAddress}, {detailOrder.deliveryCity} - {detailOrder.deliveryPincode}</p>
                  <p className="mt-1">Placed on {formatDate(detailOrder.date)}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
