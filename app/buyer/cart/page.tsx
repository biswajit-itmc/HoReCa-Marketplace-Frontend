'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/lib/store';
import { formatINRFull } from '@/lib/format';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';

const FREE_DELIVERY_THRESHOLD = 100000;
const DELIVERY_FEE = 1500;
const GST_RATE = 0.18;

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, cartTotal } = useApp();

  const subtotal = cartTotal;
  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const tax = Math.round(subtotal * GST_RATE);
  const total = subtotal + deliveryFee + tax;

  if (cart.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Cart" />
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Browse the marketplace and add products to your cart to get started."
          actionLabel="Browse Marketplace"
          actionHref="/buyer/marketplace"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Cart" description={`${cart.length} item${cart.length > 1 ? 's' : ''} in your cart`} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {cart.map((item, i) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.05, 0.3) }}
              className="flex gap-4 rounded-xl border border-border bg-card p-4"
            >
              <Link href={`/buyer/products/${item.productId}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/buyer/products/${item.productId}`} className="line-clamp-1 text-sm font-medium text-foreground hover:underline">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">{item.supplierName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">MOQ: {item.moq} {item.unit}</p>
                  </div>
                  <button
                    onClick={() => {
                      removeFromCart(item.productId);
                      toast.success('Item removed from cart');
                    }}
                    className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center rounded-lg border border-border">
                    <button
                      onClick={() => updateCartQuantity(item.productId, Math.max(item.moq, item.quantity - 1))}
                      disabled={item.quantity <= item.moq}
                      className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatINRFull(item.price)} × {item.quantity}
                    </p>
                    <p className="font-serif text-base font-semibold text-foreground">
                      {formatINRFull(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
            <h2 className="font-serif text-lg font-semibold text-foreground">Order Summary</h2>
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatINRFull(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-medium text-foreground">
                  {deliveryFee === 0 ? 'Free' : formatINRFull(deliveryFee)}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-muted-foreground">
                  Free delivery on orders above {formatINRFull(FREE_DELIVERY_THRESHOLD)}
                </p>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%)</span>
                <span className="font-medium text-foreground">{formatINRFull(tax)}</span>
              </div>
              <div className="my-2 border-t border-border" />
              <div className="flex justify-between text-base">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-serif font-bold text-foreground">{formatINRFull(total)}</span>
              </div>
            </div>
            <Link href="/buyer/checkout">
              <Button className="mt-5 w-full bg-forest-500 text-white hover:bg-forest-600" size="lg">
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
