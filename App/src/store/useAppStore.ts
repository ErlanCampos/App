import { create } from 'zustand';
import type { User, ServiceOrder, ServiceOrderStatus } from '../types';

interface AppState {
    currentUser: User | null;
    users: User[];
    serviceOrders: ServiceOrder[];

    login: (email: string) => void;
    logout: () => void;

    addTechnician: (name: string, email: string) => void;
    removeTechnician: (id: string) => void;

    addServiceOrder: (os: Omit<ServiceOrder, 'id' | 'createdAt' | 'status'>) => void;
    updateServiceOrderStatus: (id: string, status: ServiceOrderStatus) => void;
    assignServiceOrder: (osId: string, technicianId: string) => void;

    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

// Mock Data
const MOCK_USERS: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@tech.com', role: 'admin' },
    { id: '2', name: 'John Tech', email: 'john@tech.com', role: 'technician' },
    { id: '3', name: 'Jane Tech', email: 'jane@tech.com', role: 'technician' },
];

const MOCK_OS: ServiceOrder[] = [
    {
        id: 'os-1',
        title: 'Repair AC Unit',
        description: 'AC unit not cooling in server room.',
        date: new Date().toISOString(),
        location: { lat: -23.5505, lng: -46.6333, address: 'Av. Paulista, 1000' },
        status: 'pending',
        assignedTechnicianId: null,
        createdAt: new Date().toISOString(),
    },
    {
        id: 'os-2',
        title: 'Install Router',
        description: 'New office setup requires high-end router.',
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        location: { lat: -23.5615, lng: -46.6550, address: 'Rua Augusta, 500' },
        status: 'pending',
        assignedTechnicianId: '2', // Assigned to John
        createdAt: new Date().toISOString(),
    }
];

export const useAppStore = create<AppState>((set) => ({
    currentUser: null, // Start logged out
    users: MOCK_USERS,
    serviceOrders: MOCK_OS,

    login: (email) => set((state) => {
        const user = state.users.find(u => u.email === email);
        return user ? { currentUser: user } : {};
    }),

    logout: () => set({ currentUser: null }),

    addTechnician: (name, email) => set((state) => ({
        users: [...state.users, {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            role: 'technician'
        }]
    })),

    removeTechnician: (id) => set((state) => ({
        users: state.users.filter(u => u.id !== id)
    })),

    addServiceOrder: (os) => set((state) => ({
        serviceOrders: [...state.serviceOrders, {
            ...os,
            id: Math.random().toString(36).substr(2, 9),
            status: 'pending',
            createdAt: new Date().toISOString(),
        }]
    })),

    updateServiceOrderStatus: (id, status) => set((state) => ({
        serviceOrders: state.serviceOrders.map(os =>
            os.id === id ? { ...os, status } : os
        )
    })),

    assignServiceOrder: (osId, technicianId) => set((state) => ({
        serviceOrders: state.serviceOrders.map(os =>
            os.id === osId ? { ...os, assignedTechnicianId: technicianId } : os
        )
    })),

    theme: 'dark',
    toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
    })),
}));
