import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  ShieldAlert, 
  CheckCircle, 
  TrendingUp, 
  Play, 
  UserCheck, 
  X,
  AlertCircle 
} from 'lucide-react';
import { QueueCall, Agent, AgentStatus, ActiveCall } from '../types';

interface QueueViewerProps {
  queueCalls: QueueCall[];
  setQueueCalls: React.Dispatch<React.SetStateAction<QueueCall[]>>;
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  onAddNotification: (msg: string) => void;
}

export default function QueueViewer({ 
  queueCalls, 
  setQueueCalls, 
  agents, 
  setAgents,
  onAddNotification
}: QueueViewerProps) {
  const [selectedCall, setSelectedCall] = useState<QueueCall | null>(null);

  // Stats calculation
  const totalWaiting = queueCalls.length;
  const avgWaitTime = queueCalls.length > 0 
    ? Math.round(queueCalls.reduce((acc, c) => acc + c.waitingTime, 0) / queueCalls.length) 
    : 14;

  const activeAgentsCount = agents.filter(a => a.status === AgentStatus.CONECTADO).length;
  const availableAgents = agents.filter(a => a.status === AgentStatus.CONECTADO && !a.activeCall);

  // Format seconds to MM:SS
  const formatSecs = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Assign call to an agent manually
  const handleAssignCall = (agentId: string) => {
    if (!selectedCall) return;

    // Update Agent state
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        const newCall: ActiveCall = {
          phone: selectedCall.phone,
          type: 'Entrante',
          duration: 0,
          status: 'hablando'
        };
        return {
          ...agent,
          activeCall: newCall
        };
      }
      return agent;
    }));

    // Remove from queue
    setQueueCalls(prev => prev.filter(c => c.id !== selectedCall.id));

    // Log Notification
    const agentName = agents.find(a => a.id === agentId)?.name || 'agente';
    onAddNotification(`Llamada en espera ${selectedCall.phone} asignada manualmente a ${agentName}`);

    // Close Modal
    setSelectedCall(null);
  };

  return (
    <div id="queue-viewer-root" className="space-y-6">
      {/* KPI stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Llamadas en Espera</span>
            <span className="font-display font-bold text-slate-800 text-2xl block mt-1">{totalWaiting}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shadow-xs shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tiempo Medio de Espera</span>
            <span className="font-display font-bold text-slate-800 text-2xl block mt-1">{formatSecs(avgWaitTime)}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shadow-xs shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SLA de Servicio</span>
            <span className="font-display font-bold text-slate-800 text-2xl block mt-1">87.5%</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-xs shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Agentes Libres / Conectados</span>
            <span className="font-display font-bold text-slate-800 text-2xl block mt-1">{availableAgents.length} / {activeAgentsCount}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shadow-xs shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Area Graph using beautifully crafted SVG to ensure perfect responsive rendering */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-blue-500" /> Historial de Carga y Cola (Hoy)
        </h3>
        
        {/* SVG smoothed area chart with grid lines */}
        <div className="relative h-44 w-full border-b border-l border-slate-100 flex items-end">
          <svg className="w-full h-full absolute inset-0 pt-4 px-2" viewBox="0 0 500 100" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="0" y1="25" x2="500" y2="25" stroke="#f1f5f9" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="0.5" />
            <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="0.5" />
            
            {/* Area path */}
            <path 
              d="M 0 100 Q 80 40 150 70 T 300 20 T 450 60 T 500 100 Z" 
              fill="url(#area-gradient)" 
              opacity="0.15" 
            />
            {/* Line path */}
            <path 
              d="M 0 100 Q 80 40 150 70 T 300 20 T 450 60 L 500 100" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            
            {/* Definition for gradient */}
            <defs>
              <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Hour markers */}
          <div className="absolute inset-x-0 -bottom-6 flex justify-between text-[10px] text-slate-400 font-semibold px-2 select-none">
            <span>08:00</span>
            <span>10:00</span>
            <span>12:00</span>
            <span>14:00</span>
            <span>16:00</span>
            <span>18:00</span>
            <span>20:00</span>
          </div>
        </div>
      </div>

      {/* Queued Calls list card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-display font-bold text-slate-800 text-xs">Llamadas en Cola de Espera Activas</h3>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {queueCalls.length} en espera
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 bg-slate-50/20 select-none">
                <th className="py-3 px-6">Teléfono de Cliente</th>
                <th className="py-3 px-4">Campaña / Origen</th>
                <th className="py-3 px-4">Tiempo de Espera</th>
                <th className="py-3 px-4">Prioridad</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {queueCalls.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                    No hay llamadas en espera en este momento.
                  </td>
                </tr>
              ) : (
                queueCalls.map((call) => {
                  let priorityColor = 'bg-blue-100 text-blue-800 border-blue-200';
                  if (call.priority === 'Alta') priorityColor = 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse';
                  else if (call.priority === 'Media') priorityColor = 'bg-amber-100 text-amber-800 border-amber-200';

                  return (
                    <tr key={call.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-700">
                        {call.phone}
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-medium">
                        {call.campaign}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-rose-600 flex items-center gap-1.5 mt-2.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formatSecs(call.waitingTime)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${priorityColor}`}>
                          {call.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-amber-600">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                          {call.state}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => setSelectedCall(call)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[10px] inline-flex items-center gap-1 transition-all hover:scale-105 cursor-pointer shadow-xs"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Asignar Manualmente
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Assignment Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-100 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-display font-bold text-slate-800 text-sm">Asignar Llamada Pendiente</h2>
              <button 
                onClick={() => setSelectedCall(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-lg text-xs space-y-1.5 border border-slate-100">
                <div className="text-slate-500">Teléfono: <span className="font-mono font-bold text-slate-800">{selectedCall.phone}</span></div>
                <div className="text-slate-500">Campaña: <span className="font-semibold text-slate-800">{selectedCall.campaign}</span></div>
                <div className="text-slate-500">Espera actual: <span className="font-mono font-bold text-rose-600">{formatSecs(selectedCall.waitingTime)}</span></div>
              </div>

              <h3 className="block text-xs font-bold text-slate-600">Agentes Disponibles ({availableAgents.length})</h3>
              
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {availableAgents.length === 0 ? (
                  <div className="p-4 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-xs flex gap-2 items-start">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      No hay agentes conectados y libres en este momento. Intente cambiar el estado de algún agente desde el panel de simulación para dejarlo libre.
                    </p>
                  </div>
                ) : (
                  availableAgents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => handleAssignCall(agent.id)}
                      className="w-full text-left p-3 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/20 transition-all flex justify-between items-center cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold text-slate-700 text-xs">{agent.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Anexo {agent.extension} • {agent.module}</div>
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 hover:underline">
                        Asignar
                      </span>
                    </button>
                  ))
                )}
              </div>

              {/* Form buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setSelectedCall(null)}
                  className="px-4 py-1.5 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
