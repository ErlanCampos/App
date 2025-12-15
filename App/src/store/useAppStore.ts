import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supabaseClient';
import type { User, ServiceOrder, ServiceOrderStatus } from '../types';

interface AppState {
    users: User[];
    serviceOrders: ServiceOrder[];
    isLoading: boolean;

    // Actions
    fetchServiceOrders: () => Promise<void>;
    fetchTechnicians: () => Promise<void>;

    addServiceOrder: (os: Omit<ServiceOrder, 'id' | 'createdAt' | 'status'>) => Promise<void>;
    updateServiceOrderStatus: (id: string, status: ServiceOrderStatus) => Promise<void>;
    assignServiceOrder: (osId: string, technicianId: string) => Promise<void>;
    removeServiceOrder: (id: string) => Promise<void>;

    addTechnician: (name: string, email: string, password?: string) => Promise<void>;
    removeTechnician: (id: string) => Promise<void>;

    // UI State
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    // Legacy auth helpers (UI might still use them but actual auth is via AuthContext)
    currentUser: User | null;
    login: (email: string) => void;
    logout: () => void; // Added back to satisfy Layout.tsx
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            users: [],
            serviceOrders: [],
            isLoading: false,
            currentUser: null,
            theme: 'light',

            login: (email: string) => { console.log('Login deprecated', email); },
            logout: () => { console.log('Logout deprecated'); }, // No-op

            fetchServiceOrders: async () => {
                set({ isLoading: true });
                const { data, error } = await supabase
                    .from('service_orders')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching orders:', error);
                    set({ isLoading: false });
                } else if (data) {
                    const mappedOrders = data.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        status: item.status,
                        date: item.date,
                        location: {
                            lat: item.location_lat,
                            lng: item.location_lng,
                            address: item.location_address
                        },
                        assignedTechnicianId: item.assigned_technician_id,
                        createdAt: item.created_at
                    }));
                    set({ serviceOrders: mappedOrders, isLoading: false });
                } else {
                    set({ isLoading: false });
                }
            },

            fetchTechnicians: async () => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('role', 'technician');

                if (error) {
                    console.error('Error fetching technicians:', error);
                } else if (data) {
                    const mappedUsers = data.map((item: any) => ({
                        id: item.id,
                        name: item.full_name || item.name || item.email,
                        email: item.email,
                        role: item.role,
                        avatar: `https://ui-avatars.com/api/?name=${item.full_name || 'User'}&background=random`
                    }));
                    set({ users: mappedUsers });
                }
            },

            addServiceOrder: async (os) => {
                const { error } = await supabase
                    .from('service_orders')
                    .insert([{
                        title: os.title,
                        description: os.description,
                        date: os.date,
                        location_lat: os.location.lat,
                        location_lng: os.location.lng,
                        location_address: os.location.address,
                        assigned_technician_id: os.assignedTechnicianId,
                        status: 'pending'
                    }]);

                if (error) {
                    console.error('Error adding order:', error);
                    alert('Erro ao criar ordem de serviço');
                } else {
                    get().fetchServiceOrders();
                }
            },

            updateServiceOrderStatus: async (id, status) => {
                const { error } = await supabase
                    .from('service_orders')
                    .update({ status })
                    .eq('id', id);

                if (error) {
                    console.error('Error updating status:', error);
                } else {
                    get().fetchServiceOrders();
                }
            },

            assignServiceOrder: async (osId, technicianId) => {
                const val = technicianId === "" ? null : technicianId;
                const { error } = await supabase
                    .from('service_orders')
                    .update({ assigned_technician_id: val })
                    .eq('id', osId);

                if (error) {
                    console.error('Error assigning technician:', error);
                } else {
                    get().fetchServiceOrders();
                }
            },

            removeServiceOrder: async (id) => {
                if (!confirm('Tem certeza que deseja excluir esta ordem de serviço?')) return;
                const { error } = await supabase
                    .from('service_orders')
                    .delete()
                    .eq('id', id);

                if (error) {
                    console.error('Error deleting order:', error);
                    alert('Erro ao excluir ordem de serviço');
                } else {
                    get().fetchServiceOrders();
                }
            },

            addTechnician: async (name, email, password) => {
                const { error } = await supabase.functions.invoke('admin-actions', {
                    body: {
                        action: 'create_user',
                        email,
                        password: password || 'TechPassword123!',
                        name
                    }
                });

                if (error) {
                    console.error('Error adding technician:', error);
                    alert('Erro ao adicionar técnico: ' + error.message);
                } else {
                    alert('Técnico adicionado com sucesso!');
                    get().fetchTechnicians();
                }
            },

            removeTechnician: async (id) => {
                if (!confirm('Tem certeza que deseja remover este técnico do sistema?')) return;

                const { error } = await supabase.functions.invoke('admin-actions', {
                    body: {
                        action: 'delete_user',
                        id
                    }
                });

                if (error) {
                    console.error('Error removing technician:', error);
                    alert('Erro ao remover técnico');
                } else {
                    get().fetchTechnicians();
                }
            },

            toggleTheme: () => set((state) => ({
                theme: state.theme === 'light' ? 'dark' : 'light'
            })),
        }),
        {
            name: 'app-storage',
            partialize: (state) => ({ theme: state.theme }), // Only persist theme locally
        }
    )
);
