import { create } from 'zustand';
import { supabase } from '../supabaseClient';
import type { User, ServiceOrder, ServiceOrderStatus } from '../types';

interface AppState {
    users: User[]; // This will now be fetched from 'profiles'
    serviceOrders: ServiceOrder[];
    isLoading: boolean;

    // Actions
    fetchServiceOrders: () => Promise<void>;
    fetchTechnicians: () => Promise<void>;

    addServiceOrder: (os: Omit<ServiceOrder, 'id' | 'createdAt' | 'status'>) => Promise<void>;
    updateServiceOrderStatus: (id: string, status: ServiceOrderStatus) => Promise<void>;
    assignServiceOrder: (osId: string, technicianId: string) => Promise<void>;
    removeServiceOrder: (id: string) => Promise<void>;

    addTechnician: () => void;
    removeTechnician: () => void;

    // UI State
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    // Legacy auth helpers (UI might still use them but actual auth is via AuthContext)
    currentUser: User | null;
    login: (email: string) => void;
    logout: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    currentUser: null,
    users: [],
    serviceOrders: [],
    isLoading: false,

    login: () => { }, // Deprecated, handled by AuthContext
    logout: () => set({ currentUser: null }), // Just clears local legacy state

    fetchServiceOrders: async () => {
        set({ isLoading: true });
        const { data, error } = await supabase
            .from('service_orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
        } else if (data) {
            // Map DB fields to Type (if necessary, snake_case to camelCase)
            // Our types match usually but let's be careful with dates
            const formatted: ServiceOrder[] = data.map(item => ({
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
            set({ serviceOrders: formatted, isLoading: false });
        } else {
            set({ isLoading: false });
        }
    },

    fetchTechnicians: async () => {
        // Fetch users who are technicians (or all profiles)
        const { data, error } = await supabase
            .from('profiles')
            .select('*');

        if (error) {
            console.error('Error fetching technicians:', error);
        } else if (data) {
            const formatted: User[] = data.map(item => ({
                id: item.id,
                name: item.name || item.full_name || item.email?.split('@')[0],
                email: item.email,
                role: item.role
            }));
            set({ users: formatted });
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
            alert('Erro ao salvar ordem');
        } else {
            get().fetchServiceOrders();
        }
    },

    removeServiceOrder: async (id) => {
        const { error } = await supabase
            .from('service_orders')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting order:', error);
            alert('Erro ao excluir ordem');
        } else {
            set(state => ({
                serviceOrders: state.serviceOrders.filter(os => os.id !== id)
            }));
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
            set(state => ({
                serviceOrders: state.serviceOrders.map(os =>
                    os.id === id ? { ...os, status } : os
                )
            }));
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
            set(state => ({
                serviceOrders: state.serviceOrders.map(os =>
                    os.id === osId ? { ...os, assignedTechnicianId: val } : os
                )
            }));
        }
    },

    addTechnician: () => {
        console.warn("Adding technicians via Store is deprecated. Use Auth Sign up.");
        alert("Para adicionar técnicos, novos usuários devem se cadastrar.");
    },
    removeTechnician: () => { console.warn("Not implemented yet for DB"); },

    theme: 'dark',
    toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
    })),
}));
