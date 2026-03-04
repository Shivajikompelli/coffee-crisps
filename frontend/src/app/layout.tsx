import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartSidebar from '@/components/cart/CartSidebar'
import { Toaster } from 'react-hot-toast'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://coffeeandcrisps.in'),
  title: {
    template: '%s | Coffee & Crisps Café',
    default: 'Coffee & Crisps Café | Aesthetic Café in Hyderabad',
  },
  description:
    "Hyderabad's most aesthetic café in Saroornagar. Korean Fried Chicken, specialty coffee, cozy vibes.",
  openGraph: {
    siteName: 'Coffee & Crisps Café',
    locale: 'en_IN',
    type: 'website',
  },
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  name: 'Coffee & Crisps Café',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rd Number 1, Jincala Bhavi Colony, Doctors Colony',
    addressLocality: 'Saroornagar',
    addressRegion: 'Hyderabad',
    addressCountry: 'IN',
  },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.6', reviewCount: '1275' },
  priceRange: '₹₹',
  servesCuisine: ['Indian', 'Korean', 'Continental', 'Cafe'],
  openingHours: ['Mo-Fr 11:00-22:30', 'Sa-Su 10:00-23:00'],
  telephone: '+919876543210',
  url: 'https://coffeeandcrisps.in',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="font-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartSidebar />
        {/* WhatsApp FAB */}
        <a
          href="https://wa.me/919876543210?text=Hi%20Coffee%20%26%20Crisps!%20I%27d%20like%20to%20order."
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:scale-110 transition-transform"
          style={{ backgroundColor: '#25D366' }}
          title="Order on WhatsApp"
        >
          💬
        </a>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#2C1A0E',
              color: '#fff',
              borderRadius: '100px',
              fontSize: '0.875rem',
            },
          }}
        />
      </body>
    </html>
  )
}
