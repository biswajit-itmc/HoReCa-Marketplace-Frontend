'use client';

import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/lib/store';
import { adminUsers, initialPayments } from '@/data/mock';
import { categories } from '@/data/categories';
import { suppliers } from '@/data/suppliers';
import { formatINR } from '@/lib/format';

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const platformRevenue = initialPayments
  .filter((p) => p.status === 'paid')
  .reduce((sum, p) => sum + p.amount, 0);

const revenueTrend = [
  { month: 'Apr', revenue: Math.round(platformRevenue * 0.48) },
  { month: 'May', revenue: Math.round(platformRevenue * 0.58) },
  { month: 'Jun', revenue: Math.round(platformRevenue * 0.66) },
  { month: 'Jul', revenue: Math.round(platformRevenue * 0.78) },
  { month: 'Aug', revenue: Math.round(platformRevenue * 0.9) },
  { month: 'Sep', revenue: platformRevenue },
];

// Bucket signups by joined month
function buildSignupTrend() {
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const monthIndexMap: Record<string, number> = { '03': 0, '04': 0, '05': 1, '06': 2, '07': 3, '08': 4, '09': 5 };
  const buckets = months.map((m) => ({ month: m, buyers: 0, sellers: 0 }));
  adminUsers.forEach((u) => {
    const monthKey = u.joinedDate.slice(5, 7);
    const idx = monthIndexMap[monthKey] ?? 5;
    if (u.role === 'buyer') buckets[idx].buyers += 1;
    else buckets[idx].sellers += 1;
  });
  // make it feel like an ongoing platform with cumulative growth baseline
  let cumBuyers = 2;
  let cumSellers = 3;
  return buckets.map((b) => {
    cumBuyers += b.buyers;
    cumSellers += b.sellers;
    return { month: b.month, Buyers: cumBuyers, Sellers: cumSellers };
  });
}

const signupTrend = buildSignupTrend();

const topCategories = [...categories]
  .sort((a, b) => b.productCount - a.productCount)
  .slice(0, 6)
  .map((c) => ({ name: c.name, products: c.productCount }));

const topSuppliers = [...suppliers]
  .sort((a, b) => b.totalOrders - a.totalOrders)
  .slice(0, 6)
  .map((s) => ({ name: s.name.length > 18 ? s.name.slice(0, 16) + '…' : s.name, orders: s.totalOrders }));

export default function AdminAnalyticsPage() {
  const { orders } = useApp();

  const ordersByMonth = (() => {
    const map = new Map<string, number>();
    orders.forEach((o) => {
      const d = new Date(o.date);
      const key = d.toLocaleDateString('en-IN', { month: 'short' });
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([month, count]) => ({ month, orders: count }));
  })();

  return (
    <div>
      <PageHeader title="Analytics" description="Platform-wide performance and growth metrics." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="analyticsRevGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => formatINR(v)} width={64} />
                    <Tooltip formatter={(v: number) => formatINR(v)} />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#analyticsRevGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Orders Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ordersByMonth} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} width={32} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Buyer vs Seller Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={signupTrend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} width={32} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Buyers" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Sellers" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Top Categories by Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topCategories}
                      dataKey="products"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {topCategories.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Top Suppliers by Order Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSuppliers} layout="vertical" margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border/50" />
                    <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={12} width={140} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="hsl(var(--chart-4))" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
