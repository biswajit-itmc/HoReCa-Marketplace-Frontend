'use client';

import Link from 'next/link';
import { Star, MapPin, CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Supplier } from '@/types';
import { cn } from '@/lib/utils';

interface SupplierCardProps {
  supplier: Supplier;
  index?: number;
}

export function SupplierCard({ supplier, index = 0 }: SupplierCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Link href={`/buyer/suppliers/${supplier.id}`}>
        <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-forest-200 hover:shadow-lg">
          <div className="mb-4 flex items-start gap-3">
            <div className={cn(
              'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold',
              supplier.verified ? 'bg-forest-500 text-white' : 'bg-muted text-muted-foreground'
            )}>
              {supplier.logo}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="truncate font-serif text-base font-semibold text-foreground">
                {supplier.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {supplier.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-2 py-0.5 text-xs font-medium text-forest-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                )}
                <span className="flex items-center gap-0.5 text-xs text-amber-500">
                  <Star className="h-3 w-3 fill-amber-500" />
                  {supplier.rating}
                </span>
              </div>
            </div>
          </div>

          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {supplier.description}
          </p>

          <div className="mb-4 space-y-1.5 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {supplier.location}
            </p>
            <p className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              {supplier.productCount}+ Products · Est. {supplier.established}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {supplier.categories.slice(0, 2).map((cat) => (
                <span key={cat} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {cat}
                </span>
              ))}
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-forest-600 transition-transform group-hover:translate-x-0.5">
              View
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
