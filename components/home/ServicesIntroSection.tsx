import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button'; // Assurez-vous d'avoir ce composant

const ServicesIntroSection = () => {
  return (
    <section id="services-intro" className="bg-anthracite py-16 md:py-24">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div>
          <Image
            src="/images/Generated2.png"
            alt="Client satisfait recevant une coupe de cheveux chez Barber Co."
            width={600}
            height={400}
            loading="lazy"
            className="rounded-lg shadow-2xl"
          />
        </div>
        
        <div className="text-white text-center md:text-left">
          <h2 className="text-3xl lg:text-5xl font-heading font-bold">Les beaux jours capillaires commencent ici !</h2>
          <p className="mt-4 text-white/80 leading-relaxed">
            Chaque barbier de notre salon à Rabat est un expert en coiffure masculine. Que ce soit pour une coupe homme moderne ou une taille de barbe précise, nous maîtrisons notre art.
          </p>
          <Button asChild variant="outline" className="mt-8">
            <Link href="/services">Voir nos Services →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesIntroSection;