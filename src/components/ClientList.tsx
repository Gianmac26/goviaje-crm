import React, { useState } from 'react';
import { Search, Filter, Calendar, FileText, UserCheck, ChevronRight, ShieldCheck, Clock } from 'lucide-react';
import { VisaClient, VisaType, VisaStatus } from '../types';

interface ClientListProps {
  clients: VisaClient[];
  selectedClient: VisaClient | null;
  onClientClick: (client: VisaClient) => void;
}

export default function ClientList({ clients, selectedClient, onClientClick }: ClientListProps) {
  const [search, setSearch] = useState('');
  const [visaFilter, setVisaFilter] = useState<string>('Todos');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');

  // Filter clients list
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(search.toLowerCase()) ||
                          client.passportNumber.toLowerCase().includes(search.toLowerCase()) ||
                          (client.ds160Code && client.ds160Code.toLowerCase().includes(search.toLowerCase()));

    const matchesVisa = visaFilter === 'Todos' || client.visaType === visaFilter;
    const matchesStatus = statusFilter === 'Todos' || client.status === statusFilter;

    return matchesSearch && matchesVisa && matchesStatus;
  });

  // Badge colors helper for visa status
  const getStatusBadge = (status: VisaStatus) => {
    switch (status) {
      case 'Aprobado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Cita Programada':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Esperando Cita':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Llenando DS-160':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'En Revisión':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Rechazado':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  // Badge colors helper for visa type
  const getVisaTypeBadge = (type: VisaType) => {
    if (type === 'Visa USA') {
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        flag: '🇺🇸'
      };
    }
    return {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      flag: '🇨🇦'
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all">
      {/* Top Banner / Header of the Client Workspace */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                GoTravel Latam
              </span>
              <span className="text-xs text-slate-400">| Gestoría de Visas & Trámites</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Gestor de Clientes y Visas</h1>
            <p className="text-slate-300 text-sm mt-1">
              Supervisión en tiempo real de solicitudes de visa de turismo, DS-160 y fechas de entrevista consular.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-center">
              <div className="text-xl font-bold text-amber-400">{clients.length}</div>
              <div className="text-[11px] text-slate-300">Total Solicitudes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-center">
              <div className="text-xl font-bold text-emerald-400">
                {clients.filter(c => c.status === 'Aprobado').length}
              </div>
              <div className="text-[11px] text-slate-300">Visas Aprobadas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, pasaporte o DS-160..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filtros:</span>
          </div>

          <select
            value={visaFilter}
            onChange={(e) => setVisaFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-700 cursor-pointer"
          >
            <option value="Todos">Todas las Visas</option>
            <option value="Visa USA">🇺🇸 Visa USA</option>
            <option value="Visa Canadá">🇨🇦 Visa Canadá</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-700 cursor-pointer"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Llenando DS-160">Llenando DS-160</option>
            <option value="Esperando Cita">Esperando Cita</option>
            <option value="Cita Programada">Cita Programada</option>
            <option value="En Revisión">En Revisión</option>
            <option value="Aprobado">Aprobado</option>
          </select>
        </div>
      </div>

      {/* Main Clients Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Cliente</th>
              <th className="py-3 px-4">Tipo de Trámite</th>
              <th className="py-3 px-4">Estado del Trámite</th>
              <th className="py-3 px-4">Fecha de Entrevista</th>
              <th className="py-3 px-4">Asesor Asignado</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No se encontraron clientes con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => {
                const visaBadge = getVisaTypeBadge(client.visaType);
                const isSelected = selectedClient?.id === client.id;

                return (
                  <tr
                    key={client.id}
                    onClick={() => onClientClick(client)}
                    className={`group hover:bg-amber-50/60 cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-50 border-l-4 border-l-amber-500' : ''
                    }`}
                  >
                    {/* Client Name & Contact */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                          {client.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors flex items-center gap-2">
                            {client.name}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-2">
                            <span>{client.passportNumber}</span>
                            <span>•</span>
                            <span>{client.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Visa Type */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${visaBadge.bg}`}>
                        <span>{visaBadge.flag}</span>
                        <span>{client.visaType}</span>
                      </span>
                    </td>

                    {/* Visa Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(client.status)}`}>
                        {client.status}
                      </span>
                    </td>

                    {/* Interview Date */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{client.interviewDate}</span>
                      </div>
                    </td>

                    {/* Assigned Agent */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="truncate max-w-[140px]">{client.assignedAgent}</span>
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClientClick(client);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-amber-700 hover:bg-amber-100/80 bg-slate-100 rounded-lg transition-all cursor-pointer"
                      >
                        Ver Detalle
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-400 flex justify-between items-center">
        <span>Mostrando {filteredClients.length} de {clients.length} clientes registrados en GoTravel</span>
        <span className="text-[11px] italic">Haz clic en cualquier cliente para ver la ficha completa en el panel derecho.</span>
      </div>
    </div>
  );
}
