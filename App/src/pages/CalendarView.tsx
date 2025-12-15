import { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, type Messages } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAppStore } from '../store/useAppStore';

const locales = {
    'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const messages: Messages = {
    allDay: 'Dia inteiro',
    previous: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há eventos neste período.',
};

export const CalendarView = () => {
    const { serviceOrders, currentUser } = useAppStore();

    const events = useMemo(() => {
        if (!currentUser) return [];

        // Filter OS based on role
        const relevantOrders = currentUser.role === 'admin'
            ? serviceOrders
            : serviceOrders.filter(os => os.assignedTechnicianId === currentUser.id);

        return relevantOrders.map(os => ({
            title: os.title,
            start: new Date(os.date),
            end: new Date(new Date(os.date).getTime() + 2 * 60 * 60 * 1000), // Mock 2h duration
            resource: os,
        }));
    }, [serviceOrders, currentUser]);

    const eventStyleGetter = (event: any) => {
        const status = event.resource.status;
        let backgroundColor = '#d97706'; // amber-600 (pendente)

        if (status === 'completed') backgroundColor = '#047857'; // emerald-700
        if (status === 'in-progress') backgroundColor = '#1d4ed8'; // blue-700
        if (status === 'cancelled') backgroundColor = '#b91c1c'; // red-700

        return {
            style: {
                backgroundColor,
                borderRadius: '8px',
                border: 'none',
                opacity: 0.9,
                color: 'white',
                display: 'block',
                fontWeight: '500',
                fontSize: '0.85rem'
            }
        };
    };

    return (
        <div className="h-[calc(100vh-100px)] bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 tracking-tight">Calendário de Serviços</h2>
            <div className="h-[90%] font-sans text-stone-600 dark:text-stone-300">
                <style>
                    {`
                        .rbc-calendar { color: inherit; }
                        .rbc-toolbar button { color: inherit; }
                        .dark .rbc-off-range-bg { background: #292524; }
                        .dark .rbc-today { background: #064e3b30; }
                        .dark .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #44403c; }
                        .dark .rbc-month-view, .dark .rbc-header, .dark .rbc-month-row, .dark .rbc-day-bg { border-color: #44403c; }
                    `}
                </style>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    eventPropGetter={eventStyleGetter}
                    views={['month', 'week', 'day']}
                    defaultView='month'
                    culture='pt-BR'
                    messages={messages}
                />
            </div>
        </div>
    );
};
