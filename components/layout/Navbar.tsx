'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Menu,
  X,
  ShoppingBag,
  Building2,
  Package,
  LayoutGrid,
  Bell,
  User,
  ShoppingCart,
  Store,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
import { NotificationDropdown } from '@/components/layout/NotificationDropdown';
import { LoginModal } from '@/components/layout/LoginModal';

const navLinks = [
  { label: 'Marketplace', href: '/buyer/marketplace', icon: ShoppingBag },
  { label: 'Categories', href: '/buyer/marketplace#categories', icon: LayoutGrid },
  { label: 'Suppliers', href: '/buyer/suppliers', icon: Building2 },
  { label: 'Products', href: '/buyer/marketplace', icon: Package },
];

export function Navbar() {
  const pathname = usePathname();
  const { cartCount, isLoggedIn, notifications } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read && (n.role === 'all' || n.role === 'buyer')).length;

  const isActive = (href: string) => {
    if (href.includes('#')) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-500 text-white">
              <Store className="h-5 w-5" />
            </div>
            <span className="font-serif text-xl font-bold text-forest-700">
              HoReCa<span className="text-forest-500">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-forest-50 text-forest-700'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <RoleSwitcher />

            {/* Cart */}
            <Link href="/buyer/cart" className="relative hidden md:block">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-forest-500 text-xs font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Notifications */}
            <NotificationDropdown unreadCount={unreadCount} role="buyer" />

            {/* Login/Profile */}
            {isLoggedIn ? (
              <Link href="/buyer/profile">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => setLoginOpen(true)}
                size="sm"
                className="hidden bg-forest-500 text-white hover:bg-forest-600 md:flex"
              >
                Login
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border lg:hidden"
            >
              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive(link.href)
                        ? 'bg-forest-50 text-forest-700'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
                <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">
                  <Link href="/buyer/cart" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Cart ({cartCount})
                    </Button>
                  </Link>
                  {!isLoggedIn && (
                    <Button
                      onClick={() => {
                        setLoginOpen(true);
                        setMobileOpen(false);
                      }}
                      className="flex-1 bg-forest-500 text-white hover:bg-forest-600"
                    >
                      Login
                    </Button>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
