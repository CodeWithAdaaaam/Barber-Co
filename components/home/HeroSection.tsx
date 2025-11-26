import Image from 'next/image';
import { Button } from '../ui/Button'; // Assurez-vous d'avoir ce composant
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="bg-black text-white min-h-screen flex items-center justify-center pt-24 pb-12">
      <div className="container mx-auto px-4 flex flex-col-reverse md:grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black uppercase tracking-wider">
            Barbier & Coiffeur Homme à 
            <span className="block text-gold">Rabat</span>
          </h1>
          <h2 className="mt-4 text-lg md:text-xl lg:text-2xl text-white/80">
             Votre Style, Notre Signature. Découvrez l'expérience Barber Co.
          </h2>
          <Button asChild size="lg" className="mt-8">
            <Link href="/booking">Prendre un Rendez-Vous</Link>
          </Button>
        </div>
        

        <div className="flex justify-center">

          <Image
            src="/images/Generated1.png"
            alt="Barbier professionnel de Barber Co. Rabat réalisant une coupe homme."
            width={300} 
            height={300}
            priority
            className="rounded-full object-cover aspect-square border-4 border-gold/50 md:w-[450px] md:h-[450px]"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;