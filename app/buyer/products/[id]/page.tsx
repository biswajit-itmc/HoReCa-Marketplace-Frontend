'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Star,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Heart,
  MessageCircle,
  Truck,
  PackageSearch,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';
import { getProductById, products } from '@/data/products';
import { getSupplierById } from '@/data/suppliers';
import { reviews as allReviews } from '@/data/mock';
import { useApp } from '@/lib/store';
import { formatINRFull, formatDate } from '@/lib/format';
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

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const product = getProductById(params.id);
  const { addToCart, toggleWishlist, wishlist, addRecentlyViewed } = useApp();

  const [activeImage, setActiveImage] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [quantity, setQuantity] = useState(product?.moq || 1);

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const productReviews = useMemo(
    () => allReviews.filter((r) => r.productId === product?.id),
    [product?.id]
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Product not found"
        description="This product may have been removed or is no longer available."
        actionLabel="Back to Marketplace"
        actionHref="/buyer/marketplace"
      />
    );
  }

  const supplier = getSupplierById(product.supplierId);
  const isWishlisted = wishlist.includes(product.id);

  const decrement = () => setQuantity((q) => Math.max(product.moq, q - 1));
  const increment = () => setQuantity((q) => q + 1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/buyer/cart');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactOpen(false);
    toast.success('Message sent to supplier');
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={product.gallery[activeImage] || product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          {product.gallery.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.gallery.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                    activeImage === i ? 'border-forest-500' : 'border-border'
                  )}
                >
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-4"
        >
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">{product.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-500" /> {product.rating}
                <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {product.location}
              </span>
            </div>
          </div>

          <Link
            href={`/buyer/suppliers/${product.supplierId}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-600 hover:underline"
          >
            <CheckCircle2 className="h-4 w-4" />
            {product.supplierName}
            {supplier?.verified && <span className="text-xs text-muted-foreground">(Verified)</span>}
          </Link>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-foreground">
                {formatINRFull(product.price)}
              </span>
              <span className="text-sm text-muted-foreground">/ {product.unit}</span>
              {product.discount && (
                <span className="rounded-md bg-forest-100 px-2 py-0.5 text-xs font-semibold text-forest-700">
                  {product.discount}% OFF
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">MOQ: {product.moq} {product.unit}</p>
            <p className="mt-1 text-sm">
              {product.stock > 0 ? (
                <span className="text-forest-600">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">Quantity</span>
            <div className="flex items-center rounded-lg border border-border">
              <button
                onClick={decrement}
                disabled={quantity <= product.moq}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-sm font-medium text-foreground">{quantity}</span>
              <button
                onClick={increment}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleAddToCart} className="flex-1 bg-forest-500 text-white hover:bg-forest-600" size="lg">
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button onClick={handleBuyNow} variant="outline" size="lg" className="flex-1 border-forest-500 text-forest-700 hover:bg-forest-50">
              <Zap className="mr-2 h-4 w-4" /> Buy Now
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="mr-2 h-4 w-4" /> Contact Supplier
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contact {product.supplierName}</DialogTitle>
                  <DialogDescription>Ask about {product.name}, pricing or bulk orders.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="p-subject">Subject</Label>
                    <Input id="p-subject" defaultValue={`Inquiry about ${product.name}`} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="p-message">Message</Label>
                    <Textarea id="p-message" placeholder="Write your message..." rows={4} required />
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
                toggleWishlist(product.id);
                toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
              }}
            >
              <Heart className={cn('mr-2 h-4 w-4', isWishlisted ? 'fill-red-500 text-red-500' : '')} />
              Wishlist
            </Button>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-beige-50 p-3 text-sm text-muted-foreground">
            <Truck className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" />
            <div>
              <p className="font-medium text-foreground">{product.deliveryTime}</p>
              <p>{product.deliveryInfo}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 font-serif text-lg font-semibold text-foreground">Description</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        </div>
        <div>
          <h2 className="mb-3 font-serif text-lg font-semibold text-foreground">Specifications</h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <tr key={key} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                    <td className="px-3 py-2 font-medium text-foreground">{key}</td>
                    <td className="px-3 py-2 text-right text-muted-foreground">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-serif text-xl font-bold text-foreground">
          Customer Reviews ({productReviews.length})
        </h2>
        {productReviews.length === 0 ? (
          <EmptyState icon={Star} title="No reviews yet" description="Be the first buyer to review this product." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {productReviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{r.buyerName}</p>
                  <span className="flex items-center gap-1 text-xs text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-500" /> {r.rating}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                <p className="mt-2 text-xs text-muted-foreground">{formatDate(r.date)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="mb-4 font-serif text-xl font-bold text-foreground">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
