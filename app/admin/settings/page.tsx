"use client";
import { useEffect, useState } from 'react';
import { getServices, getBarbers, deleteService, toggleBarberStatus, addBarber, addService,getSalonSettings, updateSalonSettings } from '@/lib/api';
import { Trash2, Power, X } from 'lucide-react';

export default function SettingsPage() {
  // --- ETATS ---
  const [services, setServices] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  
  // Etats pour les Modales (Popups)
  const [showBarberModal, setShowBarberModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Etats pour les Formulaires
  const [newBarber, setNewBarber] = useState({ full_name: '', display_order: 1 });
  const [newService, setNewService] = useState({ title: '', price: 0, duration: 30, color_code: '#3B82F6' });

  const [settings, setSettings] = useState({ start_hour: 9, end_hour: 22 });

  // --- CHARGEMENT ---
  const load = () => {
    getServices().then(setServices);
    getBarbers().then((data: any[]) => {
        // On trie les barbiers par ordre d'affichage
        setBarbers(data.sort((a, b) => a.display_order - b.display_order));
    });
  };

  useEffect(() => { load();
    getSalonSettings().then(setSettings);
   }, []);
   const handleSaveSettings = async () => {
    await updateSalonSettings(settings.start_hour, settings.end_hour);
    alert('Horaires mis à jour !');
};

  // --- HANDLERS ---
  const handleDeleteService = async (id: string) => {
    if(confirm('Supprimer ce service ?')) {
        await deleteService(id);
        load();
    }
  };

  const handleToggleBarber = async (id: string, currentStatus: boolean) => {
    await toggleBarberStatus(id, !currentStatus);
    load();
  };

  const handleCreateBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await addBarber(newBarber);
        setShowBarberModal(false);
        setNewBarber({ full_name: '', display_order: barbers.length + 1 });
        load();
    } catch (error) {
        console.error(error);
        alert("Erreur lors de l'ajout");
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await addService(newService);
        setShowServiceModal(false);
        setNewService({ title: '', price: 0, duration: 30, color_code: '#3B82F6' });
        load();
    } catch (error) {
        console.error(error);
        alert("Erreur lors de l'ajout");
    }
  };

  // Palette de couleurs pour les services
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#1F2937'];

  return (
    <div className="p-8 relative h-full">
      <h2 className="text-2xl font-bold mb-6">Configuration du Salon</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8 flex items-end gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ouverture (h)</label>
            <input 
                type="number" min="0" max="23"
                className="border rounded p-2 w-24"
                value={settings.start_hour}
                onChange={(e) => setSettings({...settings, start_hour: parseInt(e.target.value)})}
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fermeture (h)</label>
            <input 
                type="number" min="0" max="23"
                className="border rounded p-2 w-24"
                value={settings.end_hour}
                onChange={(e) => setSettings({...settings, end_hour: parseInt(e.target.value)})}
            />
        </div>
        <button onClick={handleSaveSettings} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 h-10 mb-[1px]">
            Enregistrer les horaires
        </button>
    </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* === SECTION BARBIERS === */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-bold mb-4">Gestion des Barbiers</h3>
            <div className="space-y-4">
                {barbers.map(barber => (
                    <div key={barber.id} className={`flex items-center justify-between p-3 rounded-lg border ${barber.is_active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-sm text-gray-600">
                                {barber.display_order}
                            </div>
                            <div>
                                <p className="font-bold">{barber.full_name}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleToggleBarber(barber.id, barber.is_active)}
                            className={`p-2 rounded-full transition-colors ${barber.is_active ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                            title={barber.is_active ? "Désactiver" : "Activer"}
                        >
                            <Power size={18} />
                        </button>
                    </div>
                ))}
                <button 
                    onClick={() => setShowBarberModal(true)}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-black hover:text-black transition font-medium"
                >
                    + Ajouter un barbier
                </button>
            </div>
        </div>

        {/* === SECTION SERVICES === */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-bold mb-4">Services & Tarifs</h3>
            <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {services.map(service => (
                    <div key={service.id} className="flex items-center justify-between p-3 border rounded hover:shadow-sm transition bg-white">
                        <div className="flex items-center gap-3">
                             <div className="w-3 h-12 rounded-full" style={{backgroundColor: service.color_code}}></div>
                             <div>
                                <p className="font-bold text-gray-800">{service.title}</p>
                                <p className="text-sm text-gray-500 font-medium">{service.duration} min • {service.price} DHS</p>
                             </div>
                        </div>
                        <button onClick={() => handleDeleteService(service.id)} className="text-gray-300 hover:text-red-500 p-2">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
            <button 
                onClick={() => setShowServiceModal(true)}
                className="w-full mt-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-bold shadow-lg"
            >
                Ajouter un Service
            </button>
        </div>

      </div>

      {/* ================= MODALES (C'est la partie qui manquait !) ================= */}

      {/* 1. MODALE BARBIER */}
      {showBarberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Nouveau Barbier</h3>
                    <button onClick={() => setShowBarberModal(false)}><X className="text-gray-400 hover:text-black"/></button>
                </div>
                <form onSubmit={handleCreateBarber} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                        <input 
                            required
                            type="text" 
                            placeholder="ex: Karim"
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                            value={newBarber.full_name}
                            onChange={e => setNewBarber({...newBarber, full_name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ordre (Colonne)</label>
                        <input 
                            type="number" 
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                            value={newBarber.display_order}
                            onChange={e => setNewBarber({...newBarber, display_order: parseInt(e.target.value)})}
                        />
                    </div>
                    <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800">
                        Créer le barbier
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* 2. MODALE SERVICE */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Nouveau Service</h3>
                    <button onClick={() => setShowServiceModal(false)}><X className="text-gray-400 hover:text-black"/></button>
                </div>
                <form onSubmit={handleCreateService} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du service</label>
                        <input 
                            required
                            type="text" 
                            placeholder="ex: Coupe + Barbe"
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                            value={newService.title}
                            onChange={e => setNewService({...newService, title: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DHS)</label>
                            <input 
                                required
                                type="number" 
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                                value={newService.price}
                                onChange={e => setNewService({...newService, price: parseInt(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
                            <input 
                                required
                                type="number" 
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                                value={newService.duration}
                                onChange={e => setNewService({...newService, duration: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Couleur (pour le calendrier)</label>
                        <div className="flex gap-2 flex-wrap">
                            {colors.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setNewService({...newService, color_code: color})}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform ${newService.color_code === color ? 'border-black scale-110' : 'border-transparent'}`}
                                    style={{backgroundColor: color}}
                                />
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800">
                        Créer le service
                    </button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}