"use client";

import { useState, useEffect } from 'react';
import { getAppointmentsList } from '@/lib/api';
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, addDays, addMonths, addYears } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';

export default function AppointmentsListPage() {
  // --- ETATS ---
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtres
  const [filterType, setFilterType] = useState<'day' | 'month' | 'year'>('day');
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- CHARGEMENT DES DONNEES ---
  const loadData = async () => {
    setLoading(true);
    let start, end;

    if (filterType === 'day') {
      start = startOfDay(currentDate).toISOString();
      end = endOfDay(currentDate).toISOString();
    } else if (filterType === 'month') {
      start = startOfMonth(currentDate).toISOString();
      end = endOfMonth(currentDate).toISOString();
    } else {
      start = startOfYear(currentDate).toISOString();
      end = endOfYear(currentDate).toISOString();
    }

    const data = await getAppointmentsList(start, end);
    setAppointments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [currentDate, filterType]);

  // --- NAVIGATION ---
  const handlePrev = () => {
    if (filterType === 'day') setCurrentDate(addDays(currentDate, -1));
    if (filterType === 'month') setCurrentDate(addMonths(currentDate, -1));
    if (filterType === 'year') setCurrentDate(addYears(currentDate, -1));
  };

  const handleNext = () => {
    if (filterType === 'day') setCurrentDate(addDays(currentDate, 1));
    if (filterType === 'month') setCurrentDate(addMonths(currentDate, 1));
    if (filterType === 'year') setCurrentDate(addYears(currentDate, 1));
  };

  const getPeriodTitle = () => {
    if (filterType === 'day') return format(currentDate, 'dd MMMM yyyy', { locale: fr });
    if (filterType === 'month') return format(currentDate, 'MMMM yyyy', { locale: fr });
    return format(currentDate, 'yyyy', { locale: fr });
  };

  const totalRevenue = appointments.reduce((sum, rdv) => sum + (rdv.services?.price || 0), 0);

  return (
    <div className="p-4 md:p-8 h-screen flex flex-col">
      
      {/* EN-TÊTE ET FILTRES */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Calendar className="text-gold" /> Historique des RDV
        </h2>

        <div className="flex items-center bg-white rounded-lg shadow-sm border p-1 w-full md:w-auto">
           <button onClick={() => setFilterType('day')} className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition ${filterType === 'day' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Jour</button>
           <button onClick={() => setFilterType('month')} className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition ${filterType === 'month' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Mois</button>
           <button onClick={() => setFilterType('year')} className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition ${filterType === 'year' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Année</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <button onClick={handlePrev} className="p-2 hover:bg-gray-100 rounded-full border md:border-none"><ArrowLeft size={20}/></button>
            <span className="text-lg md:text-xl font-bold capitalize min-w-[150px] text-center">{getPeriodTitle()}</span>
            <button onClick={handleNext} className="p-2 hover:bg-gray-100 rounded-full border md:border-none"><ArrowRight size={20}/></button>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-lg justify-between md:justify-end border md:border-none">
            <div className="text-left md:text-right">
                <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide">Chiffre d'affaires</p>
                <p className="text-xl md:text-2xl font-bold text-green-600 whitespace-nowrap">{totalRevenue} DHS</p>
            </div>
            <div className="text-right border-l pl-4 md:pl-6 border-gray-300">
                <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide">Total RDV</p>
                <p className="text-xl md:text-2xl font-bold">{appointments.length}</p>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[600px]"> 
                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="p-4 font-medium text-gray-500 text-sm uppercase">Date & Heure</th>
                        <th className="p-4 font-medium text-gray-500 text-sm uppercase">Client</th>
                        <th className="p-4 font-medium text-gray-500 text-sm uppercase">Prestation</th>
                        <th className="p-4 font-medium text-gray-500 text-sm uppercase">Coiffeur</th>
                        <th className="p-4 font-medium text-gray-500 text-sm uppercase">Prix</th>
                        <th className="p-4 font-medium text-gray-500 text-sm uppercase">Statut</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {loading ? (
                        <tr><td colSpan={6} className="p-10 text-center">Chargement...</td></tr>
                    ) : appointments.length === 0 ? (
                        <tr><td colSpan={6} className="p-10 text-center text-gray-400">Aucun rendez-vous sur cette période.</td></tr>
                    ) : (
                        appointments.map((rdv) => (
                            <tr key={rdv.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 whitespace-nowrap">
                                    <div className="font-bold">{format(new Date(rdv.start_time), 'dd/MM/yyyy')}</div>
                                    <div className="text-sm text-gray-500">{format(new Date(rdv.start_time), 'HH:mm')}</div>
                                </td>
                                <td className="p-4">
                                    <div className="font-medium">{rdv.customers?.full_name || 'Inconnu'}</div>
                                    <div className="text-xs text-gray-400 whitespace-nowrap">{rdv.customers?.phone}</div>
                                </td>
                                <td className="p-4">
                                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs md:text-sm whitespace-nowrap">
                                        {rdv.services?.title || 'Supprimé'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold hidden md:flex">
                                            {rdv.barbers?.full_name?.charAt(0) || '?'}
                                        </div>
                                        <span className="text-sm whitespace-nowrap">{rdv.barbers?.full_name}</span>
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-gray-700 whitespace-nowrap">
                                    {rdv.services?.price} DHS
                                </td>
                                <td className="p-4">
                                    {rdv.status === 'confirmed' && <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-100">Confirmé</span>}
                                    {rdv.status === 'cancelled' && <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold border border-red-100">Annulé</span>}
                                    {rdv.status === 'completed' && <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-bold border border-blue-100">Terminé</span>}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}