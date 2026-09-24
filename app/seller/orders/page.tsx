'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, ChevronDown, Check, X, MapPin, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/lib/store';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { formatINRFull, formatDate } from '@/lib/format';
import type { Order, OrderStatus } from '@/types';
import { cn } from '@/lib/utils';

const FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'placed' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Packed', value: 'packed' },
  { label: 'Dispatched', value: 'dispatched' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Rejected', value: 'rejected' },
];

const NEXT_STATUS: Partial<Record<OrderStatus, { next: OrderStatus; label: string }>> = {
  accepted: { next: 'packed', label: 'Mark Packed' },
  packed: { next: 'dispatched', label: 'Mark Dispatched' },
  dispatched: { next: 'delivered', label: 'Mark Delivered' },
};

export default function SellerOrdersPage() {
  return (
    <Suspense fallback={null}>
      <SellerOrdersContent />
    </Suspense>
  );
}

function SellerOrdersContent() {
  const { orders, updateOrderStatus } = useApp();
  const searchParams = useSearchParams();
  const buyerFilter = searchParams.get('buyer');

  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sellerOrders = useMemo(
    () =>
      orders
        .filter((o) => o.supplierId === 'sup-1')
        .filter((o) => !buyerFilter || o.buyerName === buyerFilter)
        .filter((o) => statusFilter === 'all' || o.status === statusFilter)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [orders, statusFilter, buyerFilter]
  );

  const handleAccept = (order: Order) => {
    updateOrderStatus(order.id, 'accepted');
    toast.success(`Order ${order.id} accepted`);
  };

  const handleReject = (order: Order) => {
    updateOrderStatus(order.id, 'rejected');
    toast.error(`Order ${order.id} rejected`);
  };

  const handleAdvance = (order: Order) => {
    const step = NEXT_STATUS[order.status];
    if (!step) return;
    updateOrderStatus(order.id, step.next);
    toast.success(`Order ${order.id} marked as ${step.next}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description={buyerFilter ? `Showing orders from ${buyerFilter}` : 'Manage incoming orders from buyers.'}
      />

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          {FILTERS.map((f) => (
            <TabsTrigger
              key={f.value}
              value={f.value}
              className="rounded-full border border-border px-4 py-1.5 text-sm data-[state=active]:border-forest-500 data-[state=active]:bg-forest-500 data-[state=active]:text-white"
            >
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {sellerOrders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders found"
          description="No orders match this filter yet. New orders placed by buyers will show up here."
        />
      ) : (
        <div className="space-y-3">
          {sellerOrders.map((order, index) => {
            const nextStep = NEXT_STATUS[order.status];
            const isExpanded = expandedId === order.id;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
              >
                <Card className="overflow-hidden rounded-xl border-border">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="flex w-full flex-col gap-3 p-4 text-left sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-serif text-base font-semibold text-foreground">{order.id}</p>
                        <OrderStatusBadge status={order.status} />
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {order.buyerName} · {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {formatDate(order.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-serif text-lg font-semibold text-foreground">
                        {formatINRFull(order.total)}
                      </span>
                      <ChevronDown
                        className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', isExpanded && 'rotate-180')}
                      />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-border"
                      >
                        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Items
                            </p>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.productId} className="flex items-center justify-between text-sm">
                                  <span className="text-foreground">
                                    {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
                                  </span>
                                  <span className="font-medium text-foreground">
                                    {formatINRFull(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                              <div>
                                <p className="text-foreground">{order.deliveryAddress}</p>
                                <p className="text-muted-foreground">
                                  {order.deliveryCity} - {order.deliveryPincode}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CreditCard className="h-4 w-4 shrink-0 text-muted-foreground" />
                              <span className="text-foreground">{order.paymentMethod}</span>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-3 text-sm">
                              <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>{formatINRFull(order.subtotal)}</span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>Delivery Fee</span>
                                <span>{formatINRFull(order.deliveryFee)}</span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>Tax</span>
                                <span>{formatINRFull(order.tax)}</span>
                              </div>
                              <div className="mt-1 flex justify-between border-t border-border pt-1 font-semibold text-foreground">
                                <span>Total</span>
                                <span>{formatINRFull(order.total)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {(order.status === 'placed' || nextStep) && (
                    <div className="flex flex-wrap gap-2 border-t border-border bg-muted/30 px-4 py-3">
                      {order.status === 'placed' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-forest-500 text-white hover:bg-forest-600"
                            onClick={() => handleAccept(order)}
                          >
                            <Check className="mr-1 h-4 w-4" /> Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleReject(order)}
                          >
                            <X className="mr-1 h-4 w-4" /> Reject
                          </Button>
                        </>
                      )}
                      {nextStep && (
                        <Button
                          size="sm"
                          className="bg-forest-500 text-white hover:bg-forest-600"
                          onClick={() => handleAdvance(order)}
                        >
                          {nextStep.label}
                        </Button>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
