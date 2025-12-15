
import { useEffect, useMemo, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, Map as MapIcon, LogOut, Users, ClipboardList, Moon, Sun, Key } from 'lucide-react';
import { supabase } from '../supabaseClient';
import clsx from 'clsx';

export const Layout = () => {
    const { logout: storeLogout, theme, toggleTheme, fetchServiceOrders, fetchTechnicians } = useAppStore();
    const { session, signOut } = useAuth();
    const navigate = useNavigate();

    // Modal State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Derive user from Supabase session
    const currentUser = useMemo(() => {
        if (!session?.user) return null;
        // Mock role check for demo purposes
        const isAdmin = session.user.email?.includes('admin') || session.user.email === 'suporte@maprinter.com.br';
        return {
            name: session.user.email?.split('@')[0] || 'User',
            email: session.user.email,
            role: isAdmin ? 'admin' : 'technician'
        };
    }, [session]);

    useEffect(() => {
        if (!session) {
            navigate('/login');
        } else {
            // Load data when authenticated
            fetchServiceOrders();
            fetchTechnicians();
        }
    }, [session, navigate, fetchServiceOrders, fetchTechnicians]);

    // Apply theme to html element
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    if (!currentUser) {
        return null;
    }

    const handleLogout = async () => {
        await signOut();
        storeLogout();
        navigate('/login');
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError('As senhas não coincidem');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });

            if (error) {
                setPasswordError(error.message);
            } else {
                setPasswordSuccess('Senha alterada com sucesso!');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => {
                    setIsPasswordModalOpen(false);
                    setPasswordSuccess('');
                }, 2000);
            }
        } catch (err: any) {
            setPasswordError(err.message || 'Erro ao alterar senha');
        }
    };

    const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                clsx(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden",
                    isActive
                        ? "bg-emerald-900/10 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 shadow-sm"
                        : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-emerald-900 dark:hover:text-emerald-400"
                )
            }
        >
            {({ isActive }) => (
                <>
                    <div className={clsx(
                        "absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-300",
                        isActive ? "bg-emerald-800 dark:bg-emerald-500" : "bg-transparent group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900"
                    )} />
                    <Icon className={clsx("w-5 h-5 mr-3 transition-colors", isActive ? "text-emerald-800 dark:text-emerald-500" : "text-stone-400 dark:text-stone-500 group-hover:text-emerald-700 dark:group-hover:text-emerald-400")} />
                    <span className="relative z-10">{label}</span>
                </>
            )}
        </NavLink>
    );

    return (
        <div className="flex h-screen bg-stone-50 dark:bg-stone-950 font-sans transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-72 bg-white dark:bg-stone-900 flex flex-col border-r border-stone-200 dark:border-stone-800 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.05)] z-20 transition-colors duration-300">
                <div className="p-8 border-b border-stone-100 dark:border-stone-800">
                    <h1 className="text-2xl font-bold text-emerald-950 dark:text-emerald-500 flex items-center tracking-tight">
                        <div className="p-2 bg-gradient-to-br from-emerald-800 to-stone-800 dark:from-emerald-600 dark:to-stone-900 rounded-lg mr-3 shadow-lg">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        TechManager
                    </h1>
                    <div className="mt-6 flex items-center p-3 bg-stone-50 dark:bg-stone-950/50 rounded-xl border border-stone-100 dark:border-stone-800">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-800 dark:text-emerald-400 font-bold text-lg border-2 border-white dark:border-stone-700 shadow-sm">
                            {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">{currentUser.name}</p>
                            <p className="text-xs text-stone-500 dark:text-stone-500 uppercase tracking-wider font-medium">
                                {currentUser.role === 'admin' ? 'Administrador' : 'Técnico'}
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-6 py-6 space-y-2 overflow-y-auto">
                    {currentUser.role === 'admin' ? (
                        <>
                            <div className="px-4 py-2 text-xs font-bold text-stone-400 dark:text-stone-600 uppercase tracking-widest">Gerenciamento</div>
                            <NavItem to="/dashboard" icon={Users} label="Técnicos" />
                            <NavItem to="/orders" icon={ClipboardList} label="Ordens de Serviço" />
                        </>
                    ) : (
                        <>
                            <div className="px-4 py-2 text-xs font-bold text-stone-400 dark:text-stone-600 uppercase tracking-widest">Minha Área</div>
                            <NavItem to="/my-tasks" icon={ClipboardList} label="Minhas Tarefas" />
                        </>
                    )}

                    <div className="px-4 py-2 mt-6 text-xs font-bold text-stone-400 dark:text-stone-600 uppercase tracking-widest">Ferramentas</div>
                    <NavItem to="/calendar" icon={Calendar} label="Calendário" />
                    <NavItem to="/map" icon={MapIcon} label="Mapa" />
                </nav>

                <div className="p-6 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900 space-y-3">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-emerald-800 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-xl transition-all duration-200 group"
                    >
                        {theme === 'light' ? (
                            <>
                                <Moon className="w-5 h-5 mr-3 text-stone-400 dark:text-stone-500 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors" />
                                Modo Escuro
                            </>
                        ) : (
                            <>
                                <Sun className="w-5 h-5 mr-3 text-stone-400 dark:text-stone-500 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors" />
                                Modo Claro
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-emerald-800 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-xl transition-all duration-200 group"
                    >
                        <Key className="w-5 h-5 mr-3 text-stone-400 dark:text-stone-500 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors" />
                        Alterar Senha
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all duration-200 group"
                    >
                        <LogOut className="w-5 h-5 mr-3 text-stone-400 dark:text-stone-500 group-hover:text-red-500 transition-colors" />
                        Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8 relative">
                {/* Background Pattern */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.05] dark:invert"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 transition-colors duration-300">
                    <Outlet />
                </div>
            </main>

            {/* Password Change Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl w-full max-w-md p-6 border border-stone-200 dark:border-stone-800 animate-[fadeIn_0.3s_ease-out]">
                        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">Alterar Senha</h2>

                        {passwordError && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                                {passwordError}
                            </div>
                        )}

                        {passwordSuccess && (
                            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-lg">
                                {passwordSuccess}
                            </div>
                        )}

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Nova Senha</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Confirmar Nova Senha</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsPasswordModalOpen(false);
                                        setPasswordError('');
                                        setPasswordSuccess('');
                                        setNewPassword('');
                                        setConfirmPassword('');
                                    }}
                                    className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-colors shadow-sm"
                                >
                                    Alterar Senha
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
