import { Inter, Montserrat, Parisienne } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next';
import { sharedMetadata } from './metadata';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Configuration des polices
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['700', '900'], variable: '--font-montserrat' });
const parisienne = Parisienne({ subsets: ['latin'], weight: '400', variable: '--font-parisienne' });

// Métadonnées
export const metadata: Metadata = {
  ...sharedMetadata,
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Définition de l'objet JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: 'Barber Co.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1 (703, 421 Rue Bani Jaber, Rabat 10000',
      addressLocality: 'Rabat',
      postalCode: '	10210',
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.97962, // 
      longitude: 6.8159084, //
    },
    url: 'https://www.barber-co.com', //
    telephone: '+212661217511',
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday', 'Sunday'], opens: '10:00', closes: '23:30' },
    ],
    priceRange: '€€',
  };

  // UN SEUL return qui englobe TOUT
  return (
    <html lang="fr">
      {/* La balise <head> contient les métadonnées et les scripts */}
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      {/* La balise <body> contient le contenu visible de votre site */}
      <body className={`${inter.variable} ${montserrat.variable} ${parisienne.variable} font-sans bg-black text-off-white`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}