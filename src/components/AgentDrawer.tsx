import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MessageSquare, 
  TrendingUp, 
  AlertCircle, 
  Smile, 
  Clock, 
  ShieldCheck,
  Send,
  Volume2
} from 'lucide-react';
import { Agent, AgentStatus } from '../types';

interface AgentDrawerProps {
  agent: Agent | null;
  onClose: () => void;
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  onAddNotification: (msg: string) => void;
}

export default function AgentDrawer({ 
  agent, 
  onClose, 
  setAgents,
  onAddNotification 
}: AgentDrawerProps) {
  const [coachingText, setCoachingText] = useState('');
  const [whispering, setWhispering] = useState(false);

  if (!agent) return null;

  // Format seconds to HH:MM:SS
  const formatSecs = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Override agent's status manually
  const handleForceStatus = (newStatus: AgentStatus) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agent.id) {
        return {
          ...a,
          status: newStatus,
          statusDuration: 0,
          // Clear active call/chats if disconnected or in lunch
          activeCall: (newStatus === AgentStatus.DESCONECTADO || newStatus === AgentStatus.ALMUERZO) ? undefined : a.activeCall,
          activeChat: (newStatus === AgentStatus.DESCONECTADO || newStatus === AgentStatus.ALMUERZO) ? undefined : a.activeChat,
        };
      }
      return a;
    }));
    onAddNotification(`Supervisor forzó estado de ${agent.name} a "${newStatus}"`);
    onClose();
  };

  // Hangup active call of agent
  const handleHangUpCall = () => {
    setAgents(prev => prev.map(a => {
      if (a.id === agent.id) {
        return { ...a, activeCall: undefined };
      }
      return a;
    }));
    onAddNotification(`Supervisor finalizó llamada activa de ${agent.name} manualmente`);
    onClose();
  };

  // Close active chat
  const handleCloseChat = () => {
    setAgents(prev => prev.map(a => {
      if (a.id === agent.id) {
        return { ...a, activeChat: undefined };
      }
      return a;
    }));
    onAddNotification(`Supervisor cerró sesión de chat activa para ${agent.name}`);
    onClose();
  };

  // Send coaching recommendation text
  const handleSendCoaching = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachingText.trim()) return;
    
    onAddNotification(`Mensaje de Coaching enviado a ${agent.name}: "${coachingText}"`);
    setCoachingText('');
    alert('Mensaje de coaching enviado a la pantalla del agente con éxito.');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col animate-slide-in">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0 shadow-sm">
            {agent.name[0]}
          </div>
          <div>
            <h3 className="font-display font-bold text-xs text-slate-800">{agent.name}</h3>
            <span className="text-[10px] text-slate-400">Anexo {agent.extension} • {agent.role}</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          id="close-agent-drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Status override block */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Estado de Operación</span>
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                agent.status === AgentStatus.CONECTADO ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`} />
              <span className="font-bold text-slate-700 text-xs">{agent.status}</span>
            </div>
            <span className="text-slate-500 font-mono text-xs font-semibold">{formatSecs(agent.statusDuration)}</span>
          </div>
          
          {/* Override Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {agent.status !== AgentStatus.CONECTADO && (
              <button 
                onClick={() => handleForceStatus(AgentStatus.CONECTADO)}
                className="py-1.5 px-2 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center"
              >
                Conectar Agente
              </button>
            )}
            {agent.status !== AgentStatus.ALMUERZO && (
              <button 
                onClick={() => handleForceStatus(AgentStatus.ALMUERZO)}
                className="py-1.5 px-2 bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center"
              >
                Poner en Almuerzo
              </button>
            )}
            {agent.status !== AgentStatus.PAUSA && (
              <button 
                onClick={() => handleForceStatus(AgentStatus.PAUSA)}
                className="py-1.5 px-2 bg-sky-50 border border-sky-300 hover:bg-sky-100 text-sky-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center"
              >
                Poner en Pausa
              </button>
            )}
            {agent.status !== AgentStatus.DESCONECTADO && (
              <button 
                onClick={() => handleForceStatus(AgentStatus.DESCONECTADO)}
                className="py-1.5 px-2 bg-rose-50 border border-rose-300 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center"
              >
                Desconectar
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Performance KPIs */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Estadísticas Clave (Hoy)</span>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl text-center">
              <span className="text-[9px] text-slate-400 block font-semibold">Nivel SLA</span>
              <span className="font-display font-bold text-slate-800 text-sm block mt-0.5">94.2%</span>
            </div>
            <div className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl text-center">
              <span className="text-[9px] text-slate-400 block font-semibold">CSAT</span>
              <span className="font-display font-bold text-emerald-600 text-sm block mt-0.5">4.8 / 5.0</span>
            </div>
            <div className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl text-center">
              <span className="text-[9px] text-slate-400 block font-semibold">Llamadas</span>
              <span className="font-display font-bold text-slate-800 text-sm block mt-0.5">38 atendidas</span>
            </div>
            <div className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl text-center">
              <span className="text-[9px] text-slate-400 block font-semibold">AHT Medio</span>
              <span className="font-display font-bold text-slate-800 text-sm block mt-0.5">182 seg</span>
            </div>
          </div>
        </div>

        {/* Active Call Panel actions */}
        {agent.activeCall && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Llamada en Curso</span>
            
            <div className="p-3.5 border border-emerald-300 bg-emerald-50/20 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">{agent.activeCall.phone}</span>
                <span className="font-mono text-emerald-600 font-bold">{formatSecs(agent.activeCall.duration)}</span>
              </div>
              <div className="text-[10px] text-slate-500">
                Tipo: <span className="font-semibold">{agent.activeCall.type}</span> • Canal: Voz SIP
              </div>

              {/* Action grid */}
              <div className="space-y-2 pt-1">
                {/* Whispering Listening button */}
                <button
                  onClick={() => {
                    setWhispering(!whispering);
                    onAddNotification(`${whispering ? 'Detuvo' : 'Inició'} escucha silenciosa para el agente ${agent.name}`);
                  }}
                  className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    whispering 
                      ? 'bg-rose-600 text-white hover:bg-rose-700' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  {whispering ? 'Detener Escucha' : 'Escucha Silenciosa'}
                </button>

                {/* Force Hangup */}
                <button
                  onClick={handleHangUpCall}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Finalizar Llamada
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Chat Panel with simulated Chat Log */}
        {agent.activeChat && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Chat Activo con Cliente</span>
            
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col h-64 shadow-xs">
              {/* Header inside chat */}
              <div className="bg-slate-200/50 p-2 text-[10px] font-bold text-slate-700 flex justify-between items-center">
                <span>{agent.activeChat.contactName} ({agent.activeChat.platform})</span>
                <button onClick={handleCloseChat} className="text-slate-400 hover:text-slate-600 text-[9px] hover:underline">
                  Cerrar Chat
                </button>
              </div>

              {/* Simulated chat log */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-[11px] scrollbar-hide">
                <div className="bg-white p-2 rounded-xl border border-slate-100 max-w-[85%]">
                  Hola, tengo una pregunta sobre mi facturación del mes pasado.
                </div>
                <div className="bg-blue-600 text-white p-2 rounded-xl self-end max-w-[85%] ml-auto">
                  Hola, con gusto le asisto. Por favor indíqueme su número de documento de identidad para buscar el registro.
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-100 max-w-[85%]">
                  Mi documento es el 45892309-A. El cobro me vino duplicado.
                </div>
                {agent.activeChat.lastMessage && (
                  <div className="bg-white p-2 rounded-xl border border-slate-100 max-w-[85%] font-medium text-amber-700">
                    Último: "{agent.activeChat.lastMessage}"
                  </div>
                )}
              </div>

              {/* Coaching suggestions inputs form */}
              <form onSubmit={handleSendCoaching} className="p-2 border-t border-slate-200 bg-white flex gap-2">
                <input 
                  type="text" 
                  placeholder="Sugerir respuesta (Coaching)..."
                  value={coachingText}
                  onChange={(e) => setCoachingText(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50"
                  id="coaching-input"
                />
                <button 
                  type="submit"
                  className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
