import Image from 'next/image';

const SalonSection = () => {
  return (
    <section className="relative h-[60vh] bg-black flex items-center justify-center text-center">
      <Image
        src="/images/Generated3.png" 
        alt="Vue panoramique de l'intérieur moderne du salon Barber Co."
        fill
        style={{ objectFit: 'cover' }}
        loading="lazy"
        className="opacity-30"
      />
      <div className="relative z-10 p-4">
        <h2 className="text-4xl md:text-5xl font-heading text-white">
        Le <span className="text-gold font-bold">Salon</span> — Faites comme chez vous
        </h2>
      </div>
    </section>
  );
};

export default SalonSection;