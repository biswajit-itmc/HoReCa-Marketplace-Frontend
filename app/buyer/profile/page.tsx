'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Building2, ClipboardList, Wallet, CalendarDays, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/lib/store';
import { mockBuyer } from '@/data/mock';
import { getSupplierById } from '@/data/suppliers';
import { formatINR, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const router = useRouter();
  const { logout, savedSuppliers, toggleSavedSupplier } = useApp();

  const [businessName, setBusinessName] = useState(mockBuyer.businessName);
  const [businessType, setBusinessType] = useState(mockBuyer.businessType);
  const [city, setCity] = useState(mockBuyer.city);
  const [address, setAddress] = useState(mockBuyer.address);
  const [gstin, setGstin] = useState(mockBuyer.gstin);
  const [email, setEmail] = useState(mockBuyer.email);
  const [phone, setPhone] = useState(mockBuyer.phone);

  const savedSupplierList = savedSuppliers
    .map((id) => getSupplierById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your business details and preferences">
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-1.5 h-4 w-4" /> Logout
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <ClipboardList className="h-5 w-5 text-forest-600" />
          <p className="mt-2 font-serif text-xl font-bold text-foreground">{mockBuyer.totalOrders}</p>
          <p className="text-xs text-muted-foreground">Total Orders</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <Wallet className="h-5 w-5 text-forest-600" />
          <p className="mt-2 font-serif text-xl font-bold text-foreground">{formatINR(mockBuyer.totalSpent)}</p>
          <p className="text-xs text-muted-foreground">Total Spent</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <Heart className="h-5 w-5 text-forest-600" />
          <p className="mt-2 font-serif text-xl font-bold text-foreground">{savedSuppliers.length}</p>
          <p className="text-xs text-muted-foreground">Saved Suppliers</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <CalendarDays className="h-5 w-5 text-forest-600" />
          <p className="mt-2 font-serif text-xl font-bold text-foreground">{formatDate(mockBuyer.joinedDate)}</p>
          <p className="text-xs text-muted-foreground">Member Since</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
          <Building2 className="h-5 w-5 text-forest-600" /> Business Details
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="businessName">Business Name</Label>
            <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="businessType">Business Type</Label>
            <Input id="businessType" value={businessType} onChange={(e) => setBusinessType(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gstin">GSTIN</Label>
            <Input id="gstin" value={gstin} onChange={(e) => setGstin(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <Button type="submit" className="mt-5 bg-forest-500 text-white hover:bg-forest-600">
          Save Changes
        </Button>
      </form>

      <div>
        <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Saved Suppliers</h2>
        {savedSupplierList.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No saved suppliers"
            description="Save suppliers you like to quickly find them here."
            actionLabel="Browse Suppliers"
            actionHref="/buyer/suppliers"
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {savedSupplierList.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.05, 0.3) }}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-bold',
                    s.verified ? 'bg-forest-500 text-white' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {s.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.location}</p>
                </div>
                <button
                  onClick={() => {
                    toggleSavedSupplier(s.id);
                    toast.success('Removed from saved suppliers');
                  }}
                  className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
