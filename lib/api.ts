import { supabase } from './supabase';

const checkAvailability = async (barberId: string, startTime: string, endTime: string, excludeId?: string) => {
  let query = supabase
    .from('appointments')
    .select('id')
    .eq('barber_id', barberId)
    .neq('status', 'cancelled') // On ignore les annulés
    // Logique de chevauchement :
    .lt('start_time', endTime) // Commence avant que le nouveau finisse
    .gt('end_time', startTime); // Finit après que le nouveau commence

  // Si on modifie un RDV, on ne veut pas qu'il entre en conflit avec lui-même
  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  // Si data.length > 0, ça veut dire qu'il y a déjà un RDV
  return data.length === 0; 
};

export interface Barber {
  id: string;
  full_name: string;
  display_order: number;
  avatar_url?: string;
  is_active?: boolean;
  bio?: string;          
  instagram_link?: string;
}

export interface Service {
  id: string;
  title: string;
  duration: number;
  price: number;
  color_code: string;
}

export interface DashboardAppointment {
  client_phone: string;
  appointment_id: string;
  start_time: string;
  end_time: string;
  status: string;
  barber_id: string;
  barber_name: string;
  client_name: string;
  service_title: string;
  color_code: string;
}

export interface ClientWithHistory {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  notes: string;
  total_visits: number;
  last_visit: string;
}

export interface Stats {
  total_appointments: number;
  total_revenue: number;
  occupancy_rate: number;
  top_service: string;
}



// Récupérer les barbiers (pour l'entête du calendrier)
export const getBarbers = async () => {
  const { data, error } = await supabase
    .from('barbers')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
    
  if (error) throw error;
  return data as Barber[];
};

// Récupérer les services (pour le formulaire de réservation)
export const getServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('price', { ascending: true });

  if (error) throw error;
  return data as Service[];
};
// CRÉER UNE RÉSERVATION (Fonction principale)
export const createBooking = async (bookingData: {
  clientName: string;
  clientPhone: string;
  barberId: string;
  serviceId: string;
  startTime: string;
  duration: number;
}) => {
  console.log("1. Début createBooking", bookingData);
  
  // 1. Calculer la date de fin
  const startDate = new Date(bookingData.startTime);
  const endDate = new Date(startDate.getTime() + bookingData.duration * 60000);
  const endTimeIso = endDate.toISOString();

  // 2. VÉRIFICATION ANTI-DOUBLON (Ajouté)
  const isAvailable = await checkAvailability(
    bookingData.barberId, 
    bookingData.startTime, 
    endTimeIso
  );

  if (!isAvailable) {
     console.error("ERREUR: Créneau pris");
    throw new Error("CE CRÉNEAU EST DÉJÀ PRIS ! Veuillez choisir une autre heure ou un autre barbier.");
  }

  // 3. Gérer le Client (Code existant...)
  console.log("2. Tentative création client...");
  const { data: customer, error: custError } = await supabase
    .from('customers')
    .upsert(
      { full_name: bookingData.clientName, phone: bookingData.clientPhone },
      { onConflict: 'phone' }
    )
    .select()
    .single();

  if (custError) {
    console.error("ERREUR CLIENT:", custError); // <--- REGARDE ICI DANS LA CONSOLE
    throw custError;
  }
  console.log("3. Client créé/trouvé:", customer);

  // 4. Insérer le Rendez-vous (Code existant...)
   console.log("4. Tentative création RDV...");
  const { error: apptError } = await supabase
    .from('appointments')
    .insert({
      customer_id: customer.id,
      barber_id: bookingData.barberId,
      service_id: bookingData.serviceId,
      start_time: bookingData.startTime,
      end_time: endTimeIso,
      status: 'confirmed'
    });

  if (apptError) {
    console.error("ERREUR RDV:", apptError); // <--- OU ICI
    throw apptError;
  }
  console.log("5. Succès !");
  
  // Notif interne...
  await supabase.from('internal_notifications').insert({
      message: `Nouveau RDV : ${bookingData.clientName}`
  });

  return { success: true };
};

//  Récupérer les notifications non lues (Pour la cloche)
export const getNotifications = async () => {
  const { data } = await supabase
    .from('internal_notifications')
    .select('*')
    .eq('is_read', false)
    .order('created_at', { ascending: false });
    
  return data || [];
};

export const getClients = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select(`
      *,
      appointments (count, start_time)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // On transforme les données pour l'affichage
  return data.map((c: any) => ({
    id: c.id,
    full_name: c.full_name,
    phone: c.phone,
    email: c.email,
    notes: c.notes,
    total_visits: c.appointments.length,
    last_visit: c.appointments.length > 0 
      ? c.appointments.sort((a:any, b:any) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())[0].start_time 
      : null
  }));
};

// 2. Récupérer les Statistiques (Basiques)
export const getStats = async () => {
  const today = new Date().toISOString().split('T')[0];
  const startOfMonth = `${today.substring(0, 7)}-01`;

  // 1. RÉCUPÉRATION DES DONNÉES (D'ABORD !)
  const { data: monthlyRDV } = await supabase
    .from('appointments')
    .select('service_id, services(price, title)')
    .gte('start_time', startOfMonth)
    .eq('status', 'confirmed');

  // 2. CALCUL DU REVENU ET TOP SERVICE
  let totalRevenue = 0;
  let serviceCounts: Record<string, number> = {};

  monthlyRDV?.forEach((rdv: any) => {
    if (rdv.services) {
      totalRevenue += rdv.services.price;
      const title = rdv.services.title;
      serviceCounts[title] = (serviceCounts[title] || 0) + 1;
    }
  });

  const topService = Object.keys(serviceCounts).reduce((a, b) => serviceCounts[a] > serviceCounts[b] ? a : b, 'Aucun');

  // 3. CALCUL DU REMPLISSAGE (MAINTENANT QUE monthlyRDV EXISTE)
  const dayOfMonth = new Date().getDate(); // Jour du mois (ex: 20)
  const capacityPerDay = 30; // Estimation : 30 créneaux dispo par jour
  const totalCapacitySoFar = dayOfMonth * capacityPerDay;

  const occupancy = totalCapacitySoFar > 0 
    ? Math.round((monthlyRDV?.length || 0) / totalCapacitySoFar * 100) 
    : 0;

  // 4. RETOUR DES RÉSULTATS
  return {
    total_appointments: monthlyRDV?.length || 0,
    total_revenue: totalRevenue,
    occupancy_rate: occupancy,
    top_service: topService
  };
};

// 3. Supprimer un service (Pour les réglages)
export const deleteService = async (id: string) => {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
};

// 4. Toggle Barbier actif/inactif
export const toggleBarberStatus = async (id: string, isActive: boolean) => {
  const { error } = await supabase.from('barbers').update({ is_active: isActive }).eq('id', id);
  if (error) throw error;
};

export const addBarber = async (barber: { full_name: string; display_order: number; bio?: string; instagram_link?: string; avatar_url?: string }) => {
  const { error } = await supabase.from('barbers').insert([{
    full_name: barber.full_name,
    display_order: barber.display_order,
    bio: barber.bio,                     // <--- NOUVEAU
    instagram_link: barber.instagram_link, // <--- NOUVEAU
    avatar_url: barber.avatar_url,       // <--- NOUVEAU
    is_active: true
  }]);
  if (error) throw error;
};
// 6. Ajouter un nouveau Service

export const addService = async (service: { title: string; duration: number; price: number; color_code: string }) => {
  const { error } = await supabase.from('services').insert([service]);
  if (error) throw error;
};
export const getDashboardData = async (dateStr: string) => {
  const targetDate = new Date(dateStr);

  // Chercher DEPUIS la veille
  const startDate = new Date(targetDate);
  startDate.setDate(startDate.getDate() - 1); 
  
  // JUSQU'AU lendemain
  const endDate = new Date(targetDate);
  endDate.setDate(endDate.getDate() + 1); 

  const { data, error } = await supabase
    .from('dashboard_view')
    .select('*')
    .gte('start_time', startDate.toISOString())
    .lte('start_time', endDate.toISOString());

  if (error) throw error;

  return data.filter((appt: any) => {
    const apptTime = new Date(appt.start_time);
    // On compare les dates locales
    return apptTime.getDate() === targetDate.getDate() && 
           apptTime.getMonth() === targetDate.getMonth() &&
           apptTime.getFullYear() === targetDate.getFullYear();
  }) as DashboardAppointment[];
};
export const getAppointmentsList = async (startDate: string, endDate: string) => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      id,
      start_time,
      status,
      customers ( full_name, phone ),
      barbers ( full_name ),
      services ( title, price )
    `)
    .gte('start_time', startDate)
    .lte('start_time', endDate)
    .order('start_time', { ascending: false });

  if (error) throw error;
  return data;
};

export const getSalonSettings = async () => {
  const { data, error } = await supabase
    .from('salon_settings')
    .select('*')
    .eq('id', 1)
    .single();
  
  if (error) return { start_hour: 9, end_hour: 20 }; // Fallback
  return data;
};

// 9. Mettre à jour les heures
export const updateSalonSettings = async (start: number, end: number) => {
  const { error } = await supabase
    .from('salon_settings')
    .update({ start_hour: start, end_hour: end })
    .eq('id', 1);
  if (error) throw error;
};

// --- DRAG AND DROP ---

// 10. Déplacer un RDV (Update Time & Barber)
export const moveAppointment = async (id: string, newStart: string, newEnd: string, newBarberId: string) => {
  
  // 1. VÉRIFICATION ANTI-DOUBLON (En excluant le RDV qu'on est en train de bouger)
  const isAvailable = await checkAvailability(newBarberId, newStart, newEnd, id);

  if (!isAvailable) {
    throw new Error("Impossible de déplacer ici : le barbier est occupé !");
  }

  // 2. Mise à jour
  const { error } = await supabase
    .from('appointments')
    .update({ 
      start_time: newStart,
      end_time: newEnd,
      barber_id: newBarberId
    })
    .eq('id', id);

  if (error) throw error;
};

export const updateAppointmentDetails = async (id: string, updates: any) => {
  
  // Si on change l'heure ou le barbier, on doit vérifier les conflits
  if (updates.start_time && updates.end_time && updates.barber_id) {
      const isAvailable = await checkAvailability(
          updates.barber_id, 
          updates.start_time, 
          updates.end_time, 
          id
      );

      if (!isAvailable) {
        throw new Error("Conflit ! Ce créneau est déjà réservé.");
      }
  }

  const { error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
};

// 12. Supprimer/Annuler un RDV
export const deleteAppointment = async (id: string) => {
  const { error } = await supabase
    .from('appointments')
    .delete() 
    .eq('id', id);
  if (error) throw error;
};


export async function updateBarber(id: string, updates: Partial<Barber>) {
  const { data, error } = await supabase
    .from('barbers')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
}

export async function uploadBarberPhoto(file: File) {
  // 1. On crée un nom unique pour éviter d'écraser une autre image (timestamp + nom)
  const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;

  // 2. Upload vers le bucket "images"
  const { data, error } = await supabase
    .storage
    .from('images') // Assure-toi que ton bucket s'appelle bien "images"
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error("Erreur upload Supabase:", error);
    throw error;
  }

  // 3. On récupère l'URL publique
  const { data: publicUrlData } = supabase
    .storage
    .from('images')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
