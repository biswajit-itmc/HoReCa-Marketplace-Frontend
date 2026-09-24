import Link from 'next/link';
import { Store, Mail, Phone, MapPin } from 'lucide-react';

const columns = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Products', href: '/buyer/marketplace' },
      { label: 'Suppliers', href: '/buyer/suppliers' },
      { label: 'Categories', href: '/buyer/marketplace#categories' },
      { label: 'Offers', href: '/buyer/marketplace' },
    ],
  },
  {
    title: 'For Buyers',
    links: [
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Orders', href: '/buyer/orders' },
      { label: 'Payments', href: '/buyer/payments' },
      { label: 'Support', href: '/buyer/support' },
    ],
  },
  {
    title: 'For Sellers',
    links: [
      { label: 'Become a Supplier', href: '/seller' },
      { label: 'Seller Dashboard', href: '/seller' },
      { label: 'Promote Products', href: '/seller/analytics' },
      { label: 'Seller Support', href: '/seller/notifications' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/#about' },
      { label: 'Contact', href: '/#contact' },
      { label: 'Terms', href: '/#terms' },
      { label: 'Privacy', href: '/#privacy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-beige-50">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-500 text-white">
                <Store className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold text-forest-700">
                HoReCa<span className="text-forest-500">Connect</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The B2B marketplace connecting hotels, restaurants and cafés with trusted hospitality
              suppliers across India.
            </p>
            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-forest-600" />
                Connaught Place, New Delhi, India
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-forest-600" />
                +91 11 4567 8900
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-forest-600" />
                support@horecaconnect.in
              </p>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-serif text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-forest-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 HoReCaConnect. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made for hotels, restaurants &amp; cafés across India.
          </p>
        </div>
      </div>
    </footer>
  );
}
