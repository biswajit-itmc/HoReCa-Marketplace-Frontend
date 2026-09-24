'use client';

import { useMemo, useState } from 'react';
import { Search, Building2 } from 'lucide-react';
import { suppliers } from '@/data/suppliers';
import { categories } from '@/data/categories';
import { PageHeader } from '@/components/shared/PageHeader';
import { SupplierCard } from '@/components/shared/SupplierCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const cities = Array.from(new Set(suppliers.map((s) => s.city))).sort();

export default function SuppliersPage() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('all');
  const [category, setCategory] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filtered = useMemo(() => {
    return suppliers.filter((s) => {
      if (query) {
        const q = query.toLowerCase();
        if (!s.name.toLowerCase().includes(q) && !s.categories.some((c) => c.toLowerCase().includes(q))) {
          return false;
        }
      }
      if (city !== 'all' && s.city !== city) return false;
      if (category !== 'all' && !s.categories.includes(category)) return false;
      if (verifiedOnly && !s.verified) return false;
      return true;
    });
  }, [query, city, category, verifiedOnly]);

  const clearFilters = () => {
    setQuery('');
    setCity('all');
    setCategory('all');
    setVerifiedOnly(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Suppliers" description="Discover verified hospitality equipment suppliers across India" />

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search suppliers or categories..."
            className="h-10 pl-10"
          />
        </div>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="h-10 w-full md:w-44">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cities</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-10 w-full md:w-56">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm">
          <Checkbox checked={verifiedOnly} onCheckedChange={(v) => setVerifiedOnly(Boolean(v))} />
          <span className="text-muted-foreground">Verified only</span>
        </label>
        {(query || city !== 'all' || category !== 'all' || verifiedOnly) && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{filtered.length}</span> suppliers found
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No suppliers found"
          description="Try adjusting your search or filters to find suppliers."
          actionLabel="Clear filters"
          actionHref="/buyer/suppliers"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s, i) => (
            <SupplierCard key={s.id} supplier={s} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
