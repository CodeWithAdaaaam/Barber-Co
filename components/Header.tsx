'use client'; 

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from "next/navigation"; // Import déjà présent, parfait
import { Menu, X } from 'lucide-react'; 

const Header = () => {
  const pathname = usePathname(); // 1. On récupère l'URL actuelle
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 2. Si l'URL commence par "/admin", on ne retourne RIEN (null)
  // Cela empêche le header de s'afficher et de cacher ton dashboard
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/70 to-transparent">
      <div className="container mx-auto flex justify-between items-center">

        <div className="hidden md:grid grid-cols-3 items-center w-full">

            <nav className="flex items-center space-x-8 text-sm uppercase tracking-wider justify-self-start">
              <Link href="/services" className="hover:text-gold transition-colors">Services</Link>
              <Link href="/galerie" className="hover:text-gold transition-colors">Galerie</Link>
            </nav>

            <div className="justify-self-center">
              <Link href="/" aria-label="Page d'accueil de Barber Co.">
                <Image
                  src="/images/BARBER__logo.png" 
                  alt="Logo Barber Co."
                  width={230} 
                  height={60}  
                  priority={true}  
                />
              </Link>
            </div>

            <div className="flex items-center space-x-8 justify-self-end">
              <Link 
                href="/booking" 
                className="inline-flex items-center justify-center rounded-md text-sm font-bold uppercase tracking-wider bg-gold text-anthracite hover:bg-gold-light hover:scale-105 transition-all h-11 px-8"
              >
                Prendre un Rendez-Vous
              </Link>
            </div>
        </div>

        <div className="md:hidden flex justify-between items-center w-full">
            {/* Logo sur mobile  */}
            <Link href="/" aria-label="Page d'accueil de Barber Co." className="z-50">
              <Image
                src="/BARBER__logo.png" 
                alt="Logo Barber Co."
                width={120} 
                height={50}
                priority
              />
            </Link>

            {/* Bouton Hamburger */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="z-50 text-white">
                {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 bg-black/95 backdrop-blur-sm transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full space-y-8 text-2xl uppercase tracking-widest">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:text-gold transition-colors">Accueil</Link>
            <Link href="/services" onClick={() => setIsMenuOpen(false)} className="hover:text-gold transition-colors">Services</Link>
            <Link href="/galerie" onClick={() => setIsMenuOpen(false)} className="hover:text-gold transition-colors">Galerie</Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-gold transition-colors">Contact</Link>
            <Link 
                href="/booking" 
                onClick={() => setIsMenuOpen(false)}
                className="mt-8 inline-flex items-center justify-center rounded-md font-bold bg-gold text-anthracite py-3 px-10"
            >
                Réserver
            </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;