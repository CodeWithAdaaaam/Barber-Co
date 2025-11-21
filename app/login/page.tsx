"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; 
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  
  // --- ETATS ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- VERIFICATION INITIALE ---
  // Si on est déjà connecté, on va direct à l'admin (pas besoin de se reconnecter)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/admin');
      }
    };
    checkSession();
  }, [router]);

  // --- ACTION DE CONNEXION ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Succès -> Redirection vers l'admin
      // On utilise refresh pour être sûr que le middleware/layout re-vérifie les cookies
      router.refresh(); 
      router.push('/admin');
      
    } catch (err: any) {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        
        <div className="text-center mb-8">
           <h1 className="text-3xl font-bold text-white mb-2 tracking-tighter">BARBER PRO <span className="text-[#D4AF37]">.</span></h1>
           <p className="text-gray-400 text-sm">Connexion Administration</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Email</label>
            <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-zinc-700 text-white rounded-lg py-3 pl-10 focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="admin@barberco.com"
                  required
                />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Mot de passe</label>
            <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-zinc-700 text-white rounded-lg py-3 pl-10 focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se Connecter'}
          </button>

        </form>
      </div>
    </div>
  );
}