'use client'; 

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react'; // Icônes pour le hamburger

const Header = () => {
  // 'useState' pour gérer l'état d'ouverture/fermeture du menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/70 to-transparent">
      <div className="container mx-auto flex justify-between items-center">

        <div className="hidden md:grid grid-cols-3 items-center w-full">

            <nav className="flex items-center space-x-8 text-sm uppercase tracking-wider justify-self-start">
              <Link href="/services" className="hover:text-gold transition-colors">Services</Link>
              <Link href="/galerie" className="hover:text-gold transition-colors">Galerie</Link>
            </nav>

            <div className="justify-self-center">
              <Link href="/" className="text-3xl font-heading">
                <span className="text-gold">BARBER</span>
                <span className="font-script text-off-white text-4xl"> Co.</span>
              </Link>
            </div>

            <div className="flex items-center space-x-8 justify-self-end">
              <Link href="/login" className="text-sm uppercase tracking-wider hover:text-gold transition-colors">
                Login
              </Link>
              <Link 
                href="/booking" 
                className="inline-flex items-center justify-center rounded-md text-sm font-bold uppercase tracking-wider bg-gold text-anthracite hover:bg-gold-light hover:scale-105 transition-all h-11 px-8"
              >
                Book appointment
              </Link>
            </div>
        </div>

        <div className="md:hidden flex justify-between items-center w-full">
            {/* Logo sur mobile */}
            <Link href="/" className="text-2xl font-heading z-50">
                <span className="text-gold">BARBER</span>
                <span className="font-script text-off-white text-3xl"> Co.</span>
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