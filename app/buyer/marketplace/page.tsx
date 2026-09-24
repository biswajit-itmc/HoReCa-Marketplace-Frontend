'use client';

import { useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Star,
  MapPin,
  ShoppingCart,
  Heart,
  X,
  PackageSearch,
} from 'lucide-react';
import { toast } from 'sonner';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { suppliers } from '@/data/suppliers';
import { useApp } from '@/lib/store';
import { formatINRFull } from '@/lib/format';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProductCard } from '@/components/shared/ProductCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const cities = Array.from(new Set(products.map((p) => p.location))).sort();
const maxPrice = Math.max(...products.map((p) => p.price));

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useApp();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category') as string] : []
  );
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>('relevance');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleSupplier = (id: string) => {
    setSelectedSuppliers((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (query) {
        const q = query.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.supplierName.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.categoryId)) return false;
      if (selectedSuppliers.length > 0 && !selectedSuppliers.includes(p.supplierId)) return false;
      if (selectedCity !== 'all' && p.location !== selectedCity) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (p.rating < minRating) return false;
      if (inStockOnly && p.stock <= 0) return false;
      return true;
    });

    switch (sort) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result = [...result].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }

    return result;
  }, [query, selectedCategories, selectedSuppliers, selectedCity, priceRange, minRating, inStockOnly, sort]);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategories([]);
    setSelectedSuppliers([]);
    setSelectedCity('all');
    setPriceRange([0, maxPrice]);
    setMinRating(0);
    setInStockOnly(false);
    router.push('/buyer/marketplace');
  };

  const hasActiveFilters =
    query ||
    selectedCategories.length > 0 ||
    selectedSuppliers.length > 0 ||
    selectedCity !== 'all' ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    minRating > 0 ||
    inStockOnly;

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Category</h3>
        <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <label key={cat.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
              />
              <span className="text-muted-foreground">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Supplier</h3>
        <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
          {suppliers.map((s) => (
            <label key={s.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={selectedSuppliers.includes(s.id)}
                onCheckedChange={() => toggleSupplier(s.id)}
              />
              <span className="text-muted-foreground">{s.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">City</h3>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger>
            <SelectValue placeholder="All cities" />
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
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Price Range: {formatINRFull(priceRange[0])} – {formatINRFull(priceRange[1])}
        </h3>
        <Slider
          min={0}
          max={maxPrice}
          step={1000}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Minimum Rating</h3>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={cn(
                'flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
                minRating === r
                  ? 'border-forest-500 bg-forest-50 text-forest-700'
                  : 'border-border text-muted-foreground hover:border-forest-200'
              )}
            >
              {r === 0 ? 'Any' : (
                <>
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {r}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <Checkbox checked={inStockOnly} onCheckedChange={(v) => setInStockOnly(Boolean(v))} />
        <span className="text-muted-foreground">In stock only</span>
      </label>

      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="mr-1.5 h-4 w-4" /> Clear filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Marketplace" description="Browse the full hospitality equipment catalogue" />

      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, categories, suppliers..."
          className="h-11 rounded-lg pl-10"
        />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
            {FilterPanel}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setFiltersOpen((v) => !v)}
              >
                <SlidersHorizontal className="mr-1.5 h-4 w-4" /> Filters
              </Button>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{filtered.length}</span> products found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                <SelectTrigger className="h-9 w-44">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center rounded-lg border border-border p-0.5">
                <button
                  onClick={() => setView('grid')}
                  className={cn(
                    'rounded-md p-1.5 transition-colors',
                    view === 'grid' ? 'bg-forest-500 text-white' : 'text-muted-foreground'
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={cn(
                    'rounded-md p-1.5 transition-colors',
                    view === 'list' ? 'bg-forest-500 text-white' : 'text-muted-foreground'
                  )}
                  aria-label="List view"
                >
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {filtersOpen && (
            <div className="mb-4 rounded-xl border border-border bg-card p-5 lg:hidden">
              {FilterPanel}
            </div>
          )}

          {filtered.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No products found"
              description="Try adjusting your filters or search terms to find what you're looking for."
              actionLabel="Clear filters"
              actionHref="/buyer/marketplace"
            />
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((p, i) => {
                const isWishlisted = wishlist.includes(p.id);
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                  >
                    <Link
                      href={`/buyer/products/${p.id}`}
                      className="flex gap-4 rounded-xl border border-border bg-card p-3 transition-all hover:border-forest-200 hover:shadow-md"
                    >
                      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-32 sm:w-32">
                        <Image src={p.image} alt={p.name} fill className="object-cover" sizes="128px" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-amber-500">
                            <Star className="h-3 w-3 fill-amber-500" />
                            {p.rating} <span className="text-muted-foreground">({p.reviewCount})</span>
                          </div>
                          <h3 className="mt-1 line-clamp-1 text-sm font-medium text-foreground sm:text-base">
                            {p.name}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground">{p.supplierName}</p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {p.location}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <div>
                            <span className="font-serif text-base font-semibold text-foreground sm:text-lg">
                              {formatINRFull(p.price)}
                            </span>
                            <span className="ml-1 text-xs text-muted-foreground">/ {p.unit}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleWishlist(p.id);
                                toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                              }}
                              className="rounded-full border border-border p-2 transition-colors hover:bg-muted"
                              aria-label="Toggle wishlist"
                            >
                              <Heart className={cn('h-4 w-4', isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500')} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                addToCart(p, p.moq);
                                toast.success(`${p.name} added to cart`);
                              }}
                              className="flex items-center gap-1.5 rounded-lg bg-forest-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-forest-600 sm:text-sm"
                            >
                              <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading marketplace...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
