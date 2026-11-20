import React from 'react';
import { BarChart3, Globe2, ShieldCheck, Sparkles, CalendarDays } from 'lucide-react';
import { VisaClient, VisaStatus } from '../types';

interface MetricsViewProps {
  clients: VisaClient[];
}

const stageDefinitions: Array<{
  key: string;
  label: string;
  statuses: VisaStatus[];
  accent: string;
  badge: string;
}> = [
  {
    key: 'evaluation',
    label: 'Evaluación Inicial',
    statuses: ['En Revisión'],
    accent: 'bg-sky-500',
    badge: 'bg-sky-100 text-sky-700',
  },
  {
    key: 'ds160',
    label: 'Llenando DS-160 / Portal',
    statuses: ['Llenando DS-160'],
    accent: 'bg-cyan-500',
    badge: 'bg-cyan-100 text-cyan-700',
  },
  {
    key: 'payment',
    label: 'Pago de Derechos Pendiente',
    statuses: ['Esperando Cita'],
    accent: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    key: 'appointment',
    label: 'Cita Programada',
    statuses: ['Cita Programada'],
    accent: 'bg-violet-500',
    badge: 'bg-violet-100 text-violet-700',
  },
  {
    key: 'final',
    label: 'Aprobados / Rechazados',
    statuses: ['Aprobado', 'Rechazado'],
    accent: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
  },
];

export default function MetricsView({ clients }: MetricsViewProps) {
  const totalActive = clients.length;
  const usaCount = clients.filter((client) => client.visaType === 'Visa USA').length;
  const canadaCount = clients.filter((client) => client.visaType === 'Visa Canadá').length;
  const approvedCount = clients.filter((client) => client.status === 'Aprobado').length;
  const rejectedCount = clients.filter((client) => client.status === 'Rechazado').length;
  const approvalRate = totalActive > 0 ? Math.round((approvedCount / totalActive) * 100) : 0;

  const stageCards = stageDefinitions.map((stage) => {
    const count = clients.filter((client) => stage.statuses.includes(client.status)).length;
    const progress = totalActive > 0 ? Math.round((count / totalActive) * 100) : 0;

    return {
      ...stage,
      count,
      progress,
    };
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">GoTravel Metrics</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Dashboard de expedientes de turismo</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Visualiza el estado actual de tus clientes de Visa USA y Visa Canadá con métricas clave, distribución de casos y el pipeline de aprobación.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Actualizado en tiempo real</p>
            <p className="text-xs text-slate-500">Basado en el estado actual de los expedientes</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.8fr_1.2fr]">
        <div className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Expedientes activos</p>
                <p className="mt-4 text-4xl font-semibold text-slate-900">{totalActive}</p>
              </div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">Casos de visas actualmente en gestión dentro de GoTravel.</p>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Distribución de visas</p>
                <div className="mt-3 space-y-3">
                  <div className="rounded-3xl bg-slate-100 p-3">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-900">Visa USA</div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-sky-500" style={{ width: `${totalActive ? Math.round((usaCount / totalActive) * 100) : 0}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{usaCount} expedientes</p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 p-3">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-900">Visa Canadá</div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-rose-500" style={{ width: `${totalActive ? Math.round((canadaCount / totalActive) * 100) : 0}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{canadaCount} expedientes</p>
                  </div>
                </div>
              </div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Globe2 className="h-6 w-6" />
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Tasa de éxito estimada</p>
                <p className="mt-4 text-4xl font-semibold text-slate-900">{approvalRate}%</p>
              </div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">Proporción de expedientes aprobados frente al total de casos activos.</p>
          </article>
        </div>

        <div className="grid gap-4">
          <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Resumen rápido</p>
                <p className="mt-4 text-xl font-semibold text-slate-900">Pipeline por etapas</p>
              </div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <CalendarDays className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {stageCards.map((stage) => (
                <div key={stage.key} className="rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{stage.label}</p>
                      <p className="mt-1 text-3xl font-semibold text-slate-900">{stage.count}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${stage.badge}`}>Etapa</span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className={`h-2 rounded-full ${stage.accent}`} style={{ width: `${stage.progress}%` }} />
                  </div>
                  {stage.key === 'final' && (
                    <p className="mt-3 text-sm text-slate-500">
                      Aprobados: <span className="font-semibold text-slate-900">{approvedCount}</span> · Rechazados: <span className="font-semibold text-slate-900">{rejectedCount}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Insights de gestión</p>
                <p className="mt-4 text-xl font-semibold text-slate-900">Casos clave</p>
              </div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <p className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                {usaCount >= canadaCount
                  ? 'EE.UU. lidera la demanda actual con más expedientes abiertos.'
                  : 'Canadá ganando tracción con solicitudes activas en el pipeline.'}
              </p>
              <p className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                {approvedCount > 0
                  ? `¡${approvedCount} expedientes ya han sido aprobados! Mantén el seguimiento para convertir los casos pendientes.`
                  : 'Aún no hay aprobaciones registradas en el pipeline actual.'}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
