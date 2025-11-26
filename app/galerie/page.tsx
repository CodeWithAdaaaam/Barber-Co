import Image from 'next/image';
import { getBarbers } from '@/lib/api';
import { Instagram } from 'lucide-react';

// On force le rafraîchissement des données (Dynamic)
export const revalidate = 0; 

export default async function GaleriePage() {
  const barbers = await getBarbers();

  // Images statiques pour la galerie (Coupes)
  const galleryImages = [
    '/images/IMG_0312.jpg', '/images/IMG_1309.jpg', '/images/IMG_5351.jpg'
  ];

  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-20">
      
      <section className="container mx-auto px-4 mb-24">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter font-heading text-gold">
                NOS EXPERTS
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
                Rencontrez l'équipe de passionnés qui prend soin de votre style au quotidien.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {barbers.map((barber) => (
                <div key={barber.id} className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-gold transition-all duration-300">
                    {/* Photo du Coiffeur */}
                    <div className="relative h-80 w-full overflow-hidden">
                        <Image
                            src={barber.avatar_url || '/images/BARBER__logo.png'} 
                            alt={barber.full_name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    
                    {/* Infos */}
                    <div className="p-6 text-center">
                        <h3 className="text-2xl font-bold mb-2 text-white">{barber.full_name}</h3>
                        <p className="text-gray-400 text-sm mb-6 min-h-[60px]">
                            {barber.bio || "Expert coiffeur barbier passionné par son métier."}
                        </p>
                        
                        {barber.instagram_link && (
                            <a 
                                href={barber.instagram_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-gold border border-gold px-6 py-2 rounded-full hover:bg-gold hover:text-black transition-colors font-bold text-sm"
                            >
                                <Instagram size={16} /> Suivre sur Insta
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* --- SECTION 2: RÉALISATIONS (Statique) --- */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center text-white font-heading">
            GALERIE DE STYLES
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Tu peux remettre tes images de galerie ici */}
            {/* Pour l'exemple je mets des placeholders gris */}
            <div className="aspect-square bg-zinc-800 rounded-lg"></div>
            <div className="aspect-square bg-zinc-800 rounded-lg"></div>
            <div className="aspect-square bg-zinc-800 rounded-lg"></div>
            <div className="aspect-square bg-zinc-800 rounded-lg"></div>
            <div className="aspect-square bg-zinc-800 rounded-lg"></div>
            <div className="aspect-square bg-zinc-800 rounded-lg"></div>
        </div>
      </section>

    </div>
  );
}