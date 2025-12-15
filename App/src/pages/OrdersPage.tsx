import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Calendar as CalendarIcon, MapPin, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import type { ServiceOrderStatus } from '../types';

export const Orders = () => {
    const { serviceOrders, users, addServiceOrder, assignServiceOrder, removeServiceOrder } = useAppStore();
    const { session } = useAuth();
    const [isCreating, setIsCreating] = useState(false);

    // Fallback for dev, but effectively checking email for auth.
    const isAdmin = session?.user?.email?.includes('admin') || session?.user?.email === 'suporte@maprinter.com.br' || false;

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [date, setDate] = useState('');
    const [assignedTech, setAssignedTech] = useState('');

    const technicians = users.filter(u => u.role === 'technician');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        addServiceOrder({
            title,
            description,
            location: {
                address,
                lat: -23.5505, // Mock coords for now
                lng: -46.6333
            },
            date: new Date(date).toISOString(),
            assignedTechnicianId: assignedTech || null,
        });
        setIsCreating(false);
        resetForm();
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setAddress('');
        setDate('');
        setAssignedTech('');
    };

    const getStatusColor = (status: ServiceOrderStatus) => {
        switch (status) {
            case 'completed': return 'text-emerald-700 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
            case 'in-progress': return 'text-blue-700 bg-blue-50 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
            case 'cancelled': return 'text-red-700 bg-red-50 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
            default: return 'text-amber-700 bg-amber-50 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
        }
    };

    const getStatusText = (status: ServiceOrderStatus) => {
        switch (status) {
            case 'completed': return 'Concluído';
            case 'in-progress': return 'Em Andamento';
            case 'cancelled': return 'Cancelado';
            default: return 'Pendente';
        }
    };

    return (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-between items-center pb-6 border-b border-stone-200 dark:border-stone-800">
                <div>
                    <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 tracking-tight">Ordens de Serviço</h2>
                    <p className="text-stone-500 dark:text-stone-400 mt-1">Gerencie as demandas de serviço</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center px-5 py-2.5 bg-emerald-700 dark:bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-800 dark:hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Nova Ordem
                </button>
            </div>

            {isCreating && (
                <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-800 animate-[slideDown_0.3s_ease-out]">
                    <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mr-3">
                            <PlusCircle className="w-5 h-5" />
                        </div>
                        Criar Nova Ordem de Serviço
                    </h3>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2">Título do Serviço</label>
                            <input
                                required
                                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all dark:text-white"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Ex: Manutenção de Impressora"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2">Descrição Detalhada</label>
                            <textarea
                                required
                                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all dark:text-white"
                                rows={3}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Descreva os detalhes da tarefa..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2">Data e Hora</label>
                            <input
                                required
                                type="datetime-local"
                                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all dark:text-white dark:[color-scheme:dark]"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2">Endereço</label>
                            <input
                                required
                                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all dark:text-white"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder="Rua Exemplo, 123"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2">Atribuir Técnico</label>
                            <select
                                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all dark:text-white"
                                value={assignedTech}
                                onChange={e => setAssignedTech(e.target.value)}
                            >
                                <option value="">-- Não Atribuído --</option>
                                {technicians.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-5 py-3 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-emerald-700 dark:bg-emerald-600 text-white rounded-xl font-medium shadow-md hover:bg-emerald-800 dark:hover:bg-emerald-700 transition-all"
                            >
                                Criar Ordem
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List of Orders */}
            <div className="grid gap-4">
                {serviceOrders.map(os => {
                    return (
                        <div key={os.id} className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 justify-between items-start md:items-center group">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={clsx("px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border", getStatusColor(os.status))}>
                                        {getStatusText(os.status)}
                                    </span>
                                    <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{os.title}</h3>
                                </div>
                                <p className="text-stone-600 dark:text-stone-400 text-sm mb-3 leading-relaxed">{os.description}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-stone-500 dark:text-stone-500">
                                    <span className="flex items-center bg-stone-50 dark:bg-stone-950/50 px-2 py-1 rounded-md border border-stone-100 dark:border-stone-800"><CalendarIcon className="w-4 h-4 mr-2 text-stone-400 dark:text-stone-600" /> {format(new Date(os.date), "dd/MM/yyyy 'às' HH:mm")}</span>
                                    <span className="flex items-center bg-stone-50 dark:bg-stone-950/50 px-2 py-1 rounded-md border border-stone-100 dark:border-stone-800"><MapPin className="w-4 h-4 mr-2 text-stone-400 dark:text-stone-600" /> {os.location.address}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 min-w-[200px] w-full md:w-auto border-t md:border-t-0 border-stone-100 dark:border-stone-800 pt-4 md:pt-0">
                                <div className="flex flex-col md:items-end w-full">
                                    <span className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1">Técnico Responsável</span>
                                    <div className="flex items-center gap-2">
                                        <select
                                            className="w-full md:w-auto bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-lg px-3 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                                            value={os.assignedTechnicianId || ""}
                                            onChange={(e) => assignServiceOrder(os.id, e.target.value)}
                                        >
                                            <option value="">-- Não Atribuído --</option>
                                            {technicians.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>

                                        {isAdmin && (
                                            <button
                                                onClick={() => {
                                                    if (confirm('Tem certeza que deseja excluir esta ordem?')) {
                                                        removeServiceOrder(os.id);
                                                    }
                                                }}
                                                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Excluir Ordem"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {serviceOrders.length === 0 && (
                    <div className="text-center py-16 bg-stone-50 dark:bg-stone-950/20 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800">
                        <div className="mx-auto w-12 h-12 bg-white dark:bg-stone-900 rounded-full flex items-center justify-center shadow-sm mb-4">
                            <PlusCircle className="w-6 h-6 text-stone-400 dark:text-stone-600" />
                        </div>
                        <h3 className="text-lg font-medium text-stone-900 dark:text-stone-200">Nenhuma ordem de serviço</h3>
                        <p className="text-stone-500 dark:text-stone-500">Crie uma nova ordem para começar o trabalho.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
