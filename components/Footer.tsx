import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react'; // npm install lucide-react

const Footer = () => {
  return (
    <footer className="bg-black text-white/70 py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Logo */}
        <div>
           <Link href="/" className="text-3xl font-heading">
            <span className="text-gold">BARBER</span>
            <span className="font-script text-white"> Co.</span>
           </Link>
        </div>
        
        {/* Horaires */}
        <div>
          <h3 className="font-bold text-gold uppercase tracking-widest mb-4">Hours</h3>
          <ul className="space-y-2">
            <li><span className="font-semibold">Mon:</span> CLOSED</li>
            <li><span className="font-semibold">Tue-Fri:</span> 9 AM - 7 PM</li>
            <li><span className="font-semibold">Sat-Sun:</span> 10 AM - 7 PM</li>
          </ul>
        </div>

        {/* Menu & Contact */}
        <div>
          <h3 className="font-bold text-gold uppercase tracking-widest mb-4">Contact & Menu</h3>
          <ul className="space-y-2">
            <li><a href="/services" className="hover:text-gold transition-colors">Services</a></li>
            <li><a href="/booking" className="hover:text-gold transition-colors">Book appointment</a></li>
            <li className="pt-2"><a href="mailto:contact@barber-co.com" className="hover:text-gold">contact@barber-co.com</a></li>
            <li><a href="tel:+33123456789" className="hover:text-gold">+33 1 23 45 67 89</a></li>
            <li className="text-sm">123 Rue de la Coiffure, 75000 Votre Ville</li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="font-bold text-gold uppercase tracking-widest mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" aria-label="Instagram" className="text-white/70 hover:text-gold transition-colors"><Instagram /></a>
            <a href="#" aria-label="Facebook" className="text-white/70 hover:text-gold transition-colors"><Facebook /></a>
            <a href="#" aria-label="Twitter" className="text-white/70 hover:text-gold transition-colors"><Twitter /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;