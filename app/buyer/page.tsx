'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  ClipboardList,
  Truck,
  Wallet,
  Building2,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { mockBuyer, buyerPromotions } from '@/data/mock';
import { products } from '@/data/products';
import { suppliers } from '@/data/suppliers';
import { categories } from '@/data/categories';
import { formatINR, getGreeting } from '@/lib/format';
import { DashboardStat } from '@/components/shared/DashboardStat';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { SupplierCard } from '@/components/shared/SupplierCard';
import { ProductCard } from '@/components/shared/ProductCard';
import { PromoCarousel } from '@/components/shared/PromoCarousel';
import { OrderStatusBadge } from '@/components/shared/StatusBadge';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/format';

export default function BuyerDashboardPage() {
  const router = useRouter();
  const { orders, savedSuppliers, recentlyViewed } = useApp();
  const [query, setQuery] = useState('');

  const activeOrders = orders.filter(
    (o) => !['delivered', 'cancelled', 'rejected'].includes(o.status)
  ).length;
  const pendingDeliveries = orders.filter((o) =>
    ['accepted', 'packed', 'dispatched'].includes(o.status)
  ).length;
  const totalSpent = mockBuyer.totalSpent;
  const savedSuppliersCount = savedSuppliers.length;

  const trendingProducts = products.filter((p) => p.trending).slice(0, 8);
  const recommendedSuppliers = suppliers.slice(0, 4);
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);
  const recentlyViewedProducts = recentlyViewed
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p))
    .slice(0, 8);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/buyer/marketplace${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
          {getGreeting()}, {mockBuyer.name.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with {mockBuyer.businessName} today.
        </p>

        <form onSubmit={handleSearch} className="mt-4 max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for equipment, suppliers, categories..."
              className="h-11 rounded-lg pl-10"
            />
          </div>
        </form>
      </motion.div>

      <PromoCarousel promotions={buyerPromotions} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <DashboardStat
          icon={ClipboardList}
          label="Active Orders"
          value={String(activeOrders)}
          accent="forest"
          index={0}
        />
        <DashboardStat
          icon={Truck}
          label="Pending Deliveries"
          value={String(pendingDeliveries)}
          accent="amber"
          index={1}
        />
        <DashboardStat
          icon={Wallet}
          label="Total Spent"
          value={formatINR(totalSpent)}
          accent="blue"
          index={2}
        />
        <DashboardStat
          icon={Building2}
          label="Saved Suppliers"
          value={String(savedSuppliersCount)}
          accent="beige"
          index={3}
        />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-foreground">Popular Categories</h2>
          <Link href="/buyer/marketplace" className="flex items-center gap-1 text-sm font-medium text-forest-600 hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {categories.slice(0, 12).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
            >
              <Link
                href={`/buyer/marketplace?category=${cat.id}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-forest-200 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-50 text-forest-600">
                  <CategoryIcon name={cat.icon} className="h-5 w-5" />
                </div>
                <span className="line-clamp-2 text-xs font-medium text-foreground">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-foreground">Recommended Suppliers</h2>
          <Link href="/buyer/suppliers" className="flex items-center gap-1 text-sm font-medium text-forest-600 hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommendedSuppliers.map((s, i) => (
            <SupplierCard key={s.id} supplier={s} index={i} />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-foreground">Trending Products</h2>
          <Link href="/buyer/marketplace" className="flex items-center gap-1 text-sm font-medium text-forest-600 hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {trendingProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-foreground">Recent Orders</h2>
          <Link href="/buyer/orders" className="flex items-center gap-1 text-sm font-medium text-forest-600 hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {recentOrders.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/buyer/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.supplierName}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(order.date)}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{formatINR(order.total)}</p>
                  <OrderStatusBadge status={order.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {recentlyViewedProducts.length > 0 && (
        <div>
          <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Recently Viewed</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {recentlyViewedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
