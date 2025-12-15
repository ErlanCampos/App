import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { UserPlus, Trash2, Mail, User as UserIcon, Users } from 'lucide-react';

export const Technicians = () => {
    const { users, addTechnician, removeTechnician } = useAppStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newTechName, setNewTechName] = useState('');
    const [newTechEmail, setNewTechEmail] = useState('');
    const [newTechPassword, setNewTechPassword] = useState('');

    const technicians = users.filter((u) => u.role === 'technician');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTechName && newTechEmail && newTechPassword) {
            addTechnician(newTechName, newTechEmail, newTechPassword);
            setNewTechName('');
            setNewTechEmail('');
            setNewTechPassword('');
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-between items-center pb-6 border-b border-stone-200 dark:border-stone-800">
                <div>
                    <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 tracking-tight">Técnicos</h2>
                    <p className="text-stone-500 dark:text-stone-400 mt-1">Gerencie sua equipe de campo</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center px-5 py-2.5 bg-emerald-700 dark:bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-800 dark:hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Adicionar Técnico
                </button>
            </div>

            {isAdding && (
                <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-800 animate-[slideDown_0.3s_ease-out]">
                    <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mr-3">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        Novo Técnico
                    </h3>
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2">Nome Completo</label>
                            <input
                                type="text"
                                value={newTechName}
                                onChange={(e) => setNewTechName(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all dark:text-white"
                                placeholder="Ex: João Silva"
                                required
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2">Email Corporativo</label>
                            <input
                                type="email"
                                value={newTechEmail}
                                onChange={(e) => setNewTechEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all dark:text-white"
                                placeholder="joao@techmanager.com"
                                required
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2">Senha de Acesso</label>
                            <input
                                type="password"
                                value={newTechPassword}
                                onChange={(e) => setNewTechPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all dark:text-white"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-5 py-3 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-emerald-700 dark:bg-emerald-600 text-white rounded-xl font-medium shadow-md hover:bg-emerald-800 dark:hover:bg-emerald-700 transition-all"
                            >
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {technicians.map((tech) => (
                    <div key={tech.id} className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 hover:shadow-md transition-shadow flex flex-col group">
                        <div className="flex items-center mb-6">
                            <div className="bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700 p-4 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                                <UserIcon className="w-6 h-6 text-stone-600 dark:text-stone-300" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100">{tech.name}</h3>
                                <div className="flex items-center text-stone-500 dark:text-stone-400 text-sm mt-1">
                                    <Mail className="w-4 h-4 mr-1.5" />
                                    {tech.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t border-stone-50 dark:border-stone-800 flex justify-between items-center">
                            <span className="text-xs font-medium px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900/20">
                                Ativo
                            </span>
                            <button
                                onClick={() => removeTechnician(tech.id)}
                                className="text-stone-400 hover:text-red-600 text-sm font-medium flex items-center transition-colors px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
                            >
                                <Trash2 className="w-4 h-4 mr-1.5" />
                                Remover
                            </button>
                        </div>
                    </div>
                ))}

                {technicians.length === 0 && (
                    <div className="col-span-full py-16 text-center">
                        <div className="w-16 h-16 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-stone-400 dark:text-stone-600" />
                        </div>
                        <h3 className="text-lg font-medium text-stone-900 dark:text-stone-200">Nenhum técnico encontrado</h3>
                        <p className="text-stone-500 dark:text-stone-500 mt-1">Adicione um novo técnico para começar.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
