import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  Phone, 
  PhoneCall, 
  PhoneOff,
  ExternalLink, 
  MessageSquare, 
  UserPlus, 
  MoreVertical, 
  CheckCircle, 
  X, 
  Clock, 
  Tag, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Agent, AgentStatus, ActiveCall, ActiveChat } from '../types';
import { companies, campaigns } from '../mockData';

interface UserMonitoringProps {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  onAgentClick: (agent: Agent) => void;
  onCallAction: (agent: Agent, action: 'escuchar' | 'intervenir' | 'llamar') => void;
}

export default function UserMonitoring({ 
  agents, 
  setAgents, 
  onAgentClick,
  onCallAction
}: UserMonitoringProps) {
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('Todas las empresas');
  const [campaign, setCampaign] = useState('Todas las campañas');
  const [statusFilter, setStatusFilter] = useState('Todos los estados');

  // Modal states for adding agent
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newExt, setNewExt] = useState('');
  const [newRole, setNewRole] = useState<'Agente' | 'Administrador' | 'Supervisor'>('Agente');
  const [newModule, setNewModule] = useState('Gestor de tickets');
  const [newStrategy, setNewStrategy] = useState('Marcador predictivo');

  // Format seconds to HH:MM:SS
  const formatDuration = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle adding a new agent
  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newExt.trim()) return;

    // Check if extension already exists
    if (agents.some(a => a.extension === newExt)) {
      alert('La extensión (anexo) ya existe.');
      return;
    }

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      extension: newExt,
      name: newName,
      role: newRole,
      status: AgentStatus.CONECTADO,
      statusDuration: 0,
      module: newModule,
      activeTickets: 0,
      activeStrategies: newStrategy,
    };

    setAgents([newAgent, ...agents]);
    
    // Reset form
    setNewName('');
    setNewExt('');
    setShowAddModal(false);
  };

  // Filter agent list
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase()) || 
                          agent.extension.includes(search);
    
    const matchesStatus = statusFilter === 'Todos los estados' || 
                          (statusFilter === 'Activos' && agent.status !== AgentStatus.DESCONECTADO) ||
                          agent.status === statusFilter;
    
    // In our client simulation, since we don't have a rigid backend for companies,
    // we match campaign filter to the activeStrategies or campaign fields.
    const matchesCampaign = campaign === 'Todas las campañas' || 
                            agent.activeStrategies.toLowerCase().includes(campaign.replace('Campañas de ', '').toLowerCase()) ||
                            (agent.activeCall?.type === 'Predictivo' && campaign === 'Campañas de Ventas') ||
                            agent.module.toLowerCase().includes(campaign.toLowerCase());

    return matchesSearch && matchesStatus && matchesCampaign;
  });

  return (
    <div id="user-monitoring-root" className="space-y-6">
      {/* Alert / Explanation Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Monitorea en tiempo real las acciones de tus usuarios en <span className="font-semibold text-slate-800">Score Cloud</span>, incluyendo escucha de llamadas y seguimiento de chats.{' '}
              <a className="text-blue-600 font-medium hover:underline inline-flex items-center gap-0.5" href="#learn-more">
                Click aquí para conocer más.
              </a>
            </p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            id="btn-add-agent"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shrink-0 shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> Registrar Agente
          </button>
        </div>

        {/* Filters bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o anexo..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
              id="search-input"
            />
          </div>

          {/* Company Filter */}
          <div className="relative">
            <select 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
              id="filter-company"
            >
              {companies.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Campaign Filter */}
          <div className="relative">
            <select 
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
              id="filter-campaign"
            >
              {campaigns.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
              id="filter-status"
            >
              <option value="Todos los estados">Todos los estados</option>
              <option value="Activos">Solo Activos</option>
              <option value={AgentStatus.CONECTADO}>Conectados</option>
              <option value={AgentStatus.ALMUERZO}>En Almuerzo</option>
              <option value={AgentStatus.PAUSA}>En Pausa</option>
              <option value={AgentStatus.BANO}>En Baño</option>
              <option value={AgentStatus.DESCONECTADO}>Desconectados</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Agents Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 bg-slate-50/70 select-none">
                <th className="py-3 px-6 w-16">Anexo</th>
                <th className="py-3 px-4 min-w-[200px]">Nombres y Apellidos</th>
                <th className="py-3 px-4 min-w-[140px]">Estado</th>
                <th className="py-3 px-2 w-14 text-center">Acción</th>
                <th className="py-3 px-4">Módulo</th>
                <th className="py-3 px-4 text-center">Tickets Activos</th>
                <th className="py-3 px-4">Estrategias Activas</th>
                <th className="py-3 px-4 min-w-[200px]">Llamadas Activas</th>
                <th className="py-3 px-4 min-w-[200px]">Chats Abiertos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                    No se encontraron agentes que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => {
                  // Setup state details
                  let statusBg = 'bg-slate-400';
                  if (agent.status === AgentStatus.CONECTADO) statusBg = 'bg-emerald-500 animate-pulse';
                  else if (agent.status === AgentStatus.ALMUERZO) statusBg = 'bg-amber-500';
                  else if (agent.status === AgentStatus.PAUSA) statusBg = 'bg-sky-500';
                  else if (agent.status === AgentStatus.BANO) statusBg = 'bg-rose-400';

                  return (
                    <tr 
                      key={agent.id} 
                      className="hover:bg-slate-50/50 transition-colors group"
                      id={`agent-row-${agent.extension}`}
                    >
                      {/* Extension */}
                      <td className="py-4 px-6 text-slate-500 font-mono font-medium">
                        {agent.extension}
                      </td>

                      {/* Name & Role */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <button 
                            onClick={() => onAgentClick(agent)}
                            className="text-blue-600 font-semibold flex items-center gap-1 hover:underline text-left"
                          >
                            {agent.name}
                            <ExternalLink className="w-3 h-3 text-blue-400" />
                          </button>
                          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {agent.role}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${statusBg}`} />
                          <span className="font-semibold text-slate-700">{agent.status}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 ml-3.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-300" />
                          {formatDuration(agent.statusDuration)}
                        </div>
                      </td>

                      {/* Action trigger button */}
                      <td className="py-4 px-2 text-center">
                        <button 
                          onClick={() => onAgentClick(agent)}
                          disabled={agent.status === AgentStatus.DESCONECTADO}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                            agent.status === AgentStatus.CONECTADO 
                              ? 'border-emerald-300 text-emerald-600 bg-emerald-50/40 hover:bg-emerald-50 hover:scale-105 cursor-pointer' 
                              : 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed'
                          }`}
                          title={agent.status === AgentStatus.CONECTADO ? "Monitorear e intervenir llamada" : "Agente no disponible"}
                          id={`monitor-btn-${agent.extension}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                      </td>

                      {/* Module */}
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-700">{agent.module}</div>
                        {agent.moduleDetails && (
                          <div className="text-[10px] text-slate-400 italic mt-0.5">
                            {agent.moduleDetails}
                          </div>
                        )}
                      </td>

                      {/* Active Tickets */}
                      <td className="py-4 px-4 text-center font-semibold text-slate-700">
                        {agent.activeTickets}
                      </td>

                      {/* Strategies */}
                      <td className="py-4 px-4 text-slate-600">
                        {agent.activeStrategies}
                      </td>

                      {/* Active Call Status */}
                      <td className="py-4 px-4">
                        {agent.activeCall ? (
                          <div className="border border-emerald-300 bg-emerald-50/30 rounded-lg flex items-center h-10 overflow-hidden w-48 relative shadow-sm">
                            {/* Voice Wave Animation */}
                            <div className="w-12 h-full bg-emerald-100/50 flex items-center justify-center px-2">
                              <div className="flex items-center gap-0.5 h-4 justify-center">
                                <div className="w-0.5 bg-emerald-500 h-2 animate-bounce" style={{ animationDelay: '0.1s', animationDuration: '0.8s' }} />
                                <div className="w-0.5 bg-emerald-500 h-4 animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '1s' }} />
                                <div className="w-0.5 bg-emerald-500 h-3 animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '0.9s' }} />
                                <div className="w-0.5 bg-emerald-500 h-1 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '0.7s' }} />
                                <div className="w-0.5 bg-emerald-500 h-3 animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '1.1s' }} />
                              </div>
                            </div>
                            
                            {/* Call Details */}
                            <div className="px-2.5 py-1 flex-1 relative z-10 flex flex-col justify-center min-w-0">
                              <div className="text-[11px] font-bold text-slate-800 truncate">
                                {agent.activeCall.phone}
                              </div>
                              <div className="text-[9px] text-slate-500 flex justify-between items-center mt-0.5">
                                <span className="font-medium bg-emerald-100 text-emerald-800 px-1 rounded-[3px] scale-95 origin-left">
                                  {agent.activeCall.type}
                                </span>
                                <span className="font-mono flex items-center gap-0.5 font-semibold text-emerald-600">
                                  {formatDuration(agent.activeCall.duration)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-200 bg-slate-50/30 rounded-lg h-10 flex items-center justify-center w-48 text-[10px] text-slate-400 font-medium">
                            Sin llamada activa
                          </div>
                        )}
                      </td>

                      {/* Active Chat Status */}
                      <td className="py-4 px-4">
                        {agent.activeChat ? (
                          <div className={`border rounded-lg p-1.5 flex items-center gap-2 w-48 shadow-sm ${
                            agent.activeChat.platform === 'WhatsApp' 
                              ? 'border-emerald-300 bg-emerald-50/10' 
                              : agent.activeChat.platform === 'Telegram' 
                              ? 'border-purple-300 bg-purple-50/10' 
                              : 'border-orange-300 bg-orange-50/10'
                          }`}>
                            {/* Platform Badge Icon */}
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${
                              agent.activeChat.platform === 'WhatsApp' 
                                ? 'bg-green-500' 
                                : agent.activeChat.platform === 'Telegram' 
                                ? 'bg-purple-500' 
                                : 'bg-orange-500'
                            }`}>
                              <MessageSquare className="w-3.5 h-3.5" />
                            </div>
                            
                            {/* Chat Details */}
                            <div className="flex flex-col justify-center overflow-hidden min-w-0">
                              <div className="text-[10px] font-bold text-slate-800 truncate">
                                {agent.activeChat.contactName}
                              </div>
                              <div className="text-[9px] text-slate-500 truncate flex items-center justify-between mt-0.5">
                                <span className="truncate">{agent.activeChat.phoneOrChannel}</span>
                                <span className="text-[8px] font-semibold font-mono text-slate-400 bg-slate-100 px-0.5 rounded ml-1">
                                  {formatDuration(agent.activeChat.duration)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-200 bg-slate-50/30 rounded-lg h-10 flex items-center justify-center w-48 text-[10px] text-slate-400 font-medium">
                            Sin chats abiertos
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Agent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-100 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-display font-bold text-slate-800 text-sm">Registrar Nuevo Agente</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddAgent} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Juan Pérez"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Extension & Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Anexo / Ext.</label>
                  <input 
                    type="text" 
                    required
                    maxLength={4}
                    placeholder="Ej: 015"
                    value={newExt}
                    onChange={(e) => setNewExt(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Rol</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Agente">Agente</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                </div>
              </div>

              {/* Module */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Módulo Asignado</label>
                <input 
                  type="text" 
                  value={newModule}
                  onChange={(e) => setNewModule(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Strategy */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Estrategia Activa</label>
                <select
                  value={newStrategy}
                  onChange={(e) => setNewStrategy(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Marcador predictivo">Marcador predictivo</option>
                  <option value="Marcador progresivo - IVR">Marcador progresivo - IVR</option>
                  <option value="Marcador manual">Marcador manual</option>
                </select>
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-700 leading-relaxed">
                  El agente se registrará por defecto en estado <strong>Conectado</strong>. Sus tiempos en pantalla comenzarán a correr de forma automática.
                </p>
              </div>

              {/* Form buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
