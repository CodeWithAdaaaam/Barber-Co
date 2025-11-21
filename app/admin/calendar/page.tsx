"use client";

import { useEffect, useState, useRef } from 'react';
import { 
  getBarbers, getDashboardData, getServices, getSalonSettings, 
  moveAppointment, createBooking, updateAppointmentDetails, deleteAppointment,
  DashboardAppointment, Barber, Service 
} from '@/lib/api';
import { format, parseISO, differenceInMinutes, addMinutes, addDays, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, RefreshCw, Plus, X, Trash2, Save, Clock } from 'lucide-react';

const PIXELS_PER_HOUR = 120;
const SNAP_MINUTES = 15;
const REFRESH_INTERVAL = 10000; // 10 secondes

export default function AdminCalendar() {
  // --- ETATS ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<DashboardAppointment[]>([]);
  const [settings, setSettings] = useState({ start_hour: 9, end_hour: 22 });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Drag & Drop
  const [draggedAppt, setDraggedAppt] = useState<DashboardAppointment | null>(null);

  // Modale (Création / Edition)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Partial<DashboardAppointment> | null>(null); // null = Création
  const [formData, setFormData] = useState({
    clientName: '', clientPhone: '', serviceId: '', barberId: '', startTime: '', endTime: ''
  });

  // --- CHARGEMENT DES DONNEES ---
  const loadData = async (showLoader = false) => {
    if (showLoader) setIsRefreshing(true);
    try {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      
      // On charge tout en parallèle
      const [bData, aData, sData, servData] = await Promise.all([
        getBarbers(),
        getDashboardData(dateStr),
        getSalonSettings(),
        getServices()
      ]);

      setBarbers(bData);
      setAppointments(aData);
      setSettings(sData);
      setServices(servData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // 1. Chargement initial + Changement de date
  useEffect(() => {
    setLoading(true);
    loadData();
  }, [currentDate]);

  // 2. Boucle Infinie (Auto-Refresh)
  useEffect(() => {
    const interval = setInterval(() => {
      // On ne rafraîchit pas si une modale est ouverte ou si on drag
      if (!isModalOpen && !draggedAppt) {
        loadData(false); 
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [currentDate, isModalOpen, draggedAppt]);


  // --- NAVIGATION DATE ---
  const handlePrevDay = () => setCurrentDate(prev => addDays(prev, -1));
  const handleNextDay = () => setCurrentDate(prev => addDays(prev, 1));
  const handleToday = () => setCurrentDate(new Date());


  // --- LOGIQUE DRAG & DROP (Inchangée) ---
  const handleDragStart = (e: React.DragEvent, appt: DashboardAppointment) => {
    setDraggedAppt(appt);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (e: React.DragEvent, barberId: string) => {
      e.preventDefault();
      if (!draggedAppt) return;

      // 1. CALCULS DE POSITION (C'est ces lignes qui te manquaient)
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetY = e.clientY - rect.top + e.currentTarget.scrollTop;
      const minutesFromStart = (offsetY / PIXELS_PER_HOUR) * 60;
      const snappedMinutes = Math.round(minutesFromStart / SNAP_MINUTES) * SNAP_MINUTES;

      // On recrée la date de base par rapport au jour affiché (currentDate)
      const dayStart = new Date(currentDate); 
      dayStart.setHours(settings.start_hour, 0, 0, 0);

      // On définit les variables manquantes
      const newStartDate = addMinutes(dayStart, snappedMinutes);
      
      const originalDuration = differenceInMinutes(parseISO(draggedAppt.end_time), parseISO(draggedAppt.start_time));
      const newEndDate = addMinutes(newStartDate, originalDuration);

      // 2. TENTATIVE DE DÉPLACEMENT
      try {
          await moveAppointment(
              draggedAppt.appointment_id, 
              newStartDate.toISOString(), 
              newEndDate.toISOString(), 
              barberId
          );
          
          // Si ça marche, on recharge pour voir le changement
          loadData(); 

      } catch (error: any) {
          // Si ça échoue (doublon), on affiche l'erreur
          alert(error.message); 
          // Et on recharge pour remettre le RDV à sa place d'origine
          loadData(); 
      }
      
      setDraggedAppt(null);
  };


  // --- GESTION MODALE ---
  const openNewModal = () => {
    setEditingAppt(null); // Mode Création
    // Par défaut : 1er barbier, 1er service, heure actuelle arrondie
    setFormData({
        clientName: '',
        clientPhone: '',
        serviceId: services[0]?.id || '',
        barberId: barbers[0]?.id || '',
        startTime: format(new Date(), 'HH:00'),
        endTime: '' // Sera calculé
    });
    setIsModalOpen(true);
  };

  const openEditModal = (appt: DashboardAppointment) => {
    setEditingAppt(appt); // Mode Edition
    setFormData({
        clientName: appt.client_name,
        clientPhone: appt.client_phone || '',
        serviceId: services.find(s => s.title === appt.service_title)?.id || '',
        barberId: appt.barber_id,
        startTime: format(parseISO(appt.start_time), 'HH:mm'),
        endTime: ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!editingAppt?.appointment_id) return;
    if (confirm('Voulez-vous vraiment supprimer ce rendez-vous ?')) {
        await deleteAppointment(editingAppt.appointment_id);
        setIsModalOpen(false);
        loadData();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // ... calculs des dates existants ...
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const fullStartTime = `${dateStr}T${formData.startTime}:00`;
      const selectedService = services.find(s => s.id === formData.serviceId);
      const duration = selectedService?.duration || 30;

      // AJOUT DU BLOC TRY/CATCH ICI
      try {
          if (!editingAppt) {
              // CREATION
              await createBooking({
                  clientName: formData.clientName,
                  clientPhone: formData.clientPhone,
                  barberId: formData.barberId,
                  serviceId: formData.serviceId,
                  startTime: fullStartTime,
                  duration: duration
              });
          } else {
              // MODIFICATION
              const startObj = new Date(fullStartTime);
              const endObj = addMinutes(startObj, duration);

              await updateAppointmentDetails(editingAppt.appointment_id!, {
                  barber_id: formData.barberId,
                  service_id: formData.serviceId,
                  start_time: fullStartTime,
                  end_time: endObj.toISOString()
              });
          }

          // Si tout se passe bien :
          setIsModalOpen(false);
          loadData();

      } catch (error: any) {
          // C'EST ICI QU'ON AFFICHE LE MESSAGE D'ERREUR AU LIEU DE CRASHER
          alert(error.message); 
      }
  };


  // --- CALCULS VISUELS ---
  const getTop = (dateStr: string) => {
    const date = parseISO(dateStr);
    const dayStart = new Date(date);
    dayStart.setHours(settings.start_hour, 0, 0, 0);
    return (differenceInMinutes(date, dayStart) / 60) * PIXELS_PER_HOUR;
  };
  const getHeight = (startStr: string, endStr: string) => {
    return (differenceInMinutes(parseISO(endStr), parseISO(startStr)) / 60) * PIXELS_PER_HOUR;
  };
  const totalHours = settings.end_hour - settings.start_hour;

  if (loading) return <div className="h-full flex items-center justify-center">Chargement du planning...</div>;

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      
      {/* EN-TÊTE DE CONTROLE */}
      <div className="h-16 border-b flex items-center justify-between px-4 flex-shrink-0 bg-white z-30">
        
        {/* Navigation Date */}
        <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button onClick={handlePrevDay} className="p-1 hover:bg-white rounded shadow-sm"><ChevronLeft size={20}/></button>
                <button onClick={handleToday} className="px-3 text-sm font-bold">Auj.</button>
                <button onClick={handleNextDay} className="p-1 hover:bg-white rounded shadow-sm"><ChevronRight size={20}/></button>
            </div>
            <h1 className="text-lg md:text-xl font-bold capitalize hidden md:block">
                {format(currentDate, 'EEEE d MMMM', { locale: fr })}
            </h1>
            <h1 className="text-sm font-bold capitalize md:hidden">
                {format(currentDate, 'd MMM', { locale: fr })}
            </h1>
        </div>

        {/* Actions Droite */}
        <div className="flex items-center gap-2 md:gap-4">
            <button 
                onClick={() => loadData(true)} 
                className={`p-2 text-gray-500 hover:bg-gray-100 rounded-full transition ${isRefreshing ? 'animate-spin' : ''}`}
                title="Actualiser"
            >
                <RefreshCw size={20} />
            </button>
            <button 
                onClick={openNewModal}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-bold shadow-lg"
            >
                <Plus size={18} /> <span className="hidden md:inline">Nouveau RDV</span>
            </button>
        </div>
      </div>

      {/* CALENDRIER */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Colonne Heures */}
        <div className="w-14 md:w-16 border-r bg-gray-50 flex-shrink-0 overflow-hidden z-20">
            <div className="h-12 border-b bg-white"></div> 
            <div className="overflow-hidden">
                {Array.from({ length: totalHours + 1 }).map((_, i) => (
                    <div key={i} className="text-xs text-gray-400 text-right pr-2 border-b border-gray-100" style={{ height: `${PIXELS_PER_HOUR}px` }}>
                        <span className="-mt-2 block">{settings.start_hour + i}:00</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Grille Barbiers */}
        <div className="flex-1 flex overflow-y-auto overflow-x-auto relative bg-white">
            <div className="flex min-w-full" style={{ width: `${Math.max(100, barbers.length * 250)}px` }}>
                {/* Lignes de fond */}
                <div className="absolute w-full pointer-events-none z-0 left-0">
                     <div className="h-12"></div> 
                     {Array.from({ length: totalHours + 1 }).map((_, i) => (
                        <div key={i} className="border-b border-gray-100 w-full" style={{ height: `${PIXELS_PER_HOUR}px` }}></div>
                    ))}
                </div>

                {barbers.map(barber => (
                    <div 
                        key={barber.id} 
                        className="flex-1 border-r min-w-[200px] relative bg-transparent"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, barber.id)}
                    >
                        <div className="h-12 border-b bg-white sticky top-0 z-20 flex items-center justify-center font-bold shadow-sm text-sm md:text-base">
                            {barber.full_name}
                        </div>

                        <div className="relative z-10" style={{ height: `${totalHours * PIXELS_PER_HOUR}px` }}>
                            {appointments
                                .filter(appt => appt.barber_id === barber.id)
                                .map(appt => (
                                    <div
                                        key={appt.appointment_id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, appt)}
                                        onClick={(e) => { e.stopPropagation(); openEditModal(appt); }}
                                        className="absolute left-1 right-1 rounded px-2 py-1 text-xs shadow-sm border-l-4 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all overflow-hidden select-none z-10"
                                        style={{
                                            top: `${getTop(appt.start_time)}px`,
                                            height: `${getHeight(appt.start_time, appt.end_time)}px`,
                                            backgroundColor: `${appt.color_code}E6`, // Opacité
                                            borderColor: appt.color_code,
                                            color: 'black' // Contraste
                                        }}
                                    >
                                        <div className="font-bold truncate">{format(parseISO(appt.start_time), 'HH:mm')} - {appt.client_name}</div>
                                        <div className="truncate text-[10px] opacity-80">{appt.service_title}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* MODALE (POPUP) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                
                {/* Header Modale */}
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        {editingAppt ? 'Modifier le RDV' : 'Nouveau Rendez-vous'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black transition"><X /></button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Client</label>
                            <input 
                                required type="text" placeholder="Nom"
                                className="w-full border rounded p-2"
                                value={formData.clientName}
                                onChange={e => setFormData({...formData, clientName: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Téléphone</label>
                            <input 
                                required type="text" placeholder="06..."
                                className="w-full border rounded p-2"
                                value={formData.clientPhone}
                                onChange={e => setFormData({...formData, clientPhone: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Service</label>
                            <select 
                                className="w-full border rounded p-2 bg-white"
                                value={formData.serviceId}
                                onChange={e => setFormData({...formData, serviceId: e.target.value})}
                            >
                                {services.map(s => <option key={s.id} value={s.id}>{s.title} ({s.duration}min)</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Barbier</label>
                            <select 
                                className="w-full border rounded p-2 bg-white"
                                value={formData.barberId}
                                onChange={e => setFormData({...formData, barberId: e.target.value})}
                            >
                                {barbers.map(b => <option key={b.id} value={b.id}>{b.full_name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Heure (le {format(currentDate, 'dd/MM')})</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input 
                                type="time" 
                                className="w-full border rounded p-2 pl-10"
                                value={formData.startTime}
                                onChange={e => setFormData({...formData, startTime: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center border-t mt-4">
                        {editingAppt ? (
                             <button 
                                type="button"
                                onClick={handleDelete}
                                className="text-red-500 hover:bg-red-50 px-4 py-2 rounded flex items-center gap-2 transition"
                             >
                                <Trash2 size={18} /> Supprimer
                             </button>
                        ) : <div></div>}

                        <button 
                            type="submit"
                            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-2 font-bold shadow-lg transition"
                        >
                            <Save size={18} /> Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}