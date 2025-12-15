import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PlusCircle, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import type { ServiceOrderStatus } from '../types';

export const Orders = () => {
    const { serviceOrders, users, addServiceOrder, updateServiceOrderStatus, assignServiceOrder } = useAppStore();
    const [isCreating, setIsCreating] = useState(false);

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
            case 'completed': return 'text-green-600 bg-green-50';
            case 'in-progress': return 'text-blue-600 bg-blue-50';
            case 'cancelled': return 'text-red-600 bg-red-50';
            default: return 'text-yellow-600 bg-yellow-50';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Service Orders</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    New Order
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                    <h3 className="text-lg font-bold mb-4 border-b pb-2">Create New Service Order</h3>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                required
                                className="w-full mt-1 p-2 border rounded"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g., Fix Printer"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                required
                                className="w-full mt-1 p-2 border rounded"
                                rows={3}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Details of the task..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                required
                                type="datetime-local"
                                className="w-full mt-1 p-2 border rounded"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                required
                                className="w-full mt-1 p-2 border rounded"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder="123 Main St"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Assign Technician</label>
                            <select
                                className="w-full mt-1 p-2 border rounded"
                                value={assignedTech}
                                onChange={e => setAssignedTech(e.target.value)}
                            >
                                <option value="">Unassigned</option>
                                {technicians.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Create Order
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List of Orders */}
            <div className="grid gap-4">
                {serviceOrders.map(os => {


                    return (
                        <div key={os.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={clsx("px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide", getStatusColor(os.status))}>
                                        {os.status}
                                    </span>
                                    <h3 className="font-bold text-gray-800">{os.title}</h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{os.description}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1" /> {format(new Date(os.date), "PPp")}</span>
                                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {os.location.address}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 min-w-[200px]">
                                <div className="flex items-center text-sm">
                                    <span className="text-gray-500 mr-2">Assigned to:</span>
                                    <select
                                        className="border rounded px-2 py-1 text-sm"
                                        value={os.assignedTechnicianId || ""}
                                        onChange={(e) => assignServiceOrder(os.id, e.target.value)}
                                    >
                                        <option value="">Unassigned</option>
                                        {technicians.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center text-sm">
                                    <span className="text-gray-500 mr-2">Status:</span>
                                    <select
                                        className="border rounded px-2 py-1 text-sm"
                                        value={os.status}
                                        onChange={(e) => updateServiceOrderStatus(os.id, e.target.value as ServiceOrderStatus)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    );
                })}

                {serviceOrders.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded border border-dashed">
                        No service orders found.
                    </div>
                )}
            </div>
        </div>
    );
};
