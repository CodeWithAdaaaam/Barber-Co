'use client';

import { useState } from 'react';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle, Calendar as CalendarIcon, User, Clock, Scissors, ChevronLeft, Sparkles, Package, Smile } from 'lucide-react';
import { createBooking, Service, Barber } from '@/lib/api';
import Link from 'next/link';

interface BookingFormProps {
  services: Service[];
  barbers: Barber[];
}

// Définition des Catégories
const CATEGORIES = [
  { id: 'hair', label: 'Coiffure', icon: Scissors, keywords: ['coupe', 'cheveux', 'brushing', 'tondeuse', 'taper'] },
  { id: 'beard', label: 'Barbe', icon: Smile, keywords: ['barbe', 'moustache', 'rasage'] },
  { id: 'care', label: 'Soins', icon: Sparkles, keywords: ['soin', 'masque', 'épilation', 'lissage', 'kératine', 'coloration'] },
  { id: 'pack', label: 'Packs', icon: Package, keywords: ['pack', 'combo', 'gold', 'silver', 'bronze'] },
];

export default function BookingForm({ services, barbers }: BookingFormProps) {
  // 1: Catégorie, 2: Service, 3: Barbier, 4: Date, 5: Infos, 6: Succès
  const [step, setStep] = useState(1); 
  const [submitting, setSubmitting] = useState(false);

  // Sélections
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Formulaire Client
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '' });

  // --- FILTRAGE DES SERVICES ---
  const getFilteredServices = () => {
    if (!selectedCategory) return services;
    
    const category = CATEGORIES.find(c => c.id === selectedCategory);
    if (!category) return services;

    return services.filter(service => {
      const title = service.title.toLowerCase();
      // On vérifie si le titre contient un des mots-clés de la catégorie
      return category.keywords.some(keyword => title.includes(keyword));
    });
  };

  const filteredServices = getFilteredServices();

  // --- GÉNÉRATEUR DE CRÉNEAUX ---
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 9; i < 20; i++) { // De 9h à 20h
      slots.push(`${i < 10 ? '0' + i : i}:00`);
      slots.push(`${i < 10 ? '0' + i : i}:30`);
    }
    return slots;
  };

  // --- SOUMISSION ---
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!selectedService || !selectedBarber || !selectedTime) return;

      // --- CORRECTION ICI ---
      // 1. On prend la date sélectionnée
      const appointmentDate = new Date(selectedDate);
      
      // 2. On extrait l'heure et les minutes du créneau choisi (ex: "14:30")
      const [hours, minutes] = selectedTime.split(':').map(Number);
      
      // 3. On règle l'heure sur l'objet Date
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      // 4. On convertit en format universel (ISO) pour la base de données
      // Cela gère automatiquement le fuseau horaire du Maroc
      const fullDateIso = appointmentDate.toISOString();

      await createBooking({
        clientName: clientInfo.name,
        clientPhone: clientInfo.phone,
        barberId: selectedBarber.id,
        serviceId: selectedService.id,
        startTime: fullDateIso,
        duration: selectedService.duration
      });

      setStep(6); 
    } catch (error: any) {
      alert(error.message || "Erreur lors de la réservation.");
    } finally {
      setSubmitting(false);
    }
};

  return (
    <div className="bg-black min-h-screen pt-32 pb-24 font-sans text-white">
      <div className="container mx-auto px-4">
        
        {/* EN-TÊTE */}
        {step < 6 && (
            <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl lg:text-5xl font-heading font-bold text-gold uppercase tracking-wide">
                {step === 1 && "Quelle prestation ?"}
                {step === 2 && "Choisissez le service"}
                {step === 3 && "Choisissez l'expert"}
                {step === 4 && "Date & Heure"}
                {step === 5 && "Vos Coordonnées"}
            </h1>
            
            {/* Barre de progression (5 étapes avant succès) */}
            <div className="w-full max-w-md mx-auto h-1 bg-gray-800 mt-6 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gold transition-all duration-500 ease-out"
                    style={{ width: `${(step / 5) * 100}%` }}
                ></div>
            </div>
            </div>
        )}

        <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 p-6 md:p-10 rounded-2xl shadow-2xl relative min-h-[400px]">
          
          {/* BOUTON RETOUR */}
          {step > 1 && step < 6 && (
            <button 
                onClick={() => setStep(step - 1)} 
                className="absolute top-6 left-6 text-gray-400 hover:text-gold transition flex items-center gap-2 text-xs uppercase tracking-widest z-10"
            >
                <ChevronLeft size={14} /> Retour
            </button>
          )}

          {/* --- ÉTAPE 1: CATÉGORIES (NOUVEAU) --- */}
          {step === 1 && (
            <div className="animate-fade-in pt-8">
              <div className="grid grid-cols-2 gap-4">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setStep(2); }}
                    className="group flex flex-col items-center justify-center p-8 rounded-xl bg-black border border-zinc-800 hover:border-gold hover:bg-zinc-900 transition-all"
                  >
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
                        <cat.icon size={32} />
                    </div>
                    <span className="text-xl font-heading font-bold group-hover:text-gold transition-colors uppercase tracking-wider">
                        {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* --- ÉTAPE 2: SERVICES (FILTRÉS) --- */}
          {step === 2 && (
            <div className="animate-fade-in pt-8">
              <div className="grid md:grid-cols-2 gap-4">
                {filteredServices.length > 0 ? (
                    filteredServices.map(service => (
                    <button 
                        key={service.id}
                        onClick={() => { setSelectedService(service); setStep(3); }}
                        className="group flex justify-between items-center p-5 rounded-xl bg-black border border-zinc-800 hover:border-gold transition-all text-left"
                    >
                        <div>
                            <span className="block text-lg font-bold group-hover:text-gold transition-colors">{service.title}</span>
                            <span className="text-sm text-gray-500">{service.duration} min</span>
                        </div>
                        <span className="font-heading text-xl font-bold text-gold">{service.price} DH</span>
                    </button>
                    ))
                ) : (
                    <div className="col-span-2 text-center py-10 text-gray-500">
                        Aucun service trouvé dans cette catégorie.
                    </div>
                )}
              </div>
            </div>
          )}
          
          {/* --- ÉTAPE 3: BARBIER --- */}
          {step === 3 && (
            <div className="animate-fade-in pt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {barbers.map(barber => (
                    <button 
                        key={barber.id}
                        onClick={() => { setSelectedBarber(barber); setStep(4); }}
                        className="p-6 rounded-xl bg-black border border-zinc-800 hover:border-gold transition-all flex flex-col items-center gap-4 group"
                    >
                        <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-2xl font-bold text-gray-500 group-hover:text-gold group-hover:bg-zinc-900 border-2 border-transparent group-hover:border-gold transition-all">
                            {barber.full_name.charAt(0)}
                        </div>
                        <span className="font-bold text-lg group-hover:text-gold transition-colors">{barber.full_name}</span>
                    </button>
                ))}
                <button 
                    onClick={() => { setSelectedBarber(barbers[0]); setStep(4); }}
                    className="p-6 rounded-xl bg-black border border-zinc-800 border-dashed hover:border-gold transition-all flex flex-col items-center gap-4 group opacity-70 hover:opacity-100"
                >
                    <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-2xl font-bold text-gray-500">?</div>
                    <span className="font-bold text-lg">Premier dispo</span>
                </button>
              </div>
            </div>
          )}

          {/* --- ÉTAPE 4: DATE & HEURE --- */}
          {step === 4 && (
             <div className="animate-fade-in pt-8">
                {/* Jours */}
                <div className="flex gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
                    {[...Array(14)].map((_, i) => {
                        const date = addDays(new Date(), i);
                        const isSelected = isSameDay(date, selectedDate);
                        return (
                            <button
                                key={i}
                                onClick={() => setSelectedDate(date)}
                                className={`min-w-[80px] p-4 rounded-xl border text-center transition-all ${
                                isSelected 
                                    ? 'bg-gold text-black border-gold font-bold transform scale-105' 
                                    : 'bg-black border-zinc-800 text-gray-400 hover:border-gray-600'
                                }`}
                            >
                                <div className="text-xs uppercase tracking-wider mb-1">{format(date, 'EEE', { locale: fr })}</div>
                                <div className="text-2xl font-heading">{format(date, 'd')}</div>
                            </button>
                        )
                    })}
                </div>

                {/* Heures */}
                <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clock size={14}/> Créneaux disponibles
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {generateTimeSlots().map((time) => (
                        <button
                        key={time}
                        onClick={() => { setSelectedTime(time); setStep(5); }}
                        className="py-3 px-2 rounded-lg bg-black border border-zinc-800 hover:border-gold hover:text-gold hover:bg-zinc-900 transition text-sm font-medium"
                        >
                        {time}
                        </button>
                    ))}
                </div>
             </div>
          )}

          {/* --- ÉTAPE 5: FORMULAIRE --- */}
          {step === 5 && (
            <div className="animate-fade-in pt-8">
                <div className="bg-black p-6 rounded-xl border border-zinc-800 mb-8">
                    <div className="flex justify-between mb-3 pb-3 border-b border-zinc-800">
                        <span className="text-gray-400">Prestation</span>
                        <span className="font-bold text-white">{selectedService?.title}</span>
                    </div>
                    <div className="flex justify-between mb-3 pb-3 border-b border-zinc-800">
                        <span className="text-gray-400">Expert</span>
                        <span className="font-bold text-white">{selectedBarber?.full_name}</span>
                    </div>
                    <div className="flex justify-between mb-3 pb-3 border-b border-zinc-800">
                        <span className="text-gray-400">Date</span>
                        <span className="font-bold text-white capitalize">{format(selectedDate, 'EEEE d MMMM', { locale: fr })} à {selectedTime}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span className="text-gray-400">Prix Total</span>
                        <span className="font-heading text-2xl text-gold">{selectedService?.price} DH</span>
                    </div>
                </div>

                <form onSubmit={handleBooking} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Nom Complet</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-black border border-zinc-800 rounded-lg p-4 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors placeholder-gray-700"
                                placeholder="Votre nom"
                                value={clientInfo.name}
                                onChange={e => setClientInfo({...clientInfo, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Téléphone</label>
                            <input 
                                required
                                type="tel" 
                                className="w-full bg-black border border-zinc-800 rounded-lg p-4 text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors placeholder-gray-700"
                                placeholder="06 00 00 00 00"
                                value={clientInfo.phone}
                                onChange={e => setClientInfo({...clientInfo, phone: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full bg-gold text-black font-bold font-heading uppercase tracking-wider py-5 rounded-lg hover:bg-white hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {submitting ? 'Confirmation en cours...' : 'Confirmer le Rendez-vous'}
                    </button>
                </form>
            </div>
          )}

          {/* --- ÉTAPE 6: SUCCÈS --- */}
          {step === 6 && (
            <div className="text-center py-12 animate-fade-in">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 border-2 border-green-500">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-4xl font-heading font-bold mb-4 text-white">Réservation Confirmée !</h2>
                <p className="text-gray-400 mb-10 text-lg">
                    Merci <span className="text-white font-bold">{clientInfo.name}</span>, votre rendez-vous est bien enregistré.
                </p>
                
                <Link 
                    href="/" 
                    className="inline-block bg-gold text-black px-10 py-4 rounded-lg font-bold font-heading uppercase tracking-wider hover:bg-white transition-colors"
                >
                    Retour à l'accueil
                </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}