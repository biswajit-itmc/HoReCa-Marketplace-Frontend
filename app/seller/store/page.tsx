'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Star, ShoppingBag, Calendar, Package } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { suppliers } from '@/data/suppliers';
import { categories } from '@/data/categories';
import { mockSeller } from '@/data/mock';

const supplier = suppliers.find((s) => s.id === 'sup-1')!;

export default function SellerStorePage() {
  const [form, setForm] = useState({
    businessName: supplier.name,
    description: supplier.description,
    city: supplier.city,
    serviceArea: supplier.serviceArea,
    operatingHours: supplier.operatingHours,
    phone: supplier.phone,
    email: mockSeller.email,
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>(supplier.categories);

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleSave = () => {
    toast.success('Store profile updated');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Store Profile" description="Manage your public store information." />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <Card className="rounded-xl border-border p-5 lg:col-span-2">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-forest-500 font-serif text-xl font-bold text-white">
              {supplier.logo}
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-foreground">{form.businessName}</h2>
              <StatusBadge status={supplier.verificationStatus} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="city">Location / City</Label>
                <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="serviceArea">Service Area</Label>
                <Input
                  id="serviceArea"
                  value={form.serviceArea}
                  onChange={(e) => setForm({ ...form, serviceArea: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="operatingHours">Operating Hours</Label>
                <Input
                  id="operatingHours"
                  value={form.operatingHours}
                  onChange={(e) => setForm({ ...form, operatingHours: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div>
              <Label>Categories</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((c) => {
                  const active = selectedCategories.includes(c.name);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCategory(c.name)}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                        active
                          ? 'border-forest-500 bg-forest-500 text-white'
                          : 'border-border bg-background text-muted-foreground hover:border-forest-300'
                      )}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button className="bg-forest-500 text-white hover:bg-forest-600" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-xl border-border p-5">
            <h3 className="mb-4 font-serif text-base font-semibold text-foreground">Store Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" /> Established
                </span>
                <span className="font-medium text-foreground">{supplier.established}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" /> Years in Business
                </span>
                <span className="font-medium text-foreground">{supplier.yearsInBusiness} yrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <ShoppingBag className="h-4 w-4" /> Total Orders
                </span>
                <span className="font-medium text-foreground">{supplier.totalOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4" /> Rating
                </span>
                <span className="font-medium text-foreground">
                  {supplier.rating} ({supplier.reviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" /> Products
                </span>
                <span className="font-medium text-foreground">{supplier.productCount}</span>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
