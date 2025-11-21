"use client";
import { useEffect, useState } from 'react';
import { getClients } from '@/lib/api';
import { Search, Phone, Mail, Calendar } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getClients().then(setClients);
  }, []);

  const filteredClients = clients.filter(c => 
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Base Clients</h2>
        <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Rechercher nom, tel..." 
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
                <tr>
                    <th className="p-4 font-medium text-gray-500">Client</th>
                    <th className="p-4 font-medium text-gray-500">Coordonnées</th>
                    <th className="p-4 font-medium text-gray-500">Visites</th>
                    <th className="p-4 font-medium text-gray-500">Dernière visite</th>
                    <th className="p-4 font-medium text-gray-500">Notes</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                        <td className="p-4 font-bold">{client.full_name}</td>
                        <td className="p-4">
                            <div className="flex flex-col text-sm text-gray-600">
                                <span className="flex items-center gap-1"><Phone size={12}/> {client.phone}</span>
                                {client.email && <span className="flex items-center gap-1"><Mail size={12}/> {client.email}</span>}
                            </div>
                        </td>
                        <td className="p-4">
                            <span className="bg-gray-100 px-2 py-1 rounded text-sm font-bold">{client.total_visits}</span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                            {client.last_visit ? new Date(client.last_visit).toLocaleDateString('fr-FR') : '-'}
                        </td>
                        <td className="p-4 text-sm text-gray-400 italic">
                            {client.notes || "Aucune note"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}