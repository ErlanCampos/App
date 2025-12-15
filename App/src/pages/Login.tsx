import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Loader2, AlertCircle } from 'lucide-react';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { session } = useAuth();

    // Redirect if already logged in
    React.useEffect(() => {
        if (session) {
            navigate('/');
        }
    }, [session, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            navigate('/');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
            <div className="max-w-[400px] w-full bg-[#121214] rounded-2xl p-8 border border-[#27272a] shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-emerald-700/30 rounded-xl flex items-center justify-center mb-6 group border border-emerald-900/50">
                        <Wrench className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 text-center">Bem-vindo de volta</h2>
                    <p className="text-zinc-400 text-sm text-center">Faça login para gerenciar suas operações</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-zinc-300 ml-1">
                            Endereço de Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block w-full px-4 py-3 bg-[#09090b] border border-[#27272a] rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                            placeholder="admin@tech.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-zinc-300 ml-1">
                            Senha
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full px-4 py-3 bg-[#09090b] border border-[#27272a] rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-xs">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121214] focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-[#27272a]">
                    <p className="text-center text-[10px] uppercase tracking-wider text-zinc-500 font-medium mb-3">
                        Acesso Demo
                    </p>
                    <div className="flex justify-center gap-4 text-sm text-zinc-400">
                        <span className="cursor-pointer hover:text-emerald-400 transition-colors">Admin</span>
                        <span className="text-zinc-700">•</span>
                        <span className="cursor-pointer hover:text-emerald-400 transition-colors">Técnico</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
