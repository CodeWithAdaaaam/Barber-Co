import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// Métadonnées SEO
export const metadata: Metadata = {
  title: 'Galerie de Réalisations - Barber Co. Rabat',
  description: 'Découvrez nos coupes homme, dégradés, et tailles de barbe réalisées par nos barbiers experts à Rabat. Inspirez-vous pour votre prochain style.',
};

// --- GESTION DES DONNÉES DE LA GALERIE ---
// Pour ajouter une image, ajoutez simplement un nouvel objet à ce tableau.
// C'est la seule partie du code que vous aurez à modifier pour mettre à jour la galerie.
const galleryImages = [
  {
    id: 1,
    src: '/images/gallery/coupe-01.webp', // Assurez-vous que l'image existe à cet emplacement
    alt: 'Coupe homme dégradé à blanc avec traçage de barbe, réalisée par Mohammed, barbier expert chez Barber Co. Rabat.',
    style: 'Dégradé à blanc',
    barber: 'Mohammed',
  },
  {
    id: 2,
    src: '/images/gallery/coupe-02.webp',
    alt: 'Taille de barbe classique avec contours précis par Youssef.',
    style: 'Barbe Classique',
    barber: 'Youssef',
  },
  {
    id: 3,
    src: '/images/gallery/coupe-03.webp',
    alt: 'Coiffure Taper Fade sur cheveux bouclés, par Amine.',
    style: 'Taper Fade',
    barber: 'Amine',
  },
  {
    id: 4,
    src: '/images/gallery/coupe-04.webp',
    alt: 'Style Gentleman sur cheveux mi-longs, coiffé au brushing.',
    style: 'Coupe Gentleman',
    barber: 'Mohammed',
  },
  {
    id: 5,
    src: '/images/gallery/coupe-05.webp',
    alt: 'Coloration cheveux homme blond platine par Barber Co. Rabat.',
    style: 'Coloration Platine',
    barber: 'Youssef',
  },
  {
    id: 6,
    src: '/images/gallery/coupe-06.webp',
    alt: 'Combo coupe de cheveux et barbe soignée, style moderne.',
    style: 'Combo Coupe & Barbe',
    barber: 'Amine',
  },
  // Ajoutez autant d'images que vous le souhaitez ici...
];


// --- LE COMPOSANT DE LA PAGE ---
export default function GaleriePage() {
  return (
    <div className="bg-anthracite min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">

        {/* En-tête de la page */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-heading font-bold text-gold">Nos Réalisations</h1>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            L'art et la précision dans chaque coupe. Découvrez le savoir-faire de nos barbiers à travers nos derniers chefs-d'œuvre.
          </p>
        </div>

        {/* Grille de la galerie */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((image) => (
            <div key={image.id} className="group relative overflow-hidden rounded-lg aspect-square shadow-lg">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 ease-in-out group-hover:scale-110"
                quality={75}
              />
              {/* Overlay qui apparaît au survol */}
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-bold text-gold">{image.style}</h3>
                <p className="text-sm text-white/80">Par {image.barber}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Appel à l'action */}
        <div className="text-center mt-20">
            <h2 className="text-3xl font-heading text-white mb-4">Inspiré ? Réservez votre style.</h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
                Montrez à votre barbier la coupe que vous aimez ou laissez-le vous conseiller pour créer un look qui vous est propre.
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