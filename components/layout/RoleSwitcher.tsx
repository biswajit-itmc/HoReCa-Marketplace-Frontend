'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Store, ShieldCheck } from 'lucide-react';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

export function RoleSwitcher() {
  const router = useRouter();
  const { role, setRole, isLoggedIn, login } = useApp();

  // Prefetch both destinations up front so the switch is instant instead of
  // triggering an on-demand route load on the first click.
  useEffect(() => {
    router.prefetch('/buyer');
    router.prefetch('/seller');
  }, [router]);

  const handleSwitch = (newRole: Role) => {
    setRole(newRole);
    login();
    if (newRole === 'buyer') router.push('/buyer');
    if (newRole === 'seller') router.push('/seller');
    if (newRole === 'admin') router.push('/admin');
  };

  const isBuyer = role === 'buyer' || role === 'guest';
  const isSeller = role === 'seller';

  return (
    <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5">
      <button
        onClick={() => handleSwitch('buyer')}
        className={cn(
          'relative flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors md:px-3 md:text-sm',
          isBuyer ? 'text-white' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {isBuyer && (
          <motion.div
            layoutId="roleSwitcher"
            className="absolute inset-0 rounded-md bg-forest-500"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <ShoppingBag className="relative z-10 h-3.5 w-3.5" />
        <span className="relative z-10 hidden sm:inline">Buyer</span>
      </button>
      <button
        onClick={() => handleSwitch('seller')}
        className={cn(
          'relative flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors md:px-3 md:text-sm',
          isSeller ? 'text-white' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {isSeller && (
          <motion.div
            layoutId="roleSwitcher"
            className="absolute inset-0 rounded-md bg-forest-500"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <Store className="relative z-10 h-3.5 w-3.5" />
        <span className="relative z-10 hidden sm:inline">Seller</span>
      </button>
    </div>
  );
}
