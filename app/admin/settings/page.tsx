"use client";
import { useEffect, useState } from 'react';
// Assure-toi d'importer updateBarber ici vvv
import { getServices, getBarbers, deleteService, toggleBarberStatus, addBarber, updateBarber, uploadBarberPhoto, addService, getSalonSettings, updateSalonSettings, Barber } from '@/lib/api';
import { Trash2, Power, X, Pencil,Upload, Loader2  } from 'lucide-react'; // J'ai ajouté 'Pencil'

export default function SettingsPage() {
  // --- ETATS ---
  const [services, setServices] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  
  // Etats pour les Modales
  const [showBarberModal, setShowBarberModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Etat pour savoir si on est en train de modifier un barbier existant
  const [editingBarberId, setEditingBarberId] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  // Etats pour les Formulaires
  const [newService, setNewService] = useState({ title: '', price: 0, duration: 30, color_code: '#3B82F6' });
  const [settings, setSettings] = useState({ start_hour: 9, end_hour: 22 });

  // Note: Ce state sert maintenant pour la CRÉATION et la MODIFICATION
  const [formDataBarber, setFormDataBarber] = useState<Partial<Barber>>({ 
      full_name: '', 
      display_order: 1, 
      bio: '', 
      instagram_link: '', 
      avatar_url: '' 
  });

  // --- CHARGEMENT ---
  const load = () => {
    getServices().then(setServices);
    getBarbers().then((data: any[]) => {
        setBarbers(data.sort((a, b) => a.display_order - b.display_order));
    });
  };

  useEffect(() => { 
    load();
    getSalonSettings().then(setSettings);
   }, []);

   const handleSaveSettings = async () => {
    await updateSalonSettings(settings.start_hour, settings.end_hour);
    alert('Horaires mis à jour !');
  };

  // --- HANDLERS ---

  // 1. Ouvrir la modale pour AJOUTER un nouveau barbier
  const openAddBarberModal = () => {
      setEditingBarberId(null); // On n'édite personne
      setFormDataBarber({ full_name: '', display_order: barbers.length + 1, bio: '', instagram_link: '', avatar_url: '' }); // Formulaire vide
      setShowBarberModal(true);
  };

  // 2. Ouvrir la modale pour MODIFIER un barbier existant
  const openEditBarberModal = (barber: any) => {
      setEditingBarberId(barber.id); // On sauvegarde l'ID de celui qu'on modifie
      setFormDataBarber({
          full_name: barber.full_name,
          display_order: barber.display_order,
          bio: barber.bio || '',
          instagram_link: barber.instagram_link || '',
          avatar_url: barber.avatar_url || ''
      });
      setShowBarberModal(true);
  };

  // 3. Sauvegarder (Création OU Modification)
  const handleSaveBarber = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBarberId) {
                await updateBarber(editingBarberId, formDataBarber);
            } else {
                await addBarber(formDataBarber);
            }
            setShowBarberModal(false);
            load();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true); // On active le chargement

    try {
        // On envoie le fichier à Supabase et on récupère le lien
        const publicUrl = await uploadBarberPhoto(file);
        
        // On met à jour le formulaire avec ce lien
        setFormDataBarber(prev => ({ ...prev, avatar_url: publicUrl }));
    } catch (error) {
        alert("Erreur lors de l'upload de l'image. Vérifiez votre connexion.");
    } finally {
        setIsUploading(false); // On désactive le chargement
    }
  };

  
  const handleToggleBarber = async (id: string, currentStatus: boolean) => {
    await toggleBarberStatus(id, !currentStatus);
    load();
  };

  const handleDeleteService = async (id: string) => {
    if(confirm('Supprimer ce service ?')) {
        await deleteService(id);
        load();
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

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#1F2937'];

  return (
    <div className="p-8 relative h-full">
      <h2 className="text-2xl font-bold mb-6">Configuration du Salon</h2>
      
      {/* HORAIRES */}
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
            Enregistrer
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
                            <div className="flex flex-col">
                                <p className="font-bold">{barber.full_name}</p>
                                <p className="text-xs text-gray-400 truncate max-w-[150px]">{barber.bio}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {/* BOUTON MODIFIER */}
                            <button 
                                onClick={() => openEditBarberModal(barber)}
                                className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                title="Modifier les infos"
                            >
                                <Pencil size={18} />
                            </button>

                            {/* BOUTON ACTIVER/DÉSACTIVER */}
                            <button 
                                onClick={() => handleToggleBarber(barber.id, barber.is_active)}
                                className={`p-2 rounded-full transition-colors ${barber.is_active ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                                title={barber.is_active ? "Désactiver" : "Activer"}
                            >
                                <Power size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                
                {/* BOUTON AJOUTER */}
                <button 
                    onClick={openAddBarberModal}
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

      {/* ================= MODALES ================= */}

      {/* 1. MODALE BARBIER (CRÉATION ET ÉDITION) */}
      {showBarberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">
                        {editingBarberId ? 'Modifier le Barbier' : 'Nouveau Barbier'}
                    </h3>
                    <button onClick={() => setShowBarberModal(false)}><X className="text-gray-400 hover:text-black"/></button>
                </div>
                
                <form onSubmit={handleSaveBarber} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                        <input 
                            required type="text"
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                            value={formDataBarber.full_name}
                            onChange={e => setFormDataBarber({...formDataBarber, full_name: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea 
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                            rows={3}
                            value={formDataBarber.bio || ''}
                            onChange={e => setFormDataBarber({...formDataBarber, bio: e.target.value})}
                        />
                    </div>
                    
                    {/* --- ZONE D'UPLOAD PHOTO --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo du coiffeur</label>
                        
                        <div className="flex items-center gap-4 mt-2">
                            {/* Prévisualisation */}
                            <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                {isUploading ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                        <Loader2 className="animate-spin text-black" />
                                    </div>
                                ) : formDataBarber.avatar_url ? (
                                    <img src={formDataBarber.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Upload size={24} />
                                    </div>
                                )}
                            </div>

                            {/* Input File caché + Bouton stylisé */}
                            <div className="flex-1">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    id="photo-upload"
                                    className="hidden"
                                    onChange={handleImageChange}
                                    disabled={isUploading}
                                />
                                <label 
                                    htmlFor="photo-upload"
                                    className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors w-full justify-center
                                    ${isUploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-300 hover:border-black hover:text-black text-gray-700'}`}
                                >
                                    {isUploading ? 'Téléchargement...' : 'Choisir une photo'}
                                </label>
                                <p className="text-xs text-gray-400 mt-1">Formats acceptés : JPG, PNG</p>
                            </div>
                        </div>
                    </div>
                    {/* --------------------------- */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lien Instagram</label>
                        <input 
                            type="text"
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                            value={formDataBarber.instagram_link || ''}
                            onChange={e => setFormDataBarber({...formDataBarber, instagram_link: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
                        <input 
                            type="number" 
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                            value={formDataBarber.display_order}
                            onChange={e => setFormDataBarber({...formDataBarber, display_order: parseInt(e.target.value)})}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isUploading} // On empêche de sauvegarder si l'upload n'est pas fini
                        className={`w-full font-bold py-3 rounded-lg transition-colors
                            ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 text-white'}`}
                    >
                        {editingBarberId ? 'Enregistrer les modifications' : 'Créer le barbier'}
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* 2. MODALE SERVICE (Pas de changement ici, mais je la laisse pour que le code soit complet) */}
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
                            required type="text" placeholder="ex: Coupe + Barbe"
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                            value={newService.title}
                            onChange={e => setNewService({...newService, title: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DHS)</label>
                            <input 
                                required type="number" 
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                                value={newService.price}
                                onChange={e => setNewService({...newService, price: parseInt(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
                            <input 
                                required type="number" 
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                                value={newService.duration}
                                onChange={e => setNewService({...newService, duration: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
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