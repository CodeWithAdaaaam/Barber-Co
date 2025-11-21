import { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

// Métadonnées SEO spécifiques à la page Contact
export const metadata: Metadata = {
  title: 'Contact & Localisation',
  description: 'Contactez Barber Co. ou trouvez l\'adresse de notre salon de barbier à [Votre Ville]. Prenez rendez-vous par téléphone ou visitez-nous.',
};

export default function ContactPage() {
  return (
    <div className="bg-anthracite min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        
        {/* En-tête de la page */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-heading font-bold">Get in Touch</h1>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            Une question ? Prêt à réserver votre prochain rendez-vous ? Contactez-nous. Nous sommes là pour vous aider à affirmer votre style.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          
          <div className="lg:col-span-2 bg-black rounded-lg p-8 space-y-8 shadow-lg">
            
            {/* Section Coordonnées */}
            <div>
              <h2 className="text-2xl font-bold text-gold mb-6">Nos Coordonnées</h2>
              <ul className="space-y-5 text-off-white">
                <li className="flex items-start">
                  <MapPin className="text-gold mt-1 mr-4 flex-shrink-0" size={20} />
                  <span>123 Rue de la Coiffure, 75001 Paris, France</span>
                </li>
                <li className="flex items-start">
                  <Phone className="text-gold mt-1 mr-4 flex-shrink-0" size={20} />
                  <a href="tel:+33123456789" className="hover:text-gold transition-colors">+33 1 23 45 67 89</a>
                </li>
                <li className="flex items-start">
                  <Mail className="text-gold mt-1 mr-4 flex-shrink-0" size={20} />
                  <a href="mailto:contact@barber-co.com" className="hover:text-gold transition-colors">contact@barber-co.com</a>
                </li>
              </ul>
            </div>
            
            {/* Section Horaires */}
            <div>
              <h2 className="text-2xl font-bold text-gold mb-6">Nos Horaires</h2>
              <ul className="space-y-2 text-off-white text-sm">
                 <li className="flex justify-between border-b border-anthracite-dark py-2">
                   <span>Mardi - Vendredi</span> 
                   <span className="font-semibold">9h00 - 19h00</span>
                 </li>
                 <li className="flex justify-between border-b border-anthracite-dark py-2">
                   <span>Samedi - Dimanche</span> 
                   <span className="font-semibold">10h00 - 19h00</span>
                 </li>
                 <li className="flex justify-between py-2 text-white/60">
                   <span>Lundi</span> 
                   <span className="font-semibold">Fermé</span>
                 </li>
              </ul>
            </div>
          </div>


          <div className="lg:col-span-3 h-[550px] w-full rounded-lg overflow-hidden shadow-lg">
  
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5376.31552242171!2d-6.818449222843357!3d33.979640973184516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76b0bef73d5b5%3A0x8a6cd79a87df5016!2sBarber%20Co.%20Rabat!5e1!3m2!1sfr!2sma!4v1763054027124!5m2!1sfr!2sma"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Emplacement du salon Barber Co."
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  );
}