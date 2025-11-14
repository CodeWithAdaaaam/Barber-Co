import Link from 'next/link';

export default function LocationHoursSection() {
  return (
    <section className="bg-black py-16 md:py-24 border-t border-anthracite-dark">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gold">Retrouvez-nous au cœur de Rabat</h2>
            <p className="mt-4 text-white/70 max-w-lg mx-auto lg:mx-0">
              Notre salon est facilement accessible pour vous offrir une parenthèse de bien-être. Venez découvrir l'expérience Barber Co.
            </p>
            
            <div className="mt-8 space-y-4 text-lg">
              <div className="bg-anthracite p-4 rounded-lg">
                <h3 className="text-xs uppercase text-white/60 tracking-wider">Adresse</h3>
                <p className="font-semibold">123 Rue de la Coiffure, Agdal, Rabat</p>
              </div>
              <div className="bg-anthracite p-4 rounded-lg">
                <h3 className="text-xs uppercase text-white/60 tracking-wider">Horaires</h3>
                <p className="font-semibold">Mardi - Dimanche : 9h00 - 19h00</p>
              </div>
            </div>

             <Link 
                href="/booking" 
                className="mt-8 inline-flex items-center justify-center rounded-md text-lg font-bold uppercase tracking-wider bg-gold text-anthracite hover:bg-gold-light hover:scale-105 transition-all h-14 px-10"
            >
                Réserver Maintenant
            </Link>
          </div>

          {/* Colonne de droite : Carte */}
          <div className="h-80 lg:h-96 w-full rounded-lg overflow-hidden shadow-lg border border-anthracite-dark">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.991625693759!2d2.352221915674381!3d48.85837007928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e671717a8c23a3%3A0xad5f50a8d2d30823!2sLouvre%20Museum!5e0!3m2!1sen!2sfr!4v1672834000000" 
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen={true}
              referrerPolicy="no-referrer-when-downgrade"
              title="Emplacement du salon Barber Co. à Rabat"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
}