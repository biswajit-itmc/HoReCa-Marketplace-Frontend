'use client';

import {
  LayoutDashboard,
  ShoppingBag,
  Building2,
  ClipboardList,
  CreditCard,
  Bell,
  LifeBuoy,
  User,
} from 'lucide-react';
import { DashboardShell, type DashboardNavItem } from '@/components/layout/DashboardShell';

const navItems: DashboardNavItem[] = [
  { label: 'Dashboard', href: '/buyer', icon: LayoutDashboard },
  { label: 'Marketplace', href: '/buyer/marketplace', icon: ShoppingBag },
  { label: 'Suppliers', href: '/buyer/suppliers', icon: Building2 },
  { label: 'Orders', href: '/buyer/orders', icon: ClipboardList },
  { label: 'Payments', href: '/buyer/payments', icon: CreditCard },
  { label: 'Notifications', href: '/buyer/notifications', icon: Bell },
  { label: 'Support', href: '/buyer/support', icon: LifeBuoy },
  { label: 'Profile', href: '/buyer/profile', icon: User },
];

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Buyer Portal" subtitle="Radhey Restaurant" navItems={navItems}>
      {children}
    </DashboardShell>
  );
}
