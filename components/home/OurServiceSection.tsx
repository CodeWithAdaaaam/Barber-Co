import { AccordionItem } from '../ui/Accordion';
import { Button } from '../ui/Button';
import Link from 'next/link';

const services = [
  {
    title: 'Coupe Homme & Styling',
    description: 'Une coupe précise suivie d\'un coiffage professionnel pour un look impeccable, adaptée à votre style et à la morphologie de votre visage.',
  },
  {
    title: 'Taille de Barbe & Soin',
    description: 'Sculptez votre barbe à la perfection. Ce service inclut la taille, le traçage des contours, et l\'application d\'huiles et baumes nourrissants.',
  },
  {
    title: 'Rasage Traditionnel',
    description: 'Vivez l\'expérience du rasage à l\'ancienne avec serviette chaude, blaireau et coupe-choux pour une peau parfaitement lisse et douce.',
  },
  {
    title: 'Soins du Visage',
    description: 'Un soin purifiant et relaxant spécialement conçu pour la peau masculine, pour un teint frais et revitalisé.',
  },
];

const OurServicesSection = () => {
  return (
    <section className="bg-black py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Taille des titres ajustée */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">Our Services</h2>
          <p className="mt-4 text-white/70">
            De la coupe signature au soin relaxant, découvrez nos services conçus pour l'homme moderne.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-12">
            {/* ... (votre code d'accordéon reste le même) ... */}
        </div>

        <div className="text-center mt-12">
            {/* ... (votre bouton reste le même) ... */}
        </div>
      </div>
    </section>
  );
};

export default OurServicesSection;