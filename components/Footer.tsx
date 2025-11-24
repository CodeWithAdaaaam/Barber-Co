'use client'; 
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Instagram, MessageCircle  } from 'lucide-react';
import Image from 'next/image'; 

const Footer = () => {
  const pathname = usePathname();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-black text-white/70 py-16 font-sans">
      <div className="container mx-auto px-4">
        
        {/* --- CONTENU PRINCIPAL (GRID) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo */}
          <div>
             <Link href="/" aria-label="Page d'accueil de Barber Co.">
               <Image
                  src="/BARBER__logo.png"     
                  alt="Logo Barber Co."
                  width={150}           
                  height={80}
                  style={{ height: 'auto', width: 'auto' }} // Petit fix pour éviter le warning Next.js
               />
             </Link>
            <p className="mt-4 text-xs max-w-xs">
              L'art de la coiffure masculine, réinventé. Votre style est notre signature.
            </p>
          </div>
          
          {/* Horaires */}
          <div>
            <h3 className="font-bold text-gold uppercase tracking-widest mb-4">Hours</h3>
            <ul className="space-y-2">
              <li><span className="font-semibold">Lun-Dim:</span> 10h00-23h30</li>
            </ul>
          </div>

          {/* Menu & Contact */}
          <div>
            <h3 className="font-bold text-gold uppercase tracking-widest mb-4">Contact & Menu</h3>
            <ul className="space-y-2">
              <li><Link href="/services" className="hover:text-gold transition-colors">Services</Link></li>
              <li><Link href="/booking" className="hover:text-gold transition-colors">Book appointment</Link></li>
              <li><a href="tel:+212661217511" className="hover:text-gold">+212 66 12 17 51 1</a></li>
              <li className="text-sm">Rue Bani Jaber, Rabat 10000</li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-bold text-gold uppercase tracking-widest mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/barber.co.rabat?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/70 hover:text-gold transition-colors"><Instagram /></a>
              <a href="https://wa.me/212661217511" target="_blank" rel="noopener noreferrer" aria-label="Whatsapp" className="text-white/70 hover:text-gold transition-colors"><MessageCircle  /></a>
            </div>
          </div>
        </div>

        {/* --- NOUVELLE SECTION : COPYRIGHT & SIGNATURE --- */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
            
            <p className="mb-2 md:mb-0">
              &copy; 2025 Barber Co. Tous droits réservés.
            </p>

            <div className="flex items-center gap-1">
              <span>Made by</span>
              <a 
                href="https://codewithadaaaam.github.io/portfolio/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold font-bold hover:text-white hover:underline transition-colors"
              >
                CodeByAdam
              </a>
            </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;