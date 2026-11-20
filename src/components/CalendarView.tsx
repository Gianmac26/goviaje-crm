import React from 'react';
import { CalendarDays, Clock3, MapPin, UserRound } from 'lucide-react';
import { VisaClient } from '../types';

interface CalendarViewProps {
  clients: VisaClient[];
  onSelectClient: (client: VisaClient) => void;
}

const getSortValue = (value: string) => {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
};

const formatDateLabel = (value: string) => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value || 'Sin fecha';
  }

  return parsed.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function CalendarView({ clients, onSelectClient }: CalendarViewProps) {
  const upcomingClients = [...clients]
    .filter((client) => client.interviewDate)
    .sort((a, b) => getSortValue(a.interviewDate) - getSortValue(b.interviewDate));

  const groupedByDate = upcomingClients.reduce<Record<string, VisaClient[]>>((acc, client) => {
    const key = client.interviewDate;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(client);
    return acc;
  }, {});

  const upcoming = upcomingClients.slice(0, 4);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Calendario de entrevistas</p>
          <h2 className="text-xl font-bold text-slate-800">Agenda GoTravel</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
          <CalendarDays className="h-4 w-4" />
          {upcomingClients.length} citas registradas
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4">
          {Object.entries(groupedByDate).map(([date, dayClients]) => (
            <div key={date} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CalendarDays className="h-4 w-4 text-amber-500" />
                {formatDateLabel(date)}
              </div>

              <div className="space-y-2">
                {dayClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => onSelectClient(client)}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-3 text-left transition hover:border-amber-300 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                        <UserRound className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{client.name}</p>
                        <p className="text-sm text-slate-500">{client.visaType}</p>
                      </div>
                    </div>

                    <div className="text-right text-sm text-slate-500">
                      <p className="flex items-center justify-end gap-1 font-medium text-slate-700">
                        <Clock3 className="h-3.5 w-3.5" />
                        {client.interviewTime || 'Hora por confirmar'}
                      </p>
                      <p className="flex items-center justify-end gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {client.embassyLocation || 'Embajada por confirmar'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Próximas citas</h3>
          <div className="space-y-2">
            {upcoming.map((client) => (
              <div key={client.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                <p className="font-semibold text-slate-800">{client.name}</p>
                <p className="text-sm text-slate-500">{client.interviewDate}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
