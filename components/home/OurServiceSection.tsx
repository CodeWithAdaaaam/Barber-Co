import { AccordionItem } from '../ui/Accordion'; // Assurez-vous que ce chemin est correct
import { Button } from '../ui/Button';           // Assurez-vous que ce chemin est correct
import Link from 'next/link';

// Liste des services mis en avant sur la page d'accueil.
// C'est une sélection des services les plus populaires.
const featuredServices = [
  {
    title: 'Coupe Homme & Styling',
    description: 'Une coupe précise suivie d\'un coiffage professionnel pour un look impeccable, adaptée à votre style et à la morphologie de votre visage.',
  },
  {
    title: 'Taille de Barbe & Soin',
    description: 'Sculptez votre barbe à la perfection. Ce service inclut la taille, le traçage des contours, et l\'application d\'huiles et baumes nourrissants de première qualité.',
  },
  {
    title: 'Rasage Traditionnel',
    description: 'Vivez l\'expérience authentique du rasage à l\'ancienne avec serviette chaude, blaireau et coupe-choux pour une peau parfaitement lisse et apaisée.',
  },
  {
    title: 'Soins du Visage Masculin',
    description: 'Un soin purifiant et relaxant spécialement conçu pour la peau masculine, utilisant des produits experts pour un teint frais, hydraté et revitalisé.',
  },
];

export default function OurServicesSection() {
  return (
    <section className="bg-black py-16 md:py-24">
      <div className="container mx-auto px-4">
        
        {/* Titre de la section */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">Nos Services Signature</h2>
          <p className="mt-4 text-white/70">
            De la coupe signature au soin relaxant, découvrez nos services conçus pour l'homme moderne qui exige le meilleur.
          </p>
        </div>

        {/* Accordéon des services */}
        <div className="max-w-3xl mx-auto mt-12">
          {featuredServices.map((service) => (
            <AccordionItem key={service.title} title={service.title}>
              <p>{service.description}</p>
            </AccordionItem>
          ))}
        </div>

        {/* Appel à l'action */}
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link href="/services">Voir tous nos services & tarifs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}