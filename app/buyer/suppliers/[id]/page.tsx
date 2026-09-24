'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Star,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  Calendar,
  Package,
  Building2,
  Heart,
  MessageCircle,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { getSupplierById } from '@/data/suppliers';
import { getProductsBySupplier } from '@/data/products';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/shared/EmptyState';
import { ProductCard } from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function SupplierDetailPage() {
  const params = useParams<{ id: string }>();
  const supplier = getSupplierById(params.id);
  const { savedSuppliers, toggleSavedSupplier } = useApp();
  const [contactOpen, setContactOpen] = useState(false);

  if (!supplier) {
    return (
      <EmptyState
        icon={Building2}
        title="Supplier not found"
        description="This supplier profile does not exist or may have been removed."
        actionLabel="Back to Suppliers"
        actionHref="/buyer/suppliers"
      />
    );
  }

  const supplierProducts = getProductsBySupplier(supplier.id);
  const isSaved = savedSuppliers.includes(supplier.id);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactOpen(false);
    toast.success('Message sent to supplier');
  };

  return (
    <div className="space-y-6">
      <Link
        href="/buyer/suppliers"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Suppliers
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div
            className={cn(
              'flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold',
              supplier.verified ? 'bg-forest-500 text-white' : 'bg-muted text-muted-foreground'
            )}
          >
            {supplier.logo}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-foreground">{supplier.name}</h1>
              {supplier.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-2.5 py-1 text-xs font-medium text-forest-700">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                {supplier.rating} ({supplier.reviewCount} reviews)
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {supplier.location}
              </span>
              <span className="flex items-center gap-1">
                <Package className="h-4 w-4" /> {supplier.productCount}+ Products
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {supplier.categories.map((cat) => (
                <span key={cat} className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  {cat}
                </span>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
              <DialogTrigger asChild>
                <Button className="bg-forest-500 text-white hover:bg-forest-600">
                  <MessageCircle className="mr-1.5 h-4 w-4" /> Contact Supplier
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contact {supplier.name}</DialogTitle>
                  <DialogDescription>
                    Send a message and the supplier will typically respond {supplier.responseTime}.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="e.g. Bulk pricing inquiry" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Write your message..." rows={4} required />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-forest-500 text-white hover:bg-forest-600">
                      Send Message
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              onClick={() => {
                toggleSavedSupplier(supplier.id);
                toast.success(isSaved ? 'Removed from saved suppliers' : 'Supplier saved');
              }}
            >
              <Heart className={cn('mr-1.5 h-4 w-4', isSaved ? 'fill-red-500 text-red-500' : '')} />
              {isSaved ? 'Saved' : 'Save Supplier'}
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">Business Information</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /> Established</dt>
              <dd className="font-medium text-foreground">{supplier.established} ({supplier.yearsInBusiness} yrs)</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> Service Area</dt>
              <dd className="text-right font-medium text-foreground">{supplier.serviceArea}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> Operating Hours</dt>
              <dd className="text-right font-medium text-foreground">{supplier.operatingHours}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> Phone</dt>
              <dd className="font-medium text-foreground">{supplier.phone}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> Email</dt>
              <dd className="font-medium text-foreground">{supplier.email}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Total Orders Fulfilled</dt>
              <dd className="font-medium text-foreground">{supplier.totalOrders}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Response Time</dt>
              <dd className="font-medium text-foreground">{supplier.responseTime}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="shrink-0 text-muted-foreground">Address</dt>
              <dd className="text-right font-medium text-foreground">{supplier.address}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">About</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{supplier.description}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-serif text-xl font-bold text-foreground">
          Products from {supplier.name} ({supplierProducts.length})
        </h2>
        {supplierProducts.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products listed"
            description="This supplier hasn't listed any products yet."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {supplierProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
