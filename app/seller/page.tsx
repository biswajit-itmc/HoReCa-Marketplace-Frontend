'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  IndianRupee,
  Clock,
  AlertTriangle,
  ArrowRight,
  Package,
  Users,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useApp } from '@/lib/store';
import { DashboardStat } from '@/components/shared/DashboardStat';
import { OrderStatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { PromoCarousel } from '@/components/shared/PromoCarousel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatINR, formatINRFull, formatDate, getGreeting } from '@/lib/format';
import { sellerPayments, sellerCustomers, sellerPromotions } from '@/data/mock';
import { suppliers } from '@/data/suppliers';
import { toast } from 'sonner';

const LOW_STOCK_THRESHOLD = 15;

export default function SellerDashboardPage() {
  const { orders, sellerProducts } = useApp();

  const supplier = suppliers.find((s) => s.id === 'sup-1');
  const sellerOrders = orders.filter((o) => o.supplierId === 'sup-1');

  const revenue = sellerPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingOrders = sellerOrders.filter((o) =>
    ['placed', 'accepted', 'packed', 'dispatched'].includes(o.status)
  ).length;

  const lowStockProducts = sellerProducts.filter((p) => p.stock <= LOW_STOCK_THRESHOLD);

  const recentOrders = [...sellerOrders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const topProducts = [...sellerProducts]
    .sort((a, b) => b.ordersCount - a.ordersCount)
    .slice(0, 5);

  const recentCustomers = [...sellerCustomers]
    .sort((a, b) => new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime())
    .slice(0, 4);

  // Synthesize a realistic-looking 6-month revenue trend proportionate to actual paid revenue.
  const salesTrend = (() => {
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const weights = [0.62, 0.7, 0.85, 0.78, 0.95, 1.15];
    const base = revenue / weights.reduce((a, b) => a + b, 0);
    return months.map((month, i) => ({
      month,
      revenue: Math.round((base * weights[i]) / 100) * 100,
    }));
  })();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
          {getGreeting()}, {supplier?.name ?? 'Royal Kitchen Equipments'}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your store today.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          icon={ClipboardList}
          label="Total Orders"
          value={sellerOrders.length.toString()}
          index={0}
          accent="forest"
        />
        <DashboardStat
          icon={IndianRupee}
          label="Revenue"
          value={formatINR(revenue)}
          index={1}
          accent="beige"
        />
        <DashboardStat
          icon={Clock}
          label="Pending Orders"
          value={pendingOrders.toString()}
          index={2}
          accent="amber"
        />
        <DashboardStat
          icon={AlertTriangle}
          label="Low Stock"
          value={lowStockProducts.length.toString()}
          index={3}
          accent="blue"
        />
      </div>

      <PromoCarousel promotions={sellerPromotions} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="rounded-xl border-border p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-foreground">Recent Orders</h2>
              <Link href="/seller/orders" className="flex items-center gap-1 text-sm font-medium text-forest-600 hover:text-forest-700">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No orders yet"
                description="Orders placed by buyers will appear here."
              />
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href="/seller/orders"
                    className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{order.id}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {order.buyerName} · {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {formatDate(order.date)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="font-medium text-foreground">{formatINRFull(order.total)}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card className="rounded-xl border-border p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-foreground">Low Stock</h2>
              <Link href="/seller/products" className="flex items-center gap-1 text-sm font-medium text-forest-600 hover:text-forest-700">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {lowStockProducts.length === 0 ? (
              <EmptyState
                icon={Package}
                title="Stock levels healthy"
                description={`All products have more than ${LOW_STOCK_THRESHOLD} units in stock.`}
              />
            ) : (
              <div className="space-y-2">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-amber-700">{product.stock} units left</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 border-amber-300 text-amber-700 hover:bg-amber-100"
                      onClick={() => toast.success(`Restock request created for ${product.name}`)}
                    >
                      Restock
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="rounded-xl border-border p-5">
            <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">Sales Overview</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sellerRevenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E6F40" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2E6F40" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(v) => formatINR(v)}
                    width={60}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2E6F40"
                    strokeWidth={2}
                    fill="url(#sellerRevenueFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card className="rounded-xl border-border p-5">
            <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">Top Products</h2>
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-100 text-xs font-semibold text-forest-700">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.ordersCount} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="rounded-xl border-border p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-foreground">Recent Customers</h2>
            <Link href="/seller/customers" className="flex items-center gap-1 text-sm font-medium text-forest-600 hover:text-forest-700">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-100 text-xs font-semibold text-forest-700">
                  <Users className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {customer.totalOrders} orders · {formatINR(customer.totalSpent)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
