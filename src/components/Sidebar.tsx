import React from 'react';
import { 
  LineChart, 
  Eye, 
  UserCircle, 
  Rocket, 
  GitBranch, 
  Globe, 
  Mail, 
  Grid, 
  Radio, 
  Calendar, 
  Settings 
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onSelectClients?: () => void;
  onSelectCalendar?: () => void;
}

export default function Sidebar({ activeSection, setActiveSection, onSelectClients, onSelectCalendar }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LineChart, label: 'Métricas' },
    { id: 'monitoring', icon: Eye, label: 'Monitoreo' },
    { id: 'users', icon: UserCircle, label: 'Usuarios' },
    { id: 'rocket', icon: Rocket, label: 'Campañas' },
    { id: 'workflow', icon: GitBranch, label: 'Flujos' },
    { id: 'planet', icon: Globe, label: 'Páginas' },
    { id: 'messages', icon: Mail, label: 'Mensajes' },
    { id: 'grid', icon: Grid, label: 'Módulos' },
    { id: 'radio', icon: Radio, label: 'Canales' },
    { id: 'calendar', icon: Calendar, label: 'Calendario' },
  ];

  return (
    <aside id="sidebar" className="fixed top-0 left-0 h-screen w-20 flex flex-col py-4 bg-white border-r border-slate-200 z-50">
      {/* Brand logo */}
      <div className="flex flex-col items-center gap-6 mb-8 mt-2">
        <button 
          onClick={() => {
            setActiveSection('dashboard');
            onSelectClients?.();
          }}
          className="w-10 h-10 flex items-center justify-center bg-amber-500 rounded-xl text-white shadow-sm hover:scale-105 transition-transform cursor-pointer"
          title="GoTravel Home"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L22 8V16L12 22L2 16V8L12 2ZM12 4.3L4 9.1V14.9L12 19.7L20 14.9V9.1L12 4.3Z"></path>
          </svg>
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col items-center gap-3 w-full px-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id || (activeSection === 'tickets' && index === 0);

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'dashboard') {
                  setActiveSection('dashboard');
                  onSelectClients?.();
                  return;
                }

                if (item.id === 'calendar') {
                  setActiveSection('calendar');
                  onSelectCalendar?.();
                  return;
                }

                setActiveSection(item.id);
              }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 relative group cursor-pointer ${
                isActive 
                  ? 'bg-amber-400 text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
              title={item.label}
              id={`sidebar-btn-${item.id}`}
            >
              <Icon className="w-5 h-5 stroke-[2]" />
              
              {/* Tooltip */}
              <div className="absolute left-16 px-2 py-1 bg-slate-800 text-white text-[10px] font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 shadow">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Settings at the bottom */}
      <div className="mt-auto flex flex-col items-center gap-4 pt-4 border-t border-slate-100">
        <button
          onClick={() => setActiveSection('tickets')}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all duration-200 group relative cursor-pointer"
          title="Configuración"
          id="sidebar-btn-settings"
        >
          <Settings className="w-5 h-5 stroke-[2]" />
          <div className="absolute left-16 px-2 py-1 bg-slate-800 text-white text-[10px] font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 shadow">
            Configuración
          </div>
        </button>
      </div>
    </aside>
  );
}
