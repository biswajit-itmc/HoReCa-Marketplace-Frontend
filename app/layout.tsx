import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { AppProviders } from '@/components/providers';
import { Navbar } from '@/components/layout/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HoReCa Connect — B2B Marketplace for Hospitality',
  description:
    'Source trusted suppliers, professional equipment and hospitality products built for hotels, restaurants and cafés.',
  openGraph: {
    title: 'HoReCa Connect — B2B Marketplace for Hospitality',
    description:
      'Discover verified suppliers, professional equipment and hospitality products for your business.',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <AppProviders>
          <Navbar />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
