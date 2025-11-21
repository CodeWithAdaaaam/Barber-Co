"use client";
import { useEffect, useState } from 'react';
import { getStats, Stats } from '@/lib/api';
import { TrendingUp, Users, Scissors, DollarSign, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  if (!stats) return <div className="p-10">Chargement des analyses...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Tableau de Bord - Ce Mois</h2>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">Revenu Estimé</h3>
                <div className="p-2 bg-green-50 rounded-lg"><DollarSign size={20} className="text-green-600"/></div>
            </div>
            <p className="text-3xl font-bold">{stats.total_revenue} DHS</p>
            <span className="text-xs text-green-600 flex items-center gap-1 mt-2"><TrendingUp size={12}/> +12% vs mois dernier</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">Rendez-vous</h3>
                <div className="p-2 bg-blue-50 rounded-lg"><Calendar size={20} className="text-blue-600"/></div>
            </div>
            <p className="text-3xl font-bold">{stats.total_appointments}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">Top Service</h3>
                <div className="p-2 bg-purple-50 rounded-lg"><Scissors size={20} className="text-purple-600"/></div>
            </div>
            <p className="text-xl font-bold truncate">{stats.top_service}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">Remplissage</h3>
                <div className="p-2 bg-orange-50 rounded-lg"><Users size={20} className="text-orange-600"/></div>
            </div>
            <p className="text-3xl font-bold">{stats.occupancy_rate}%</p>
        </div>
      </div>

      {/* SECTION GRAPHIQUE (Placeholder) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-400">
        Graphique d'évolution du chiffre d'affaires (Intégration future avec Recharts)
      </div>
    </div>
  );
}