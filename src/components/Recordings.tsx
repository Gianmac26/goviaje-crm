import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Search, 
  ChevronDown, 
  Clock, 
  Smile, 
  Meh, 
  Frown, 
  X, 
  Maximize2,
  ListRestart
} from 'lucide-react';
import { Recording } from '../types';

interface RecordingsProps {
  recordings: Recording[];
}

// Simulated transcripts based on sentiment
const mockTranscripts: Record<string, Array<{ speaker: 'Agente' | 'Cliente'; text: string; sentiment: 'Positivo' | 'Neutro' | 'Negativo' }>> = {
  'rec-1': [
    { speaker: 'Agente', text: 'Hola, buenas tardes. Le saluda Juan de Gotravel Latam, ¿con quién tengo el gusto?', sentiment: 'Positivo' },
    { speaker: 'Cliente', text: 'Hola, sí, hablas con Sara. Llamaba para confirmar el estado de mi reserva de vuelo a Lima.', sentiment: 'Neutro' },
    { speaker: 'Agente', text: 'Excelente, Sra. Sara. Permítame un momento por favor en lo que busco su registro en el sistema.', sentiment: 'Positivo' },
    { speaker: 'Agente', text: 'Listo, confirmo que su reserva ya está totalmente emitida e incluye equipaje de mano de 10kg.', sentiment: 'Positivo' },
    { speaker: 'Cliente', text: '¡Excelente! Muchísimas gracias, la atención fue súper rápida y clara.', sentiment: 'Positivo' }
  ],
  'rec-2': [
    { speaker: 'Agente', text: 'Canal de soporte técnico, le habla María Romero. ¿En qué le puedo asistir?', sentiment: 'Neutro' },
    { speaker: 'Cliente', text: 'Hola, tengo problemas para iniciar sesión en la app, me sale error de autenticación.', sentiment: 'Negativo' },
    { speaker: 'Agente', text: 'Entiendo el inconveniente. Vamos a revisar si su usuario está bloqueado o si requiere un cambio de clave.', sentiment: 'Neutro' },
    { speaker: 'Cliente', text: 'Ok, ya introduje mi correo. ¿Qué paso sigue?', sentiment: 'Neutro' },
    { speaker: 'Agente', text: 'Le acabo de enviar un enlace de recuperación. Por favor revise su bandeja de entrada.', sentiment: 'Positivo' },
    { speaker: 'Cliente', text: 'Ah listo, ya me llegó. Ya pude entrar. Gracias.', sentiment: 'Positivo' }
  ],
  'rec-3': [
    { speaker: 'Agente', text: 'Hola, buenas tardes, le saluda José Alva del departamento de cobranzas.', sentiment: 'Neutro' },
    { speaker: 'Cliente', text: 'Miren, ya les dije que yo pagué mi factura el viernes y me siguen llamando a cobrar, es muy molesto.', sentiment: 'Negativo' },
    { speaker: 'Agente', text: 'Disculpe las molestias. Déjeme validar la transacción. ¿Tiene el número de operación?', sentiment: 'Neutro' },
    { speaker: 'Cliente', text: 'No lo tengo a la mano ahora, pero envié el voucher por correo electrónico.', sentiment: 'Negativo' },
    { speaker: 'Agente', text: 'Comprendo. En este caso voy a dejar una anotación en su ficha para pausar las llamadas preventivas mientras procesamos el pago.', sentiment: 'Neutro' }
  ]
};

const defaultTranscript = [
  { speaker: 'Agente', text: 'Hola, buenas tardes, ¿en qué le puedo colaborar hoy?', sentiment: 'Positivo' as const },
  { speaker: 'Cliente', text: 'Hola, quería consultar sobre los planes y precios vigentes.', sentiment: 'Neutro' as const },
  { speaker: 'Agente', text: 'Con gusto. Le comento que tenemos un plan básico de $20 mensuales y el plan corporativo.', sentiment: 'Positivo' as const }
];

export default function Recordings({ recordings }: RecordingsProps) {
  const [search, setSearch] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('Todos');
  const [selectedCampaign, setSelectedCampaign] = useState('Todas');
  
  // Player state
  const [playingRec, setPlayingRec] = useState<Recording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');

  // Increment player progress mock
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && playingRec) {
      interval = setInterval(() => {
        setPlayProgress(prev => {
          if (prev >= playingRec.duration) {
            setIsPlaying(false);
            return 0;
          }
          const speedFactor = parseFloat(playbackSpeed);
          return Math.min(playingRec.duration, prev + speedFactor);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playingRec, playbackSpeed]);

  const formatSecs = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.round(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlayRecording = (rec: Recording) => {
    setPlayingRec(rec);
    setIsPlaying(true);
    setPlayProgress(0);
  };

  // Filtered recordings
  const filteredRecordings = recordings.filter(rec => {
    const matchesSearch = rec.phone.includes(search) || 
                          rec.agentName.toLowerCase().includes(search.toLowerCase());
    
    const matchesSentiment = selectedSentiment === 'Todos' || rec.sentiment === selectedSentiment;
    const matchesCampaign = selectedCampaign === 'Todas' || rec.campaign === selectedCampaign;

    return matchesSearch && matchesSentiment && matchesCampaign;
  });

  const activeTranscript = playingRec ? (mockTranscripts[playingRec.id] || defaultTranscript) : [];

  return (
    <div id="recordings-root" className="space-y-6">
      {/* Search & Filter Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-display font-bold text-slate-800 text-xs mb-4">Buscar y Auditar Grabaciones</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por teléfono o agente..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
              id="recording-search"
            />
          </div>

          {/* Sentiment Filter */}
          <div className="relative">
            <select 
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
              id="recording-sentiment"
            >
              <option value="Todos">Cualquier Sentimiento</option>
              <option value="Positivo">Sentimiento Positivo</option>
              <option value="Neutro">Sentimiento Neutro</option>
              <option value="Negativo">Sentimiento Negativo</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Campaign Filter */}
          <div className="relative">
            <select 
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
              id="recording-campaign"
            >
              <option value="Todas">Todas las Campañas</option>
              <option value="Campañas de Ventas">Campañas de Ventas</option>
              <option value="Soporte Técnico">Soporte Técnico</option>
              <option value="Cobranzas">Cobranzas</option>
              <option value="Fidelización de Clientes">Fidelización de Clientes</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main recordings list table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 bg-slate-50/70 select-none">
                <th className="py-3 px-6">Fecha / Hora</th>
                <th className="py-3 px-4">Teléfono Cliente</th>
                <th className="py-3 px-4">Agente Evaluado</th>
                <th className="py-3 px-4">Campaña</th>
                <th className="py-3 px-4 text-center">Duración</th>
                <th className="py-3 px-4 text-center">IA Sentiment</th>
                <th className="py-3 px-6 text-right">Escucha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRecordings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    No se encontraron grabaciones con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredRecordings.map((rec) => {
                  let sentColor = 'text-slate-500 bg-slate-100 border-slate-200';
                  let SentIcon = Meh;
                  if (rec.sentiment === 'Positivo') {
                    sentColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
                    SentIcon = Smile;
                  } else if (rec.sentiment === 'Negativo') {
                    sentColor = 'text-rose-700 bg-rose-50 border-rose-200';
                    SentIcon = Frown;
                  }

                  const isCurrentlyPlaying = playingRec?.id === rec.id;

                  return (
                    <tr 
                      key={rec.id} 
                      className={`hover:bg-slate-50/40 transition-colors ${isCurrentlyPlaying ? 'bg-blue-50/30' : ''}`}
                    >
                      <td className="py-4 px-6 text-slate-500 font-medium">
                        {rec.date} <span className="text-[10px] text-slate-400 block mt-0.5">{rec.time}</span>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-700">
                        {rec.phone}
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-semibold">
                        {rec.agentName}
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-medium">
                        {rec.campaign}
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-slate-500">
                        {formatSecs(rec.duration)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold inline-flex items-center gap-1 border ${sentColor}`}>
                          <SentIcon className="w-3 h-3" />
                          {rec.sentiment}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => handlePlayRecording(rec)}
                          className={`p-1.5 rounded-lg border transition-all hover:scale-105 cursor-pointer ${
                            isCurrentlyPlaying 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                          title="Reproducir audio"
                          id={`play-btn-${rec.id}`}
                        >
                          <Play className="w-3.5 h-3.5" />
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

      {/* Player and Transcript tray layout */}
      {playingRec && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900 text-white rounded-xl shadow-xl p-6 border border-slate-800 transition-all">
          
          {/* Column 1: Playback control panel */}
          <div className="lg:col-span-5 space-y-4 border-r border-slate-800 pr-0 lg:pr-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Reproductor de Auditoría</span>
                <h4 className="font-display font-bold text-sm text-slate-200 mt-1">{playingRec.phone}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Agente: {playingRec.agentName} • {playingRec.campaign}</p>
              </div>
              <button 
                onClick={() => {
                  setIsPlaying(false);
                  setPlayingRec(null);
                }}
                className="text-slate-500 hover:text-slate-300 transition-colors"
                id="close-player-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Animated Waveform */}
            <div className="h-16 bg-slate-950 rounded-lg flex items-center justify-center gap-[3px] px-4 overflow-hidden relative">
              {Array.from({ length: 44 }).map((_, idx) => {
                // Generate a randomized static waveline but animate height if isPlaying
                const defaultHeight = Math.abs(Math.sin(idx * 0.15)) * 36 + 6;
                return (
                  <div 
                    key={idx} 
                    className={`w-[3px] bg-blue-500 rounded-full transition-all duration-300 ${
                      isPlaying ? 'animate-pulse' : ''
                    }`} 
                    style={{ 
                      height: `${defaultHeight}px`,
                      opacity: isPlaying ? 0.8 : 0.4,
                      animationDelay: `${idx * 0.03}s`
                    }} 
                  />
                );
              })}
              {/* Progress overlay bar */}
              <div 
                className="absolute left-0 top-0 bottom-0 bg-blue-600/10 pointer-events-none transition-all duration-300"
                style={{ width: `${(playProgress / playingRec.duration) * 100}%` }}
              />
            </div>

            {/* Playback Progress Slider */}
            <div className="space-y-1">
              <input 
                type="range" 
                min={0} 
                max={playingRec.duration} 
                value={Math.round(playProgress)} 
                onChange={(e) => setPlayProgress(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
              />
              <div className="flex justify-between font-mono text-[9px] text-slate-400">
                <span>{formatSecs(playProgress)}</span>
                <span>{formatSecs(playingRec.duration)}</span>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Play/Pause Button */}
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all hover:scale-105 shadow cursor-pointer"
                  id="player-play-pause"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                {/* Volume icon and slider */}
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-white">
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input 
                    type="range" 
                    min={0} 
                    max={100} 
                    value={isMuted ? 0 : volume} 
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>

              {/* Playback speed multiplier */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span>Velocidad</span>
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(e.target.value)}
                  className="bg-slate-800 text-white px-2 py-1 rounded border border-slate-700 text-[10px] outline-none"
                >
                  <option value="1x">1.0x</option>
                  <option value="1.25x">1.25x</option>
                  <option value="1.5x">1.5x</option>
                  <option value="2x">2.0x</option>
                </select>
              </div>
            </div>
          </div>

          {/* Column 2: Transcript with Sentiment Tagging */}
          <div className="lg:col-span-7 flex flex-col h-72">
            <h5 className="font-display font-bold text-xs text-slate-300 flex items-center gap-2 mb-3">
              <Maximize2 className="w-3.5 h-3.5 text-blue-400" /> Transcripción de Voz IA & Análisis de Sentimiento
            </h5>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide bg-slate-950/60 p-4 rounded-lg">
              {activeTranscript.map((bubble, idx) => {
                const isAgent = bubble.speaker === 'Agente';
                
                let sentDot = 'bg-slate-400';
                if (bubble.sentiment === 'Positivo') sentDot = 'bg-emerald-500';
                else if (bubble.sentiment === 'Negativo') sentDot = 'bg-rose-500';

                return (
                  <div 
                    key={idx} 
                    className={`flex flex-col max-w-[85%] ${isAgent ? 'mr-auto items-start' : 'ml-auto items-end'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] font-bold text-slate-400">{bubble.speaker}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${sentDot}`} title={`Sentimiento: ${bubble.sentiment}`} />
                    </div>
                    <div className={`p-2.5 rounded-xl text-[11px] leading-relaxed ${
                      isAgent 
                        ? 'bg-slate-800 text-slate-100 rounded-tl-none' 
                        : 'bg-blue-900/40 text-blue-100 rounded-tr-none border border-blue-900/50'
                    }`}>
                      {bubble.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
