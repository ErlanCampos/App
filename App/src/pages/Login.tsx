import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Wrench } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const login = useAppStore(state => state.login);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        login(email);
        const user = useAppStore.getState().currentUser;
        if (user) {
            navigate('/dashboard');
        } else {
            setError('Usuário não encontrado. Tente admin@tech.com ou john@tech.com');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-950 relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-stone-800/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-emerald-800/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            <div className="bg-stone-900/50 backdrop-blur-lg border border-stone-800 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 animate-[fadeIn_0.5s_ease-out]">
                <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-br from-emerald-700 to-stone-700 p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <Wrench className="w-10 h-10 text-white" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">Bem-vindo de volta</h2>
                <p className="text-stone-400 text-center mb-8">Faça login para gerenciar suas operações</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-stone-300 mb-1">Endereço de Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-stone-950/50 border border-stone-800 rounded-xl text-white placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all duration-200"
                            placeholder="admin@tech.com"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm text-center animate-[shake_0.5s_ease-in-out]">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-900 focus:ring-emerald-500 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-stone-800">
                    <p className="text-xs text-stone-500 text-center uppercase tracking-wider mb-3">Acesso Demo</p>
                    <div className="flex justify-center gap-4 text-sm text-stone-400">
                        <button onClick={() => setEmail('admin@tech.com')} className="hover:text-emerald-400 hover:underline transition-colors">Admin</button>
                        <span>•</span>
                        <button onClick={() => setEmail('john@tech.com')} className="hover:text-emerald-400 hover:underline transition-colors">Técnico</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
