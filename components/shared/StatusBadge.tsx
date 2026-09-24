'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { OrderStatus, PaymentStatus, ProductStatus } from '@/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
  placed: { label: 'Order Placed', className: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  accepted: { label: 'Accepted', className: 'bg-forest-100 text-forest-700 border-forest-200', dot: 'bg-forest-500' },
  packed: { label: 'Packed', className: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  dispatched: { label: 'Dispatched', className: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  delivered: { label: 'Delivered', className: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-200 text-gray-700 border-gray-300', dot: 'bg-gray-500' },
  paid: { label: 'Paid', className: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  refunded: { label: 'Refunded', className: 'bg-gray-200 text-gray-700 border-gray-300', dot: 'bg-gray-500' },
  active: { label: 'Active', className: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
  inactive: { label: 'Inactive', className: 'bg-gray-200 text-gray-700 border-gray-300', dot: 'bg-gray-400' },
  out_of_stock: { label: 'Out of Stock', className: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  verified: { label: 'Verified', className: 'bg-forest-100 text-forest-700 border-forest-200', dot: 'bg-forest-500' },
  suspended: { label: 'Suspended', className: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
};

interface StatusBadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
  animate?: boolean;
}

export function StatusBadge({ status, label, size = 'sm', animate = false }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: label || status,
    className: 'bg-gray-100 text-gray-700 border-gray-200',
    dot: 'bg-gray-400',
  };

  const content = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        config.className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {label || config.label}
    </span>
  );

  if (animate) {
    return (
      <AnimatePresence mode="wait">
        <motion.span
          key={status}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          {content}
        </motion.span>
      </AnimatePresence>
    );
  }

  return content;
}

export function OrderStatusBadge({ status, size = 'sm' }: { status: OrderStatus; size?: 'sm' | 'md' }) {
  return <StatusBadge status={status} size={size} animate />;
}

export function PaymentStatusBadge({ status, size = 'sm' }: { status: PaymentStatus; size?: 'sm' | 'md' }) {
  return <StatusBadge status={status} size={size} />;
}

export function ProductStatusBadge({ status, size = 'sm' }: { status: ProductStatus; size?: 'sm' | 'md' }) {
  return <StatusBadge status={status} size={size} />;
}
