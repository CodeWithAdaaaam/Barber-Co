import { Metadata } from 'next';
import Link from 'next/link';
import { getServices } from '@/lib/api';

// 1. Configuration SEO & Cache
export const metadata: Metadata = {
  title: 'Services & Tarifs - Barbier Rabat',
  description: 'Découvrez la liste complète de nos services et tarifs.',
};

// Force la mise à jour à chaque visite pour voir les changements de prix
export const revalidate = 0;

export default async function ServicesPage() {
  // 2. Récupération des données depuis Supabase
  const allServices = await getServices();

  // 3. Fonction pour filtrer les services par mots-clés
  const getServicesByKeyword = (keywords: string[]) => {
    return allServices.filter(service => {
      const title = service.title.toLowerCase();
      const isPack = title.includes('pack') || title.includes('combo');
      // On prend le service s'il contient un mot clé ET que ce n'est pas un pack
      return !isPack && keywords.some(k => title.includes(k.toLowerCase()));
    });
  };

  // 4. Reconstruction de tes Catégories avec les données dynamiques
  const categories = [
    {
      title: "COIFFURE",
      subtitle: "HAIRCUT",
      // Mots clés pour trouver les coupes dans ta DB
      services: getServicesByKeyword(['coupe', 'brushing', 'contour', 'tatouage', 'taper', 'cheveux']),
    },
    {
      title: "COLORATION",
      subtitle: "COLORING",
      services: getServicesByKeyword(['coloration', 'mèches', 'décoloration', 'flash']),
    },
    {
      title: "BARBIER",
      subtitle: "BARBER",
      services: getServicesByKeyword(['barbe', 'moustache', 'rasage']),
    },
    {
      title: "SOINS & TRAITEMENTS",
      subtitle: "CARE & TREATMENTS",
      services: getServicesByKeyword(['lissage', 'kératine', 'soin', 'masque', 'protéine', 'botox']),
    },
    {
      title: "ÉPILATION",
      subtitle: "WAXING",
      services: getServicesByKeyword(['épilation']),
    },
  ];

  // 5. Récupération des Packs
  const packs = allServices.filter(s => 
    s.title.toUpperCase().includes('PACK') || s.title.toUpperCase().includes('COMBO')
  );

  return (
    <div className="bg-black min-h-screen pt-32 pb-24 text-white font-sans">
      <div className="container mx-auto px-4">
        
        {/* --- EN-TÊTE (Ton design original) --- */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-heading font-bold text-gold">Nos Services & Tarifs</h1>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            Découvrez nos prestations de qualité, réalisées par des barbiers experts. Chaque service est une promesse de style et de bien-être.
          </p>
        </div>

        {/* --- LISTE DES SERVICES (Dynamique avec ton design) --- */}
        <div className="space-y-16">
          {categories.map((category) => (
            // On n'affiche la catégorie que si elle contient des services
            category.services.length > 0 && (
              <div key={category.title}>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-heading uppercase tracking-wider text-white">{category.title}</h2>
                  <p className="text-sm text-gold uppercase tracking-widest">{category.subtitle}</p>
                </div>
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-x-12 gap-y-4">
                  {category.services.map((service) => (
                    <div key={service.id} className="flex justify-between items-baseline border-b border-dashed border-zinc-800 py-3 group hover:border-gold/50 transition-colors">
                      <p className="text-gray-300 group-hover:text-white transition-colors">
                        {service.title}
                      </p>
                      <p className="text-xl font-bold text-gold shrink-0 ml-4">
                        {/* Petit calcul pour "à partir de" si prix > 300 (exemple) */}
                        {service.price >= 300 && <span className="text-xs font-light normal-case text-white/50 mr-2">à partir de</span>}
                        {service.price} <span className="text-sm font-light">DHS</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        {/* --- SECTION PACKS (Dynamique avec ton design) --- */}
        {packs.length > 0 && (
            <div className="mt-24">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-heading uppercase tracking-wider text-gold">Nos Packs Exclusifs</h2>
                    <p className="text-sm text-white/70">Profitez de nos formules complètes pour une expérience ultime.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {packs.map((pack) => {
                        // Astuce : On nettoie le titre (enlève "PACK:") et on crée une liste à puces si le titre contient "+"
                        const cleanTitle = pack.title.replace('PACK:', '').replace('PACK', '').trim();
                        const items = cleanTitle.includes('+') ? cleanTitle.split('+') : [cleanTitle];

                        return (
                            <div key={pack.id} className="bg-zinc-900/50 border border-gold/20 rounded-lg p-8 flex flex-col text-center hover:border-gold transition-all duration-300 hover:-translate-y-2">
                                <h3 className="text-2xl font-heading uppercase text-gold min-h-[60px] flex items-center justify-center">
                                    {cleanTitle.split('+')[0] || "Pack"} {/* Prend le 1er mot ou tout */}
                                </h3>
                                <p className="text-5xl font-bold my-4 text-white">
                                    {pack.price} <span className="text-2xl font-light text-gold">DHS</span>
                                </p>
                                
                                {/* Liste des éléments du pack (séparés par + dans le titre DB) */}
                                <ul className="space-y-2 text-white/80 flex-grow mb-8 mt-4">
                                    {items.map((item, idx) => (
                                        <li key={idx} className="capitalize border-b border-white/5 pb-2 last:border-0">
                                            {item.trim()}
                                        </li>
                                    ))}
                                </ul>

                                <Link 
                                    href="/booking" 
                                    className="mt-auto inline-block bg-gold text-black font-bold py-3 px-8 rounded-lg text-sm uppercase tracking-wider hover:bg-white transition-transform hover:scale-105 shadow-lg"
                                >
                                    Réserver ce Pack
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        {/* --- FOOTER CTA --- */}
        <div className="text-center mt-24 bg-zinc-900/80 border border-zinc-800 py-16 rounded-lg mx-auto max-w-4xl">
            <h2 className="text-3xl font-heading text-white mb-4">Prêt à révéler votre meilleur style ?</h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8 px-4">
                La qualité Barber Co. est notre signature. La réservation ne prend que 60 secondes.
            </p>
            <Link 
                href="/booking" 
                className="inline-flex items-center justify-center rounded-md text-lg font-bold uppercase tracking-wider bg-gold text-black hover:bg-white hover:scale-105 transition-all h-14 px-10 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
                Réserver Maintenant
            </Link>
        </div>

      </div>
    </div>
  );
}
