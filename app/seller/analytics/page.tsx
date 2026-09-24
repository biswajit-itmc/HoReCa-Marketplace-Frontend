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
  Legend,
} from 'recharts';
import { useApp } from '@/lib/store';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { formatINR } from '@/lib/format';
import { sellerPayments, sellerCustomers } from '@/data/mock';

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

const salesConfig: ChartConfig = {
  revenue: { label: 'Revenue', color: 'hsl(var(--chart-1))' },
};

const ordersConfig: ChartConfig = {
  orders: { label: 'Orders', color: 'hsl(var(--chart-1))' },
};

const productsConfig: ChartConfig = {
  orders: { label: 'Orders', color: 'hsl(var(--chart-1))' },
};

const customerConfig: ChartConfig = {
  customers: { label: 'Customers', color: 'hsl(var(--chart-1))' },
};

const CATEGORY_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function SellerAnalyticsPage() {
  const { sellerProducts } = useApp();

  const totalRevenue = sellerPayments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

  const salesWeights = [0.6, 0.68, 0.82, 0.76, 0.94, 1.2];
  const salesBase = totalRevenue / salesWeights.reduce((a, b) => a + b, 0);
  const salesData = MONTHS.map((month, i) => ({
    month,
    revenue: Math.round((salesBase * salesWeights[i]) / 100) * 100,
  }));

  const ordersWeights = [0.55, 0.7, 0.8, 0.75, 0.9, 1.1];
  const totalOrders = Math.max(sellerProducts.reduce((s, p) => s + p.ordersCount, 0), 20);
  const ordersBase = totalOrders / ordersWeights.reduce((a, b) => a + b, 0);
  const ordersData = MONTHS.map((month, i) => ({
    month,
    orders: Math.max(1, Math.round(ordersBase * ordersWeights[i])),
  }));

  const topProductsData = [...sellerProducts]
    .sort((a, b) => b.ordersCount - a.ordersCount)
    .slice(0, 5)
    .map((p) => ({ name: p.name.length > 18 ? `${p.name.slice(0, 18)}...` : p.name, orders: p.ordersCount }));

  const categoryRevenue = new Map<string, number>();
  sellerProducts.forEach((p) => {
    const revenueProxy = p.price * Math.max(p.ordersCount, 1);
    categoryRevenue.set(p.category, (categoryRevenue.get(p.category) ?? 0) + revenueProxy);
  });
  const categoryData = Array.from(categoryRevenue.entries()).map(([name, value]) => ({ name, value }));

  const customerGrowthWeights = [0.35, 0.48, 0.6, 0.72, 0.85, 1];
  const targetCustomers = Math.max(sellerCustomers.length, 5);
  const customerData = MONTHS.map((month, i) => ({
    month,
    customers: Math.max(1, Math.round(targetCustomers * customerGrowthWeights[i])),
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Insights into your store's performance." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Sales Over Time" delay={0}>
          <ChartContainer config={salesConfig} className="aspect-auto h-72 w-full">
            <AreaChart data={salesData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsSalesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => formatINR(v)} width={64} />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatINR(Number(value))} />} />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="url(#analyticsSalesFill)" strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Orders Over Time" delay={0.05}>
          <ChartContainer config={ordersConfig} className="aspect-auto h-72 w-full">
            <BarChart data={ordersData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="orders" fill="var(--color-orders)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Top Products by Orders" delay={0.1}>
          <ChartContainer config={productsConfig} className="aspect-auto h-72 w-full">
            <BarChart data={topProductsData} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                width={130}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="orders" fill="var(--color-orders)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Revenue by Category" delay={0.15}>
          <ChartContainer config={{}} className="aspect-auto h-72 w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatINR(Number(value))} />} />
              <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {categoryData.map((entry, index) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={48}
                wrapperStyle={{ fontSize: 11 }}
              />
            </PieChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Customer Growth" delay={0.2} className="lg:col-span-2">
          <ChartContainer config={customerConfig} className="aspect-auto h-72 w-full">
            <LineChart data={customerData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="customers" stroke="var(--color-customers)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ChartContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  delay,
  children,
  className,
}: {
  title: string;
  delay: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay }}
      className={className}
    >
      <Card className="rounded-xl border-border p-5">
        <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">{title}</h2>
        {children}
      </Card>
    </motion.div>
  );
}
