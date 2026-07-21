import React, { useState } from 'react';
import { X, Delete, Phone, PhoneOff, Grid3X3, Clock } from 'lucide-react';

interface DialpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNotification: (msg: string) => void;
}

export default function DialpadModal({ isOpen, onClose, onAddNotification }: DialpadModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Timer interval reference
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Keyboard layout
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  const handleKeyPress = (val: string) => {
    if (isCalling) return;
    if (phoneNumber.length < 15) {
      setPhoneNumber(prev => prev + val);
    }
  };

  const handleBackspace = () => {
    if (isCalling) return;
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (!phoneNumber) return;
    setIsCalling(true);
    setCallDuration(0);
    onAddNotification(`Iniciando llamada saliente al número: ${phoneNumber}`);

    // Tick the call duration up
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const handleHangUp = () => {
    setIsCalling(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onAddNotification(`Llamada con ${phoneNumber} finalizada. Duración: ${callDuration}s`);
    setPhoneNumber('');
    setCallDuration(0);
  };

  const formatSecs = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div id="dialpad-modal-root" className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full overflow-hidden p-6 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <Grid3X3 className="w-4 h-4 text-amber-500" /> Webphone Teclado
          </h3>
          <button 
            onClick={onClose}
            disabled={isCalling}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            id="close-dialpad-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center min-h-[72px] mb-6 relative">
          {isCalling ? (
            <div className="text-center space-y-1 animate-pulse">
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Hablando...
              </span>
              <div className="font-mono font-bold text-slate-800 text-lg">{phoneNumber}</div>
              <div className="text-slate-400 font-mono text-xs flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" /> {formatSecs(callDuration)}
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between">
              <div className="font-mono font-bold text-slate-700 text-xl tracking-wide truncate flex-1 text-center select-all">
                {phoneNumber || <span className="text-slate-300">Marcar número</span>}
              </div>
              {phoneNumber && (
                <button 
                  onClick={handleBackspace}
                  className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                  id="dialpad-backspace"
                >
                  <Delete className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Numeric Keys Layout */}
        <div className="grid grid-cols-3 gap-3 justify-items-center mb-6">
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              disabled={isCalling}
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center text-lg font-bold transition-all ${
                isCalling 
                  ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 active:scale-95 cursor-pointer shadow-xs border border-slate-100'
              }`}
              id={`dialpad-key-${key}`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          {isCalling ? (
            <button
              onClick={handleHangUp}
              className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              id="hangup-action-btn"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={handleCall}
              disabled={!phoneNumber}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-all ${
                phoneNumber 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-105 active:scale-95 cursor-pointer' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
              id="call-action-btn"
            >
              <Phone className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
