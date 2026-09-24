'use client';

import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  ClipboardList,
  BarChart3,
  LayoutGrid,
  Bell,
} from 'lucide-react';
import { DashboardShell, type DashboardNavItem } from '@/components/layout/DashboardShell';

const navItems: DashboardNavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Suppliers', href: '/admin/suppliers', icon: Building2 },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Categories', href: '/admin/categories', icon: LayoutGrid },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Admin Panel" subtitle="Platform Admin" navItems={navItems}>
      {children}
    </DashboardShell>
  );
}
