import { GoogleAnalytics } from '@next/third-parties/google';
import { Inter, Montserrat, Parisienne } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next';
import { sharedMetadata } from './metadata';
import Header from '../components/Header';
import Footer from '../components/Footer';

// 1. OPTIMISATION DES FONTS : Ajout de display: 'swap'
// Cela permet au texte de s'afficher immédiatement avec une police système
// avant que la jolie police ne soit chargée. Gain immédiat sur le score.
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap' 
});

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  weight: ['700', '900'], 
  variable: '--font-montserrat',
  display: 'swap' 
});

const parisienne = Parisienne({ 
  subsets: ['latin'], 
  weight: '400', 
  variable: '--font-parisienne',
  display: 'swap' 
});

export const metadata: Metadata = {
  ...sharedMetadata,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // JSON-LD pour le SEO (Très bien fait !)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: 'Barber Co.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1 (703, 421 Rue Bani Jaber, Rabat 10000',
      addressLocality: 'Rabat',
      postalCode: '10210',
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.97962, 
      longitude: 6.8159084, 
    },
    url: 'https://barber-coo.vercel.app/', 
    telephone: '+212661217511',
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday', 'Sunday'], opens: '10:00', closes: '23:30' },
    ],
    priceRange: '€€',
  };

  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="google-site-verification" content="0d3VZ04WmA9YvCosF0OJE0SC9rBbI4cdyeH9rCI0mqI" />
      </head>
      <body 
        suppressHydrationWarning={true}
        className={`${inter.variable} ${montserrat.variable} ${parisienne.variable} font-sans bg-black text-off-white`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        <GoogleAnalytics gaId="G-PL27T4NPPR" /> 
      </body>
    </html>
  );
}