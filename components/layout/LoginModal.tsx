'use client';

import { useRouter } from 'next/navigation';
import { ShoppingBag, Store, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Role } from '@/types';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const demoUsers: { role: Role; name: string; desc: string; icon: typeof ShoppingBag; path: string }[] = [
  {
    role: 'buyer',
    name: 'Radhey Restaurant',
    desc: 'Continue as a Buyer',
    icon: ShoppingBag,
    path: '/buyer',
  },
  {
    role: 'seller',
    name: 'Royal Kitchen Equipments',
    desc: 'Continue as a Seller',
    icon: Store,
    path: '/seller',
  },
  {
    role: 'admin',
    name: 'Platform Admin',
    desc: 'Continue as Admin',
    icon: ShieldCheck,
    path: '/admin',
  },
];

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const router = useRouter();
  const { setRole, login } = useApp();

  const handleLogin = (user: (typeof demoUsers)[number]) => {
    setRole(user.role);
    login();
    onOpenChange(false);
    toast.success(`Welcome, ${user.name}`);
    router.push(user.path);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Sign in to HoReCaConnect</DialogTitle>
          <DialogDescription>
            This is a prototype. Choose a demo account to continue — no password required.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 space-y-3">
          {demoUsers.map((user) => (
            <button
              key={user.role}
              onClick={() => handleLogin(user)}
              className="flex w-full items-center gap-4 rounded-xl border border-border p-4 text-left transition-all hover:border-forest-300 hover:bg-forest-50/50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-forest-500 text-white">
                <user.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
