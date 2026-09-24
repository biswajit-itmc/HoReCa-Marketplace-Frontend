'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowRight,
  ShoppingBag,
  Building2,
  ShieldCheck,
  Truck,
  BadgeCheck,
  TrendingUp,
  Users,
  Package,
  Store,
  ClipboardCheck,
  Handshake,
  Rocket,
  Megaphone,
  LineChart,
} from 'lucide-react';
import { products } from '@/data/products';
import { suppliers } from '@/data/suppliers';
import { categories } from '@/data/categories';
import { buyerPromotions } from '@/data/mock';
import { ProductCard } from '@/components/shared/ProductCard';
import { SupplierCard } from '@/components/shared/SupplierCard';
import { PromoCarousel } from '@/components/shared/PromoCarousel';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const trendingProducts = products.filter((p) => p.trending).slice(0, 8);
const featuredSuppliers = suppliers.filter((s) => s.verified).slice(0, 4);

const howItWorks = [
  {
    icon: Search,
    title: 'Discover',
    desc: 'Search verified suppliers and hospitality products by category, location or price.',
  },
  {
    icon: Handshake,
    title: 'Connect',
    desc: 'Compare offers, view supplier profiles and reach out directly through the marketplace.',
  },
  {
    icon: ClipboardCheck,
    title: 'Order',
    desc: 'Place orders securely with flexible payment options built for B2B procurement.',
  },
  {
    icon: Truck,
    title: 'Track',
    desc: 'Track every order from acceptance to delivery with real-time status updates.',
  },
];

const buyerBenefits = [
  { icon: ShieldCheck, title: 'Verified Suppliers', desc: 'Every supplier is vetted for authenticity and reliability.' },
  { icon: TrendingUp, title: 'Competitive Pricing', desc: 'Compare quotes across suppliers to get the best B2B rates.' },
  { icon: Truck, title: 'Reliable Delivery', desc: 'Track orders end-to-end with transparent delivery timelines.' },
  { icon: BadgeCheck, title: 'Quality Assurance', desc: 'Products backed by ratings, reviews and warranty information.' },
];

const sellerBenefits = [
  { icon: Megaphone, title: 'Wider Reach', desc: 'Get discovered by hotels, restaurants and cafés across India.' },
  { icon: Rocket, title: 'Grow Faster', desc: 'List unlimited products and manage orders from one dashboard.' },
  { icon: LineChart, title: 'Business Insights', desc: 'Track sales, revenue and customer trends with built-in analytics.' },
  { icon: Store, title: 'Build Your Brand', desc: 'A dedicated storefront that builds trust with B2B buyers.' },
];

const stats = [
  { icon: Building2, value: '2,400+', label: 'Verified Suppliers' },
  { icon: Users, value: '18,000+', label: 'Hospitality Buyers' },
  { icon: Package, value: '45,000+', label: 'Products Listed' },
  { icon: Truck, value: '1.2L+', label: 'Orders Delivered' },
];

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/buyer/marketplace${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-beige-50">
        <div className="absolute inset-0 bg-gradient-to-b from-beige-100/60 via-beige-50 to-background" />

        {/* Hospitality visual — a professional commercial kitchen, blended softly into the beige field */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[62%] md:block lg:w-[52%]"
        >
          <motion.div
            animate={{ scale: [1, 1.045, 1], x: [0, -14, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="relative h-full w-full"
          >
            <Image
              src="https://images.pexels.com/photos/6219483/pexels-photo-6219483.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 0px, 55vw"
              className="object-cover object-center opacity-[0.32]"
            />
          </motion.div>
          {/* Soft fades so the visual blends into the beige field rather than reading as a banner */}
          <div className="absolute inset-0 bg-gradient-to-r from-beige-50 via-beige-50/30 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-beige-50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Subtle decorative depth — restrained, brand-only tones */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-forest-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-balance font-serif text-4xl font-bold leading-tight text-foreground md:text-6xl">
              Source Better. Buy Smarter.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
              Discover trusted suppliers, professional equipment and hospitality products built for
              hotels, restaurants and cafés.
            </p>

            <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-xl items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="Search products, suppliers or categories..."
                  className="w-full rounded-xl border border-border bg-white py-3.5 pl-11 pr-4 text-sm shadow-sm outline-none transition-colors focus:border-forest-400 focus:ring-2 focus:ring-forest-100"
                />
              </div>
              <Button type="submit" size="lg" className="bg-forest-500 text-white hover:bg-forest-600">
                Search
              </Button>
            </form>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/buyer/marketplace">
                <Button size="lg" className="w-full bg-forest-500 text-white hover:bg-forest-600 sm:w-auto">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Explore Marketplace
                </Button>
              </Link>
              <Link href="/seller">
                <Button size="lg" variant="outline" className="w-full border-forest-300 sm:w-auto">
                  <Store className="mr-2 h-4 w-4" />
                  Become a Supplier
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-forest-700">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4 md:px-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center text-white"
            >
              <stat.icon className="mx-auto h-6 w-6 text-forest-200" />
              <p className="mt-2 font-serif text-2xl font-bold md:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs text-forest-100 md:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Popular Categories
            </h2>
            <p className="mt-2 text-muted-foreground">
              Browse hospitality products by category
            </p>
          </div>
          <Link href="/buyer/marketplace" className="hidden items-center gap-1 text-sm font-medium text-forest-600 hover:underline md:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4) }}
            >
              <Link
                href={`/buyer/marketplace?category=${cat.id}`}
                className="group flex h-full flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center transition-all hover:border-forest-200 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 text-forest-600 transition-colors group-hover:bg-forest-500 group-hover:text-white">
                  <CategoryIcon name={cat.icon} className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{cat.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{cat.productCount}+ products</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Promotional Carousel */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <PromoCarousel promotions={buyerPromotions} />
      </section>

      {/* Featured Suppliers */}
      <section className="bg-beige-50/60 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                Featured Suppliers
              </h2>
              <p className="mt-2 text-muted-foreground">Verified suppliers trusted by hospitality businesses</p>
            </div>
            <Link href="/buyer/suppliers" className="hidden items-center gap-1 text-sm font-medium text-forest-600 hover:underline md:flex">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredSuppliers.map((s, i) => (
              <SupplierCard key={s.id} supplier={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Trending Products
            </h2>
            <p className="mt-2 text-muted-foreground">Most sought-after equipment this month</p>
          </div>
          <Link href="/buyer/marketplace" className="hidden items-center gap-1 text-sm font-medium text-forest-600 hover:underline md:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trendingProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-forest-50/50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">How It Works</h2>
            <p className="mt-2 text-muted-foreground">
              A simple, transparent procurement journey from discovery to delivery.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-500 text-white shadow-md">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="mt-4 inline-block font-serif text-sm font-bold text-forest-500">
                  0{i + 1}
                </span>
                <h3 className="mt-1 font-serif text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits for Buyers */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-forest-100 px-3 py-1 text-xs font-medium text-forest-700">
              <ShoppingBag className="h-3.5 w-3.5" />
              For Buyers
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
              Everything hospitality businesses need to procure smarter
            </h2>
            <p className="mt-4 text-muted-foreground">
              From sourcing kitchen equipment to furnishing guest rooms, HoReCaConnect brings
              verified suppliers and transparent pricing to one place.
            </p>
            <Link href="/buyer">
              <Button size="lg" className="mt-6 bg-forest-500 text-white hover:bg-forest-600">
                Start Buying <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {buyerBenefits.map((b) => (
              <div key={b.title} className="rounded-xl border border-border bg-card p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-100 text-forest-600">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-serif text-base font-semibold text-foreground">{b.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits for Sellers */}
      <section className="bg-beige-50/60 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="order-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:order-1">
              {sellerBenefits.map((b) => (
                <div key={b.title} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-100 text-forest-600">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-serif text-base font-semibold text-foreground">{b.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-forest-100 px-3 py-1 text-xs font-medium text-forest-700">
                <Store className="h-3.5 w-3.5" />
                For Sellers
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
                Put your products in front of verified hospitality buyers
              </h2>
              <p className="mt-4 text-muted-foreground">
                List your catalogue, manage orders and grow your B2B business with tools built
                for hospitality suppliers.
              </p>
              <Link href="/seller">
                <Button size="lg" className="mt-6 bg-forest-500 text-white hover:bg-forest-600">
                  Become a Supplier <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="relative overflow-hidden rounded-2xl bg-forest-700 px-6 py-16 text-center md:px-16">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-600/50 to-forest-900/50" />
          <div className="relative">
            <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
              Ready to transform your procurement?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-forest-100">
              Join thousands of hotels, restaurants and cafés sourcing smarter with HoReCaConnect.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/buyer/marketplace">
                <Button size="lg" className="w-full bg-white text-forest-700 hover:bg-beige-100 sm:w-auto">
                  Explore Marketplace
                </Button>
              </Link>
              <Link href="/seller">
                <Button size="lg" variant="outline" className="w-full border-white/40 bg-transparent text-white hover:bg-white/10 sm:w-auto">
                  Become a Supplier
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
