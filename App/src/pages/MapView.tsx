
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useAppStore } from '../store/useAppStore';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icon not loading
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIcon2xPng from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconUrl: markerIconPng,
    iconRetinaUrl: markerIcon2xPng,
    shadowUrl: markerShadowPng,
});

import { useAuth } from '../context/AuthContext';

// ...

export const MapView = () => {
    const { serviceOrders } = useAppStore();
    const { session } = useAuth();

    // Derived user info
    const userEmail = session?.user.email;
    const isAdmin = userEmail?.includes('admin') || userEmail === 'suporte@maprinter.com.br';
    const userId = session?.user.id;

    if (!session) return null;

    const relevantOrders = isAdmin
        ? serviceOrders
        : serviceOrders.filter(os => os.assignedTechnicianId === userId);

    const defaultCenter = { lat: -14.8661, lng: -40.8394 }; // Vitória da Conquista - BA

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'Concluído';
            case 'in-progress': return 'Em Andamento';
            case 'cancelled': return 'Cancelado';
            default: return 'Pendente';
        }
    };

    return (
        <div className="w-full h-[calc(100vh-8rem)] min-h-[500px] animate-[fadeIn_0.5s_ease-out]">
            <MapContainer
                center={[defaultCenter.lat, defaultCenter.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="z-0 rounded-2xl"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {relevantOrders.map(os => (
                    <Marker
                        key={os.id}
                        position={[os.location.lat, os.location.lng]}
                    >
                        <Popup className="dark:invert-0">
                            <div className="p-2 min-w-[150px]">
                                <h3 className="font-bold text-base mb-1 text-stone-800">{os.title}</h3>
                                <p className="text-xs text-stone-500 mb-2">{os.location.address}</p>
                                <div className="text-xs font-bold px-2 py-1 rounded bg-stone-100 text-stone-600 inline-block">
                                    {getStatusText(os.status)}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
