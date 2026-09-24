'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  ClipboardList,
  Wallet,
  ArrowRight,
  UserPlus,
  AlertCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '@/lib/store';
import { DashboardStat } from '@/components/shared/DashboardStat';
import { PageHeader } from '@/components/shared/PageHeader';
import { OrderStatusBadge, StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { adminUsers, initialPayments } from '@/data/mock';
import { suppliers } from '@/data/suppliers';
import { formatDate, formatINR, formatINRFull } from '@/lib/format';

const platformRevenue = initialPayments
  .filter((p) => p.status === 'paid')
  .reduce((sum, p) => sum + p.amount, 0);

// Synthesize a plausible 6-month revenue trend ending near the current total.
const revenueTrend = [
  { month: 'Apr', revenue: Math.round(platformRevenue * 0.48) },
  { month: 'May', revenue: Math.round(platformRevenue * 0.58) },
  { month: 'Jun', revenue: Math.round(platformRevenue * 0.66) },
  { month: 'Jul', revenue: Math.round(platformRevenue * 0.78) },
  { month: 'Aug', revenue: Math.round(platformRevenue * 0.9) },
  { month: 'Sep', revenue: platformRevenue },
];

const pendingUsers = adminUsers.filter((u) => u.status === 'pending');
const pendingSuppliers = suppliers.filter((s) => s.verificationStatus === 'pending');

const recentSignups = [...adminUsers]
  .sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime())
  .slice(0, 5);

export default function AdminDashboardPage() {
  const { orders } = useApp();
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Platform-wide overview and key metrics." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          icon={Users}
          label="Total Buyers"
          value={adminUsers.filter((u) => u.role === 'buyer').length.toString()}
          index={0}
          accent="forest"
        />
        <DashboardStat
          icon={Building2}
          label="Total Suppliers"
          value={suppliers.length.toString()}
          index={1}
          accent="beige"
        />
        <DashboardStat
          icon={ClipboardList}
          label="Total Orders"
          value={orders.length.toString()}
          index={2}
          accent="blue"
        />
        <DashboardStat
          icon={Wallet}
          label="Platform Revenue"
          value={formatINR(platformRevenue)}
          trend="+18.2%"
          trendUp
          index={3}
          accent="amber"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="adminRevGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2E6F40" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#2E6F40" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      tickFormatter={(v) => formatINR(v)}
                      width={64}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2E6F40"
                      strokeWidth={2}
                      fill="url(#adminRevGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card className="h-full rounded-xl border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Pending Users</p>
                  <p className="text-xs text-muted-foreground">{pendingUsers.length} awaiting review</p>
                </div>
                <Link href="/admin/users">
                  <Button size="sm" variant="outline" className="gap-1">
                    Review <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Pending Suppliers</p>
                  <p className="text-xs text-muted-foreground">{pendingSuppliers.length} awaiting verification</p>
                </div>
                <Link href="/admin/suppliers">
                  <Button size="sm" variant="outline" className="gap-1">
                    Review <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
              {pendingUsers.length === 0 && pendingSuppliers.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Nothing pending right now.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif text-lg">Recent Orders</CardTitle>
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm" className="gap-1 text-forest-600">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="whitespace-nowrap font-medium">{order.id}</TableCell>
                        <TableCell className="whitespace-nowrap">{order.buyerName}</TableCell>
                        <TableCell className="whitespace-nowrap">{order.supplierName}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatINRFull(order.total)}</TableCell>
                        <TableCell>
                          <OrderStatusBadge status={order.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg">
                <UserPlus className="h-5 w-5 text-forest-600" />
                Recent Signups
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentSignups.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-forest-100 text-xs font-medium text-forest-700">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.role === 'buyer' ? 'Buyer' : 'Seller'} · {formatDate(user.joinedDate)}
                    </p>
                  </div>
                  <StatusBadge status={user.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
