'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Promotion } from '@/types';
import { cn } from '@/lib/utils';

interface PromoCarouselProps {
  promotions: Promotion[];
  autoPlay?: boolean;
  interval?: number;
}

export function PromoCarousel({ promotions, autoPlay = true, interval = 5000 }: PromoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % promotions.length);
  }, [promotions.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + promotions.length) % promotions.length);
  }, [promotions.length]);

  useEffect(() => {
    if (!autoPlay || isPaused || promotions.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, next, promotions.length]);

  if (promotions.length === 0) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5 }}
          className={cn(
            'relative flex min-h-[280px] items-center overflow-hidden bg-gradient-to-br p-8 md:min-h-[340px] md:p-12',
            promotions[current].bgClass
          )}
        >
          {promotions[current].image && (
            <>
              <Image
                src={promotions[current].image}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover object-center"
              />
              {/* Directional overlay for text legibility — image stays sharp and clearly visible */}
              <div className="absolute inset-0 bg-gradient-to-r from-forest-900/85 via-forest-900/45 to-forest-900/10" />
            </>
          )}
          <div className="relative z-10 max-w-lg">
            <h2 className="font-serif text-2xl font-bold leading-tight text-white md:text-4xl">
              {promotions[current].title}
            </h2>
            <p className="mt-3 text-sm text-white/80 md:text-lg">
              {promotions[current].subtitle}
            </p>
            <Link href={promotions[current].ctaLink}>
              <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-forest-700 transition-transform hover:scale-105">
                {promotions[current].ctaText}
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {promotions.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/50"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {promotions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  idx === current ? 'w-8 bg-white' : 'w-2 bg-white/50'
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
