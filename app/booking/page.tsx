'use client'; 

import { useState } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { InlineWidget } from 'react-calendly';
import { CheckCircle } from 'lucide-react';


const barbers = [
  {
    name: 'Mohammed',
    specialty: 'Expert Dégradé & Styles Modernes',
    imageUrl: '/images/barbers/mohammed.webp', // Créez ce dossier et ajoutez les photos
    calendlyUrl: 'https://calendly.com/ez-adam10/coupe-mohamed-clone-1', 
  },
  {
    name: 'Youssef',
    specialty: 'Spécialiste Barbe & Rasage Tradi',
    imageUrl: '/images/barbers/youssef.webp',
    calendlyUrl: 'https://calendly.com/VOTRE_COMPTE/youssef',
  },
  {
    name: 'Amine',
    specialty: 'Maître des Coupes Classiques',
    imageUrl: '/images/barbers/amine.webp',
    calendlyUrl: 'https://calendly.com/VOTRE_COMPTE/amine',
  },
  {
    name: 'Peu importe',
    specialty: 'Le premier barbier disponible',
    imageUrl: '/images/barbers/any.svg', // Une icône simple pour ce choix
    // Ce lien doit pointer vers un événement Calendly "Round Robin" qui distribue les clients
    calendlyUrl: 'https://calendly.com/VOTRE_COMPTE/rdv-barber-co', 
  },
];

const services = ['Coupe', 'Barbe', 'Combo Coupe + Barbe', 'Soins', 'Coloration'];

// --- LE COMPOSANT DE LA PAGE ---
export default function BookingPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<(typeof barbers[0]) | null>(null);

  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        
        {/* En-tête de la page */}
        <div className="text-center mb-12">
          <h1 className="text-5xl lg:text-6xl font-heading font-bold text-gold">Réservez Votre Rendez-vous</h1>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            Suivez ces étapes simples pour planifier votre prochaine visite.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-anthracite p-8 rounded-lg shadow-2xl">
          
          {/* ÉTAPE 1: Choix du Service */}
          <div className="mb-8">
            <h2 className="text-2xl font-heading flex items-center mb-4">
              <span className="bg-gold text-anthracite rounded-full h-8 w-8 flex items-center justify-center font-bold mr-3">1</span>
              Choisissez votre service
              {selectedService && <CheckCircle className="text-green-400 ml-3" />}
            </h2>
            <div className="flex flex-wrap gap-3">
              {services.map(service => (
                <button 
                  key={service}
                  onClick={() => setSelectedService(service)}
                  className={`px-6 py-3 rounded-lg font-bold transition-colors duration-200 border-2 ${
                    selectedService === service 
                    ? 'bg-gold text-anthracite border-gold' 
                    : 'bg-anthracite-dark border-transparent hover:border-gold'
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
          
          {/* ÉTAPE 2: Choix du Barbier (n'apparaît que si un service est choisi) */}
          {selectedService && (
            <div className="mb-8 animate-fade-in">
              <h2 className="text-2xl font-heading flex items-center mb-4">
                <span className="bg-gold text-anthracite rounded-full h-8 w-8 flex items-center justify-center font-bold mr-3">2</span>
                Choisissez votre barbier
                {selectedBarber && <CheckCircle className="text-green-400 ml-3" />}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {barbers.map(barber => (
                  <button 
                    key={barber.name}
                    onClick={() => setSelectedBarber(barber)}
                    className={`p-3 rounded-lg text-center transition-all duration-200 border-2 ${
                      selectedBarber?.name === barber.name 
                      ? 'bg-gold/10 border-gold scale-105' 
                      : 'bg-anthracite-dark border-transparent hover:border-gold/50'
                    }`}
                  >
                    <Image 
                      src={barber.imageUrl} 
                      alt={barber.name} 
                      width={80} 
                      height={80} 
                      className="rounded-full mx-auto mb-2 border-2 border-anthracite-dark"
                    />
                    <span className="font-bold block">{barber.name}</span>
                    <span className="text-xs text-white/60 block">{barber.specialty}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ÉTAPE 3: Calendrier (n'apparaît que si un barbier est choisi) */}
          {selectedBarber && (
            <div className="mt-8 animate-fade-in">
                <h2 className="text-2xl font-heading flex items-center mb-4">
                    <span className="bg-gold text-anthracite rounded-full h-8 w-8 flex items-center justify-center font-bold mr-3">3</span>
                    Sélectionnez la date et l'heure
                </h2>
                <div className="rounded-lg overflow-hidden min-h-[700px]">
                    <InlineWidget 
                        url={selectedBarber!.calendlyUrl}
                        pageSettings={{
                            backgroundColor: '2C2C2C', 
                            hideEventTypeDetails: true, 
                            hideLandingPageDetails: false, 
                            primaryColor: 'D4AF37', 
                            textColor: 'F3F3F3'
                        }}
                        />
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}