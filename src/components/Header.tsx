import React, { useState, useEffect } from 'react';
import { Info, Globe, Bell, Grid3X3, Smile, LogOut, Shield, User, Settings } from 'lucide-react';

interface HeaderProps {
  webphoneConnected: boolean;
  setWebphoneConnected: (connected: boolean) => void;
  onOpenDialpad: () => void;
  notifications: string[];
  onClearNotifications: () => void;
}

export default function Header({ 
  webphoneConnected, 
  setWebphoneConnected, 
  onOpenDialpad,
  notifications,
  onClearNotifications
}: HeaderProps) {
  const [time, setTime] = useState<string>('20:49:15');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  // Tick the clock forward
  useEffect(() => {
    // Initialize with current time or a simulated time that updates
    const now = new Date();
    // Adjust to GMT-5 (Peru)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const peruTime = new Date(utc + (3600000 * -5));
    
    const format = (d: Date) => {
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      const s = d.getSeconds().toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    };

    setTime(format(peruTime));

    const interval = setInterval(() => {
      const t = new Date();
      const u = t.getTime() + (t.getTimezoneOffset() * 60000);
      const p = new Date(u + (3600000 * -5));
      setTime(format(p));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header id="top-header" className="flex justify-between items-center h-16 px-6 ml-20 w-[calc(100%-80px)] fixed top-0 right-0 z-40 bg-white border-b border-slate-200">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-xl font-bold text-slate-800 flex items-center gap-2">
          Supervisión 
          <span className="group relative cursor-pointer flex items-center justify-center">
            <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-64 p-2 bg-slate-800 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 leading-relaxed shadow-md font-normal">
              Monitorea estados, llamadas en curso y chats abiertos de agentes en tiempo real.
            </div>
          </span>
        </h1>
        
        {/* Toggleable Webphone status */}
        <button 
          onClick={() => setWebphoneConnected(!webphoneConnected)}
          id="webphone-toggle-badge"
          className={`text-xs font-medium px-2.5 py-1 rounded transition-all duration-300 shadow-sm border ${
            webphoneConnected 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-600 hover:bg-emerald-100' 
              : 'bg-rose-50 border-rose-300 text-rose-600 hover:bg-rose-100'
          }`}
        >
          {webphoneConnected ? 'Webphone conectado' : 'Webphone desconectado'}
        </button>
      </div>

      <div className="flex items-center gap-6">
        {/* GMT-5 Peru Clock */}
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Globe className="w-4 h-4 text-slate-400" />
          <span>Hora plataforma {time} (GMT-5) Perú</span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3">
          {/* Dialpad button */}
          <button 
            onClick={onOpenDialpad}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors border border-slate-100 relative group"
            title="Marcador telefónico"
            id="dialpad-header-btn"
          >
            <Grid3X3 className="w-5 h-5" />
            <div className="absolute right-0 top-12 px-2 py-1 bg-slate-800 text-white text-[10px] font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 shadow">
              Abrir Teclado
            </div>
          </button>

          {/* Notifications bell */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotificationsMenu(!showNotificationsMenu);
                setShowProfileMenu(false);
              }}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors border border-slate-100 relative"
              title="Notificaciones"
              id="notifications-bell-btn"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotificationsMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <span className="font-bold text-xs text-slate-700">Notificaciones Recientes</span>
                  {notifications.length > 0 && (
                    <button 
                      onClick={() => {
                        onClearNotifications();
                        setShowNotificationsMenu(false);
                      }} 
                      className="text-[10px] text-amber-600 hover:underline hover:text-amber-700"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs">
                      No hay notificaciones pendientes.
                    </div>
                  ) : (
                    notifications.map((notif, idx) => (
                      <div key={idx} className="p-3 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                        {notif}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User profile dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotificationsMenu(false);
            }}
            className="flex items-center gap-2 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
            id="profile-dropdown-trigger"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
              <Smile className="w-5 h-5" />
            </div>
            <div className="text-sm font-semibold text-slate-700 max-w-[80px] truncate">Sofhia</div>
            <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Simulated Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1">
              <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                <div className="font-bold text-xs text-slate-800">Sofhia Romero</div>
                <div className="text-[10px] text-slate-400">Supervisor de Calidad y Canales</div>
              </div>
              
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Mi Perfil
                </button>
                <button className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-slate-400" /> Preferencias
                </button>
                <button className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-slate-400" /> Ajustes de Seguridad
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
