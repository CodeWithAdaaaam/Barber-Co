"use client";

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, List, Settings, LogOut, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Fonction pour fermer le menu quand on clique sur un lien (sur mobile)
  const closeSidebar = () => setIsSidebarOpen(false);

  // Helper pour savoir si un lien est actif
  const isActive = (path: string) => pathname === path;
  const linkClass = (path: string) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
    ${isActive(path) ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}
  `;

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-slate-800 overflow-hidden">
      
      {/* --- 1. MOBILE HEADER (Visible uniquement sur mobile) --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center justify-between px-4 z-30 shadow-sm">
        <span className="font-black tracking-tighter text-lg">BARBER CO. <span className="text-yellow-500">.</span></span>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2">
            <Menu size={24} />
        </button>
      </div>

      {/* --- 2. OVERLAY (Fond noir transparent sur mobile quand menu ouvert) --- */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeSidebar}
        ></div>
      )}

      {/* --- 3. SIDEBAR (Responsive) --- */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col shadow-lg md:shadow-none transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Header Sidebar */}
        <div className="h-16 flex items-center justify-center border-b relative">
          <h1 className="text-xl font-black tracking-tighter">BARBER CO. <span className="text-yellow-500">.</span></h1>
          {/* Bouton Fermer (Mobile seulement) */}
          <button onClick={closeSidebar} className="absolute right-4 md:hidden text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin" onClick={closeSidebar} className={linkClass('/admin')}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Tableau de Bord</span>
          </Link>
          
          <Link href="/admin/calendar" onClick={closeSidebar} className={linkClass('/admin/calendar')}>
            <Calendar size={20} />
            <span className="font-medium">Calendrier</span>
          </Link>

          <Link href="/admin/appointments" onClick={closeSidebar} className={linkClass('/admin/appointments')}>
            <List size={20} />
            <span className="font-medium">Historique & Liste</span>
          </Link>

          <Link href="/admin/settings" onClick={closeSidebar} className={linkClass('/admin/settings')}>
            <Settings size={20} />
            <span className="font-medium">Configuration</span>
          </Link>
        </nav>

        <div className="p-4 border-t">
            <button className="flex items-center gap-3 px-4 py-3 text-red-500 w-full hover:bg-red-50 rounded-lg transition-colors">
                <LogOut size={20} />
                <span>Déconnexion</span>
            </button>
        </div>
      </aside>

      {/* --- 4. CONTENU PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 bg-gray-50">
        {children}
      </main>
    </div>
  );
}