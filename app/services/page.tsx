import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Services & Tarifs - Barbier Rabat',
  description: 'Découvrez la liste complète de nos services et tarifs. De la coupe homme classique à la taille de barbe, en passant par les soins et colorations. Barbier Co. Rabat.',
};

type Service = {
  name: string;
  price: number;
  isStartingPrice?: boolean; 
};

type ServiceCategory = {
  title: string;
  subtitle: string;
  services: Service[];
};

const serviceData: ServiceCategory[] = [
  {
    title: "COIFFURE",
    subtitle: "HAIRCUT",
    services: [
      { name: "Brushing Homme", price: 50 },
      { name: "Contour d’oreille", price: 50 },
      { name: "Coupe Enfant", price: 80 },
      { name: "Coupe Tondeuse", price: 100 },
      { name: "Coupe Gentleman", price: 100 },
      { name: "Coupe Classique", price: 100 },
      { name: "Coupe Cheveux Longs", price: 120 },
      { name: "Tatouage", price: 100 },
      { name: "Coupe Taper", price: 100 },
    ],
  },
  {
    title: "COLORATION",
    subtitle: "COLORING",
    services: [
      { name: "Flash Barbe", price: 50 },
      { name: "Coloration de Barbe", price: 70 },
      { name: "Coloration Cheveux", price: 150 },
      { name: "Mèches Balayage", price: 250 },
      { name: "Décoloration", price: 250 },
      { name: "Coloration Complète", price: 500 },
    ],
  },
  {
    title: "BARBIER",
    subtitle: "BARBER",
    services: [
      { name: "Taille Moustache", price: 30 },
      { name: "Taille Barbe Complète", price: 50 },
      { name: "Barbe Classique", price: 50 },
    ],
  },
  {
    title: "SOINS DE CHEVEUX & BARBE",
    subtitle: "HAIR & BEARD CARE",
    services: [
      { name: "Lissage Barbe", price: 70 },
      { name: "Kératine Barbe", price: 200 },
      { name: "Lissage Cheveux Normale", price: 150 },
      { name: "Lissage Cheveux Longs", price: 250 },
      { name: "Lissage Kératine Botox", price: 400, isStartingPrice: true },
      { name: "Lissage Protéine", price: 500, isStartingPrice: true },
      { name: "Soins de Cheveux", price: 150 },
    ],
  },
  {
    title: "ÉPILATION & SOINS",
    subtitle: "WAXING & FACIALS",
    services: [
      { name: "Épilation Simple", price: 25 },
      { name: "Épilation Complète", price: 50 },
      { name: "Black Masque", price: 50 },
      { name: "Soins Classique", price: 100 },
      { name: "Soins de Visage Normal", price: 200 },
      { name: "Soins de Visage Académie", price: 300 },
      { name: "Soins de Visage Académie Hydra", price: 500 },
    ],
  },
];

type Pack = {
    name: string;
    price: number;
    items: string[];
};

const packData: Pack[] = [
    { name: "BRONZE", price: 250, items: ["Coupe Barbe", "Gommage", "Vapeur", "Masque Visage"]},
    { name: "SILVER", price: 350, items: ["Coupe Barbe", "Soins de Cheveux", "Soin de Visage Classique"]},
    { name: "GOLD", price: 900, items: ["Coupe Barbe", "Épilation Visage Complet", "Soin Académie", "Protéine"]},
];

// --- Le Composant de la Page ---
export default function ServicesPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        
        {/* En-tête de la page */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-heading font-bold text-gold">Nos Services & Tarifs</h1>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            Découvrez nos prestations de qualité, réalisées par des barbiers experts. Chaque service est une promesse de style et de bien-être.
          </p>
        </div>


        <div className="space-y-16">
          {serviceData.map((category) => (
            <div key={category.title}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-heading uppercase tracking-wider">{category.title}</h2>
                <p className="text-sm text-gold uppercase tracking-widest">{category.subtitle}</p>
              </div>
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-x-12 gap-y-4">
                {category.services.map((service) => (
                  <div key={service.name} className="flex justify-between items-baseline border-b border-dashed border-anthracite-dark py-3">
                    <p className="text-off-white">{service.name}</p>
                    <p className="text-xl font-bold text-gold shrink-0 ml-4">
                      {service.isStartingPrice && <span className="text-xs font-light normal-case">à partir de </span>}
                      {service.price} <span className="text-sm font-light">DHS</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Section des Packs */}
        <div className="mt-24">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-heading uppercase tracking-wider text-gold">Nos Packs Exclusifs</h2>
                <p className="text-sm text-white/70">Profitez de nos formules complètes pour une expérience ultime.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {packData.map((pack) => (
                    <div key={pack.name} className="bg-anthracite border border-gold/20 rounded-lg p-8 flex flex-col text-center hover:border-gold transition-colors duration-300">
                        <h3 className="text-2xl font-heading uppercase text-gold">{pack.name}</h3>
                        <p className="text-5xl font-bold my-4">{pack.price} <span className="text-2xl font-light">DHS</span></p>
                        <ul className="space-y-2 text-white/80 flex-grow">
                            {pack.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                        <Link href="/booking" className="mt-8 inline-block bg-gold text-anthracite font-bold py-3 px-8 rounded-lg text-sm uppercase tracking-wider hover:bg-gold-light transition-transform hover:scale-105">
                            Réserver ce Pack
                        </Link>
                    </div>
                ))}
            </div>
        </div>

        <div className="text-center mt-24 bg-anthracite py-16 rounded-lg">
            <h2 className="text-3xl font-heading text-white mb-4">Prêt à révéler votre meilleur style ?</h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
                La qualité Barber Co. est notre signature. La réservation ne prend que 60 secondes.
            </p>
            <Link 
                href="/booking" 
                className="inline-flex items-center justify-center rounded-md text-lg font-bold uppercase tracking-wider bg-gold text-anthracite hover:bg-gold-light hover:scale-105 transition-all h-14 px-10"
            >
                Réserver Maintenant
            </Link>
        </div>
      </div>
    </div>
  );
}