import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UserMonitoring from './components/UserMonitoring';
import QueueViewer from './components/QueueViewer';
import Recordings from './components/Recordings';
import QualityAssurance from './components/QualityAssurance';
import DialpadModal from './components/DialpadModal';
import SimulationControls from './components/SimulationControls';
import AgentDrawer from './components/AgentDrawer';
import ClientList from './components/ClientList';
import ClientDrawer from './components/ClientDrawer';

import { Agent, QueueCall, Recording, Evaluation, VisaClient, VisaStatus } from './types';
import { 
  initialAgents, 
  initialQueueCalls, 
  initialRecordings, 
  initialEvaluations,
  initialVisaClients 
} from './mockData';

export default function App() {
  // Base entities states
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [queueCalls, setQueueCalls] = useState<QueueCall[]>(initialQueueCalls);
  const [recordings, setRecordings] = useState<Recording[]>(initialRecordings);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations);
  const [clients, setClients] = useState<VisaClient[]>(initialVisaClients);

  // Layout navigation tabs (GoTravel Tickets manager by default)
  const [activeTab, setActiveTab] = useState<'tickets' | 'monitoring' | 'queues' | 'recordings' | 'quality'>('tickets');

  // Interactive header widgets
  const [webphoneConnected, setWebphoneConnected] = useState(true);
  const [dialpadOpen, setDialpadOpen] = useState(false);

  // Notifications system state
  const [notifications, setNotifications] = useState<string[]>([
    'Sistema GoTravel inicializado. 5 expedientes de visa cargados.',
    'Webphone registrado e inicializado correctamente.',
  ]);

  // Selected agent for details drawer
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Selected client for GoTravel details drawer
  const [selectedClient, setSelectedClient] = useState<VisaClient | null>(null);

  // Handler to update a client's visa status
  const handleUpdateClientStatus = (clientId: string, newStatus: VisaStatus) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, status: newStatus } : c));
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };


  // Add notification log
  const handleAddNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev].slice(0, 10)); // keep last 10
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Agent call control events from monitoring row
  const handleAgentClick = (agent: Agent) => {
    // Sync current agent data state
    const currentAgent = agents.find(a => a.id === agent.id) || agent;
    setSelectedAgent(currentAgent);
  };

  // Tick the entire system forward in real-time
  useEffect(() => {
    const timer = setInterval(() => {
      // Tick agents and call durations
      setAgents(prev => prev.map(agent => {
        let updatedCall = agent.activeCall;
        let updatedChat = agent.activeChat;

        if (updatedCall) {
          updatedCall = { ...updatedCall, duration: updatedCall.duration + 1 };
        }
        if (updatedChat) {
          updatedChat = { ...updatedChat, duration: updatedChat.duration + 1 };
        }

        return {
          ...agent,
          statusDuration: agent.statusDuration + 1,
          activeCall: updatedCall,
          activeChat: updatedChat,
        };
      }));

      // Tick queued calls
      setQueueCalls(prev => prev.map(call => ({
        ...call,
        waitingTime: call.waitingTime + 1
      })));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 flex antialiased">
      {/* 1. Global navigation left sidebar */}
      <Sidebar 
        activeSection="monitoring" 
        setActiveSection={() => {}} 
      />

      {/* 2. Top Header AppBar */}
      <Header 
        webphoneConnected={webphoneConnected}
        setWebphoneConnected={setWebphoneConnected}
        onOpenDialpad={() => setDialpadOpen(true)}
        notifications={notifications}
        onClearNotifications={handleClearNotifications}
      />

      {/* 3. Main Workspace Area */}
      <main className="ml-20 mt-16 p-6 w-[calc(100%-80px)] min-h-[calc(100vh-64px)] overflow-y-auto pb-24">
        {/* Navigation Tabs Bar */}
        <div className="mb-6 flex gap-2 border-b border-slate-200">
          <button 
            onClick={() => {
              setActiveTab('tickets');
              setSelectedAgent(null);
            }}
            className="px-4 py-2 text-sm font-bold border-b-2 border-amber-500 text-amber-600 transition-all cursor-pointer flex items-center gap-2"
            id="tab-btn-tickets"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Gestor de Tickets (GoTravel)
          </button>
        </div>

        {/* Tab content router */}
        <div className="relative animate-fade-in duration-300">
          <ClientList
            clients={clients}
            selectedClient={selectedClient}
            onClientClick={(client) => {
              setSelectedAgent(null);
              setSelectedClient(client);
            }}
          />
        </div>

      </main>

      {/* 4. Active Agent detail slide drawer */}
      {selectedAgent && (
        <AgentDrawer 
          agent={agents.find(a => a.id === selectedAgent.id) || selectedAgent}
          onClose={() => setSelectedAgent(null)}
          setAgents={setAgents}
          onAddNotification={handleAddNotification}
        />
      )}

      {/* 4b. Active Client detail slide drawer (GoTravel) */}
      {selectedClient && (
        <ClientDrawer
          client={clients.find(c => c.id === selectedClient.id) || selectedClient}
          onClose={() => setSelectedClient(null)}
          onUpdateStatus={handleUpdateClientStatus}
          onAddNotification={handleAddNotification}
        />
      )}


      {/* 5. Floating Interactive Dialpad Modal */}
      <DialpadModal 
        isOpen={dialpadOpen} 
        onClose={() => setDialpadOpen(false)} 
        onAddNotification={handleAddNotification}
      />

      {/* 6. Real-time Background Simulation Engine Controls */}
      <SimulationControls 
        agents={agents}
        setAgents={setAgents}
        queueCalls={queueCalls}
        setQueueCalls={setQueueCalls}
        onAddNotification={handleAddNotification}
      />
    </div>
  );
}
