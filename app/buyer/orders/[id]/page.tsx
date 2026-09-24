'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, MapPin, CreditCard, Download, PartyPopper, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/lib/store';
import { formatINRFull, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/shared/EmptyState';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { orders } = useApp();
  const order = orders.find((o) => o.id === params.id);
  const isSuccess = searchParams.get('success') === '1';

  if (!order) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Order not found"
        description="We couldn't find this order. It may have been removed."
        actionLabel="Back to Orders"
        actionHref="/buyer/orders"
      />
    );
  }

  return (
    <div className="space-y-6">
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-forest-200 bg-forest-50 p-4"
        >
          <PartyPopper className="h-6 w-6 text-forest-600" />
          <div>
            <p className="font-semibold text-forest-800">Order placed successfully!</p>
            <p className="text-sm text-forest-700">
              Your order {order.id} has been confirmed and sent to {order.supplierName}.
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Order {order.id}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Placed on {formatDate(order.date)}</p>
        </div>
        <OrderStatusBadge status={order.status} size="md" />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-6 font-serif text-lg font-semibold text-foreground">Order Timeline</h2>
        <div className="space-y-0">
          {order.timeline.map((event, i) => (
            <div key={event.status} className="relative flex gap-4 pb-8 last:pb-0">
              {i < order.timeline.length - 1 && (
                <span
                  className={cn(
                    'absolute left-[15px] top-8 h-full w-0.5',
                    event.completed ? 'bg-forest-500' : 'bg-border'
                  )}
                />
              )}
              <span
                className={cn(
                  'z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  event.completed ? 'bg-forest-500 text-white' : 'bg-muted text-muted-foreground'
                )}
              >
                {event.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </span>
              <div className="pt-1">
                <p className={cn('text-sm font-medium', event.completed ? 'text-foreground' : 'text-muted-foreground')}>
                  {event.label}
                </p>
                {event.date && <p className="text-xs text-muted-foreground">{formatDate(event.date)}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">
              Items from{' '}
              <Link href={`/buyer/suppliers/${order.supplierId}`} className="text-forest-600 hover:underline">
                {order.supplierName}
              </Link>
            </h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/buyer/products/${item.productId}`} className="line-clamp-1 text-sm font-medium text-foreground hover:underline">
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatINRFull(item.price)} × {item.quantity} {item.unit}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-foreground">
                    {formatINRFull(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
              <MapPin className="h-5 w-5 text-forest-600" /> Delivery Address
            </h2>
            <p className="text-sm text-muted-foreground">
              {order.deliveryAddress}, {order.deliveryCity} - {order.deliveryPincode}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.buyerPhone} · {order.buyerEmail}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
              <CreditCard className="h-5 w-5 text-forest-600" /> Payment
            </h2>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Method</span>
              <span className="font-medium text-foreground">{order.paymentMethod}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-serif text-lg font-semibold text-foreground">Order Total</h2>
              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">{formatINRFull(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium text-foreground">
                    {order.deliveryFee === 0 ? 'Free' : formatINRFull(order.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST</span>
                  <span className="font-medium text-foreground">{formatINRFull(order.tax)}</span>
                </div>
                <div className="my-2 border-t border-border" />
                <div className="flex justify-between text-base">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-serif font-bold text-foreground">{formatINRFull(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-serif text-base font-semibold text-foreground">Invoice</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Download a copy of the invoice for order {order.id}.
              </p>
              <Button
                variant="outline"
                className="mt-3 w-full"
                onClick={() => toast.success('Invoice download simulated')}
              >
                <Download className="mr-2 h-4 w-4" /> Download Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
