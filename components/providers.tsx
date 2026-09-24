'use client';

import { AppProvider } from '@/lib/store';
import { Toaster } from '@/components/ui/sonner';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </AppProvider>
  );
}
