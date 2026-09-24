'use client';

import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  Store,
  CreditCard,
  BarChart3,
  Bell,
} from 'lucide-react';
import { DashboardShell, type DashboardNavItem } from '@/components/layout/DashboardShell';

const navItems: DashboardNavItem[] = [
  { label: 'Dashboard', href: '/seller', icon: LayoutDashboard },
  { label: 'Products', href: '/seller/products', icon: Package },
  { label: 'Orders', href: '/seller/orders', icon: ClipboardList },
  { label: 'Customers', href: '/seller/customers', icon: Users },
  { label: 'Store Profile', href: '/seller/store', icon: Store },
  { label: 'Payments', href: '/seller/payments', icon: CreditCard },
  { label: 'Analytics', href: '/seller/analytics', icon: BarChart3 },
  { label: 'Notifications', href: '/seller/notifications', icon: Bell },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Seller Portal" subtitle="Royal Kitchen Equipments" navItems={navItems}>
      {children}
    </DashboardShell>
  );
}
