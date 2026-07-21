import React, { useState } from 'react';
import { X, Calendar, Phone, Mail, FileText, UserCheck, ShieldCheck, CheckCircle2, Clock, AlertCircle, Send, Edit3 } from 'lucide-react';
import { VisaClient, VisaStatus } from '../types';

interface ClientDrawerProps {
  client: VisaClient | null;
  onClose: () => void;
  onUpdateStatus: (clientId: string, newStatus: VisaStatus) => void;
  onAddNotification: (msg: string) => void;
}

export default function ClientDrawer({
  client,
  onClose,
  onUpdateStatus,
  onAddNotification
}: ClientDrawerProps) {
  const [newNote, setNewNote] = useState('');

  if (!client) return null;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as VisaStatus;
    onUpdateStatus(client.id, nextStatus);
    onAddNotification(`Estado del trámite de ${client.name} actualizado a "${nextStatus}"`);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNotification(`Nota agregada a ${client.name}: "${newNote}"`);
    alert(`Nota guardada correctamente para ${client.name}`);
    setNewNote('');
  };

  return (
    <>
      {/* Semi-transparent backdrop overlay */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-[90] animate-fade-in"
      />

      {/* Slide-in Drawer Panel */}
      <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-200 shadow-2xl z-[100] flex flex-col animate-slide-in">

      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
            GT
          </div>
          <div>
            <h3 className="font-bold text-sm">Ficha del Cliente</h3>
            <p className="text-[11px] text-slate-400">Detalles de Visado GoTravel</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100 relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md mb-3">
            {client.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <h2 className="text-lg font-bold text-slate-900">{client.name}</h2>
          
          {/* Badges */}
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              client.visaType === 'Visa USA' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {client.visaType === 'Visa USA' ? '🇺🇸 Visa USA' : '🇨🇦 Visa Canadá'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
              {client.status}
            </span>
          </div>
        </div>

        {/* Featured Date Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-white shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-[11px] text-amber-100 uppercase tracking-wider font-semibold">Fecha de Entrevista</div>
            <div className="text-base font-bold">{client.interviewDate}</div>
          </div>
        </div>

        {/* Technical Data Fields */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Datos del Expediente</h4>
          
          <div className="bg-slate-50 p-3.5 rounded-xl space-y-2.5 border border-slate-100 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Pasaporte:</span>
              <span className="font-semibold text-slate-900">{client.passportNumber}</span>
            </div>

            {client.ds160Code && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Código DS-160:</span>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {client.ds160Code}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Teléfono:</span>
              <span className="font-medium text-slate-900">{client.phone}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Email:</span>
              <span className="font-medium text-slate-900 truncate max-w-[180px]">{client.email}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
              <span className="text-slate-500">Asesor Responsable:</span>
              <span className="font-medium text-indigo-700">{client.assignedAgent}</span>
            </div>
          </div>
        </div>

        {/* Change Status Widget */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Actualizar Estado del Trámite
          </label>
          <select
            value={client.status}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 text-slate-800 cursor-pointer shadow-sm"
          >
            <option value="Llenando DS-160">Llenando DS-160</option>
            <option value="Esperando Cita">Esperando Cita</option>
            <option value="Cita Programada">Cita Programada</option>
            <option value="En Revisión">En Revisión</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>

        {/* Notes & Observaciones */}
        {client.notes && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Observaciones</h4>
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
              {client.notes}
            </div>
          </div>
        )}

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Agregar Nota de Seguimiento
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Escribe una observación..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
        <button
          onClick={() => {
            onAddNotification(`Mensaje de WhatsApp preparado para ${client.name} (${client.phone})`);
            alert(`Abriendo canal de comunicación con ${client.name}...`);
          }}
          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5" />
          Contactar WhatsApp
        </button>

        <button
          onClick={onClose}
          className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          Cerrar
        </button>
      </div>
    </div>
    </>
  );
}

