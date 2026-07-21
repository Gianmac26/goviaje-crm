import React, { useState } from 'react';
import { 
  Play, 
  RefreshCw, 
  MessageSquare, 
  PhoneCall, 
  Activity, 
  ChevronRight, 
  HelpCircle,
  Clock,
  UserCheck
} from 'lucide-react';
import { Agent, AgentStatus, QueueCall, ActiveCall, ActiveChat } from '../types';

interface SimulationControlsProps {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  queueCalls: QueueCall[];
  setQueueCalls: React.Dispatch<React.SetStateAction<QueueCall[]>>;
  onAddNotification: (msg: string) => void;
}

const randomNames = ['Diego Portal', 'Milagros Díaz', 'Renzo Santillán', 'Guillermo Paz', 'Fátima Solís'];
const randomPhones = ['+51 912 345 678', '+51 988 776 554', '+51 900 112 233', '+51 945 889 112', '+51 954 661 002'];
const randomCampaigns = ['Soporte Técnico', 'Campañas de Ventas', 'Cobranzas', 'Fidelización de Clientes'];
const randomMessages = [
  'Hola, requiero soporte técnico con urgencia.',
  '¿Tienen cobertura en Arequipa?',
  'Ya realicé el abono bancario correspondiente.',
  '¿Pueden agendarme para mañana en la tarde?'
];

export default function SimulationControls({ 
  agents, 
  setAgents, 
  queueCalls, 
  setQueueCalls,
  onAddNotification
}: SimulationControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 1. Simulate Incoming Queue Call
  const handleSimulateCall = () => {
    const randomPhone = randomPhones[Math.floor(Math.random() * randomPhones.length)];
    const randomCamp = randomCampaigns[Math.floor(Math.random() * randomCampaigns.length)];
    const randomPriority = (Math.random() > 0.6 ? 'Alta' : Math.random() > 0.3 ? 'Media' : 'Baja') as 'Alta' | 'Media' | 'Baja';

    const newCall: QueueCall = {
      id: `q-sim-${Date.now()}`,
      phone: randomPhone,
      waitingTime: 0,
      campaign: randomCamp,
      priority: randomPriority,
      state: 'En espera'
    };

    setQueueCalls(prev => [...prev, newCall]);
    onAddNotification(`Nueva llamada entrante simulada en cola para la campaña ${randomCamp} de: ${randomPhone}`);
  };

  // 2. Simulate Chat Message
  const handleSimulateChat = () => {
    // Find connected agents
    const activeAgents = agents.filter(a => a.status === AgentStatus.CONECTADO);
    if (activeAgents.length === 0) {
      onAddNotification('Error: No hay agentes Conectados para recibir un chat simulado.');
      return;
    }

    const targetAgent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const randomPhone = randomPhones[Math.floor(Math.random() * randomPhones.length)];
    const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    const platforms = ['WhatsApp', 'Telegram', 'WebChat'] as const;
    const randPlatform = platforms[Math.floor(Math.random() * platforms.length)];

    const newChat: ActiveChat = {
      id: `chat-sim-${Date.now()}`,
      contactName: randomName,
      phoneOrChannel: randomPhone,
      platform: randPlatform,
      lastMessage: randomMsg,
      duration: 0
    };

    setAgents(prev => prev.map(a => {
      if (a.id === targetAgent.id) {
        return { ...a, activeChat: newChat };
      }
      return a;
    }));

    onAddNotification(`Nuevo chat de ${randomName} simulado para el agente ${targetAgent.name}`);
  };

  // 3. Cycle random agent's status
  const handleCycleStatus = () => {
    const randomIndex = Math.floor(Math.random() * agents.length);
    const targetAgent = agents[randomIndex];

    const statuses = [
      AgentStatus.CONECTADO, 
      AgentStatus.ALMUERZO, 
      AgentStatus.PAUSA, 
      AgentStatus.BANO, 
      AgentStatus.DESCONECTADO
    ];
    
    // Choose a status different from current
    let nextStatus = statuses[Math.floor(Math.random() * statuses.length)];
    while (nextStatus === targetAgent.status) {
      nextStatus = statuses[Math.floor(Math.random() * statuses.length)];
    }

    setAgents(prev => prev.map((a, idx) => {
      if (idx === randomIndex) {
        // If disconnecting, clear calls and chats
        const shouldClear = nextStatus === AgentStatus.DESCONECTADO || nextStatus === AgentStatus.ALMUERZO;
        return {
          ...a,
          status: nextStatus,
          statusDuration: 0,
          activeCall: shouldClear ? undefined : a.activeCall,
          activeChat: shouldClear ? undefined : a.activeChat,
        };
      }
      return a;
    }));

    onAddNotification(`Se cambió el estado del agente ${targetAgent.name} de "${targetAgent.status}" a "${nextStatus}"`);
  };

  // 4. Terminate active call (simulate hanging up)
  const handleHangUpCall = () => {
    const agentsWithCalls = agents.filter(a => a.activeCall);
    if (agentsWithCalls.length === 0) {
      onAddNotification('Error: Ningún agente tiene una llamada activa para finalizar.');
      return;
    }

    const targetAgent = agentsWithCalls[Math.floor(Math.random() * agentsWithCalls.length)];
    
    setAgents(prev => prev.map(a => {
      if (a.id === targetAgent.id) {
        return { ...a, activeCall: undefined };
      }
      return a;
    }));

    onAddNotification(`Llamada finalizada para el agente ${targetAgent.name}. Volvió a quedar disponible.`);
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl transition-all duration-300 z-50 overflow-hidden ${
        isOpen ? 'w-80' : 'w-14 h-14'
      }`}
      id="simulation-controls-root"
    >
      {isOpen ? (
        <div className="p-4 space-y-3.5 text-white">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="font-display font-extrabold text-xs tracking-wide flex items-center gap-1.5 text-amber-400 uppercase">
              <Activity className="w-4 h-4 text-amber-400 animate-pulse" /> Consola de Simulación
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors text-xs font-semibold"
              id="sim-close-btn"
            >
              Cerrar
            </button>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed">
            Utiliza estas herramientas para simular llamadas en cola, chats o cambios de estado y ver cómo responde el sistema en tiempo real.
          </p>

          <div className="space-y-2">
            {/* Action 1 */}
            <button
              onClick={handleSimulateCall}
              className="w-full text-left py-2 px-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-semibold flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
              id="sim-call-btn"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" /> Simular Llamada Entrante
            </button>

            {/* Action 2 */}
            <button
              onClick={handleSimulateChat}
              className="w-full text-left py-2 px-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-semibold flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
              id="sim-chat-btn"
            >
              <MessageSquare className="w-4 h-4 text-purple-400" /> Simular Chat de WhatsApp/Web
            </button>

            {/* Action 3 */}
            <button
              onClick={handleCycleStatus}
              className="w-full text-left py-2 px-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-semibold flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
              id="sim-cycle-btn"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" /> Alternar Estados de Agentes
            </button>

            {/* Action 4 */}
            <button
              onClick={handleHangUpCall}
              className="w-full text-left py-2 px-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-semibold flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
              id="sim-hangup-btn"
            >
              <Clock className="w-4 h-4 text-rose-400" /> Simular Fin de Llamada (Colgar)
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[9px] text-slate-500 font-medium justify-center select-none">
            <HelpCircle className="w-3.5 h-3.5" /> El simulador actualiza los KPis del visor
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-lg group relative"
          title="Consola de simulación"
          id="sim-open-btn"
        >
          <RefreshCw className="w-6 h-6 animate-spin-slow group-hover:rotate-180 transition-all duration-500" />
          <span className="absolute right-16 px-2.5 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow font-semibold z-50">
            Consola de Simulación
          </span>
        </button>
      )}
    </div>
  );
}
