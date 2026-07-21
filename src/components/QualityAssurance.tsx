import React, { useState } from 'react';
import { 
  Award, 
  User, 
  FileText, 
  ShieldCheck, 
  Plus, 
  Bookmark, 
  Trash2, 
  Activity,
  AlertTriangle,
  Smile
} from 'lucide-react';
import { Agent, Evaluation } from '../types';

interface QualityAssuranceProps {
  agents: Agent[];
  evaluations: Evaluation[];
  setEvaluations: React.Dispatch<React.SetStateAction<Evaluation[]>>;
  onAddNotification: (msg: string) => void;
}

export default function QualityAssurance({ 
  agents, 
  evaluations, 
  setEvaluations,
  onAddNotification
}: QualityAssuranceProps) {
  // Evaluation form states
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || '');
  const [greeting, setGreeting] = useState(15);
  const [listening, setListening] = useState(15);
  const [solution, setSolution] = useState(15);
  const [professionalism, setProfessionalism] = useState(15);
  const [closing, setClosing] = useState(15);
  const [feedback, setFeedback] = useState('');

  // Calculate dynamic score sum
  const currentTotal = greeting + listening + solution + professionalism + closing;

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentId) return;

    const agent = agents.find(a => a.id === selectedAgentId);
    if (!agent) return;

    const newEval: Evaluation = {
      id: `eval-${Date.now()}`,
      agentId: selectedAgentId,
      agentName: agent.name,
      evaluator: 'Sofhia',
      date: new Date().toISOString().split('T')[0],
      score: currentTotal,
      feedback: feedback.trim() || 'Desempeño aceptable alineado con los estándares del servicio.',
      criteria: {
        greeting,
        listening,
        solution,
        professionalism,
        closing
      }
    };

    setEvaluations([newEval, ...evaluations]);
    onAddNotification(`Nueva evaluación de calidad guardada para ${agent.name} (${currentTotal}%)`);

    // Reset some states
    setFeedback('');
    setGreeting(15);
    setListening(15);
    setSolution(15);
    setProfessionalism(15);
    setClosing(15);
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'Excelente', bar: 'bg-emerald-500' };
    if (score >= 70) return { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'Aceptable', bar: 'bg-amber-500' };
    return { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'Crítico', bar: 'bg-rose-500' };
  };

  return (
    <div id="quality-assurance-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Column 1: Evaluation Form Panel */}
      <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <Award className="w-4 h-4 text-blue-500" /> Formulario de Auditoría de Llamada y Chat
        </h3>

        <form onSubmit={handleSaveEvaluation} className="space-y-5">
          {/* Select Agent to Audit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Agente Evaluado</label>
              <div className="relative">
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white appearance-none"
                  id="quality-agent-select"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.extension})</option>
                  ))}
                </select>
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Plus className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Auditor Responsable</label>
              <div className="w-full px-3 py-2 border border-slate-100 bg-slate-50 text-slate-500 text-xs rounded-lg font-medium">
                Sofhia (Supervisor de Calidad)
              </div>
            </div>
          </div>

          {/* SLA sliders criteria */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Criterios de Evaluación (Máximo 20 puntos por criterio)</h4>
            
            {/* Criterion 1 */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">1. Saludo Inicial y Apertura</span>
                <span className="font-mono font-bold text-slate-500">{greeting} / 20</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={20} 
                value={greeting} 
                onChange={(e) => setGreeting(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Criterion 2 */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">2. Escucha Activa e Indagación</span>
                <span className="font-mono font-bold text-slate-500">{listening} / 20</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={20} 
                value={listening} 
                onChange={(e) => setListening(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Criterion 3 */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">3. Solución y Resolución Técnica</span>
                <span className="font-mono font-bold text-slate-500">{solution} / 20</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={20} 
                value={solution} 
                onChange={(e) => setSolution(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Criterion 4 */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">4. Profesionalismo y Tono de Voz</span>
                <span className="font-mono font-bold text-slate-500">{professionalism} / 20</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={20} 
                value={professionalism} 
                onChange={(e) => setProfessionalism(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Criterion 5 */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">5. Cierre y Confirmación de Solución</span>
                <span className="font-mono font-bold text-slate-500">{closing} / 20</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={20} 
                value={closing} 
                onChange={(e) => setClosing(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Comentarios de Calidad y Feedback para Coaching</label>
            <textarea
              rows={3}
              placeholder="Describa fortalezas, debilidades y oportunidades de mejora identificadas en la llamada..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/20"
            />
          </div>

          {/* Form save */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs transition-all shadow-sm"
            id="quality-submit-btn"
          >
            Guardar Evaluación de Calidad
          </button>
        </form>
      </div>

      {/* Column 2: Live Score Indicator & Historic lists */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Realtime Score Meter Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center space-y-4">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Puntaje Estimado</span>
          
          {/* Animated Big Number Ring */}
          <div className="inline-flex flex-col items-center justify-center relative w-28 h-28 border-[6px] border-slate-100 rounded-full">
            {/* Score sum */}
            <span className="font-display font-extrabold text-slate-800 text-3xl">{currentTotal}%</span>
            
            {/* Score label based on status */}
            <span className={`text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded-full border ${getScoreColor(currentTotal).bg}`}>
              {getScoreColor(currentTotal).text}
            </span>
          </div>

          {/* Score rating summary bars */}
          <div className="space-y-1.5 text-left text-[11px] pt-3 border-t border-slate-50">
            <div className="flex justify-between text-slate-500">
              <span>Excelente: 90% - 100%</span>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mt-0.5" />
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Aceptable: 70% - 89%</span>
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full mt-0.5" />
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Crítico: Menos de 70%</span>
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full mt-0.5" />
            </div>
          </div>
        </div>

        {/* Historic lists */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-2 border-b border-slate-50 pb-2">
            <Bookmark className="w-4 h-4 text-amber-500" /> Registro Histórico de Auditorías
          </h3>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {evaluations.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No se han registrado evaluaciones todavía.
              </div>
            ) : (
              evaluations.map((evalItem) => {
                const colors = getScoreColor(evalItem.score);
                return (
                  <div 
                    key={evalItem.id} 
                    className="p-3 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors space-y-2 bg-slate-50/40"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-800 text-xs block">{evalItem.agentName}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">{evalItem.date} • Evaluador: {evalItem.evaluator}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${colors.bg}`}>
                        {evalItem.score}%
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 italic line-clamp-2 leading-relaxed">
                      "{evalItem.feedback}"
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
