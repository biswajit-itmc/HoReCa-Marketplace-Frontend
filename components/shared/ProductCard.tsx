'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, CheckCircle2, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { useApp } from '@/lib/store';
import { formatINRFull } from '@/lib/format';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.moq);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Link href={`/buyer/products/${product.id}`}>
        <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-forest-200 hover:shadow-lg">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            {product.discount && (
              <span className="absolute left-3 top-3 rounded-md bg-forest-500 px-2 py-1 text-xs font-semibold text-white">
                {product.discount}% OFF
              </span>
            )}
            <button
              onClick={handleWishlist}
              className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm transition-all hover:bg-white"
              aria-label="Toggle wishlist"
            >
              <Heart className={cn('h-4 w-4', isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600')} />
            </button>
          </div>

          <div className="flex flex-1 flex-col p-4">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="flex items-center gap-0.5 text-xs text-amber-500">
                <Star className="h-3 w-3 fill-amber-500" />
                {product.rating}
              </span>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
              {product.stock <= 10 && product.stock > 0 && (
                <span className="ml-auto text-xs font-medium text-amber-600">Low stock</span>
              )}
            </div>

            <h3 className="mb-1 line-clamp-2 text-sm font-medium leading-snug text-foreground">
              {product.name}
            </h3>

            <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-forest-500" />
              {product.supplierName}
            </p>

            <p className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {product.location}
            </p>

            <div className="mt-auto">
              <div className="mb-2 flex items-baseline gap-1">
                <span className="font-serif text-lg font-semibold text-foreground">
                  {formatINRFull(product.price)}
                </span>
                <span className="text-xs text-muted-foreground">/ {product.unit}</span>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                MOQ: {product.moq} {product.unit}
              </p>
              <button
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-forest-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-forest-600"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
