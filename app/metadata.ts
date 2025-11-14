import { Metadata } from 'next';

const VILLE = "Rabat"; // À remplacer par votre ville

export const sharedMetadata: Metadata = {
  title: {
    default: `Barber Co. - Salon de Coiffure pour Hommes | ${VILLE}`,
    template: `%s | Barber Co. - ${VILLE}`,
  },
  description: "Barbier professionnel spécialisé en coiffure masculine. Coupe, barbe, soins personnalisés. Prenez RDV dans notre salon moderne.",
  keywords: ['barbier', 'coiffeur homme', 'barber shop', 'coupe homme', 'taille barbe', 'salon masculin', VILLE],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.barber-co.com', 
    siteName: 'Barber Co.',
    title: `Barber Co. - Salon de Coiffure pour Hommes | ${VILLE}`,
    description: 'Découvrez notre salon de barbier haut de gamme. Expertise en coiffure masculine, taille de barbe et soins.',
    images: [
      {
        url: 'https://www.barber-co.com/og-image.jpg', // URL absolue de votre image Open Graph
        width: 1200,
        height: 630,
        alt: 'Intérieur du salon Barber Co.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
};