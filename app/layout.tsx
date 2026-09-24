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

const siteUrl = 'https://horeca.itmcsoftware.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'HoReCa Connect — B2B Marketplace for Hospitality',
  description:
    "India's B2B marketplace connecting hospitality businesses with verified suppliers, professional equipment and hospitality products.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'HoReCa Connect',
    title: 'HoReCa Connect — B2B Marketplace for Hospitality',
    description:
      "India's B2B marketplace connecting hospitality businesses with verified suppliers and professional hospitality equipment.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HoReCa Connect — B2B Marketplace for Hospitality',
    description:
      "India's B2B marketplace connecting hospitality businesses with verified suppliers.",
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
