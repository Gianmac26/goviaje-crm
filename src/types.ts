export enum AgentStatus {
  CONECTADO = 'Conectado',
  ALMUERZO = 'Almuerzo',
  PAUSA = 'Pausa',
  BANO = 'Baño',
  DESCONECTADO = 'Desconectado',
}

export interface ActiveCall {
  phone: string;
  type: 'Predictivo' | 'Progresivo' | 'Manual' | 'Entrante';
  duration: number; // in seconds
  status: 'hablando' | 'retener' | 'finalizado';
}

export interface ActiveChat {
  id: string;
  contactName: string;
  phoneOrChannel: string;
  platform: 'WhatsApp' | 'Telegram' | 'WebChat' | 'Facebook';
  lastMessage: string;
  duration: number; // in seconds
}

export interface Agent {
  id: string;
  extension: string;
  name: string;
  role: 'Agente' | 'Administrador' | 'Supervisor';
  status: AgentStatus;
  statusDuration: number; // in seconds
  module: string;
  moduleDetails?: string;
  activeTickets: number;
  activeStrategies: string;
  activeCall?: ActiveCall;
  activeChat?: ActiveChat;
}

export interface QueueCall {
  id: string;
  phone: string;
  waitingTime: number; // in seconds
  campaign: string;
  priority: 'Alta' | 'Media' | 'Baja';
  state: 'En espera' | 'Asignando';
}

export interface Recording {
  id: string;
  phone: string;
  agentName: string;
  campaign: string;
  duration: number; // in seconds
  date: string;
  time: string;
  sentiment: 'Positivo' | 'Neutro' | 'Negativo';
  url: string;
}

export interface Evaluation {
  id: string;
  agentId: string;
  agentName: string;
  evaluator: string;
  date: string;
  score: number; // 0-100
  feedback: string;
  criteria: {
    greeting: number; // 0-20
    listening: number; // 0-20
    solution: number; // 0-20
    professionalism: number; // 0-20
    closing: number; // 0-20
  };
}

export type VisaType = 'Visa USA' | 'Visa Canadá';

export type VisaStatus = 
  | 'Llenando DS-160'
  | 'Esperando Cita'
  | 'Cita Programada'
  | 'Aprobado'
  | 'En Revisión'
  | 'Rechazado';

export interface VisaClient {
  id: string;
  name: string;
  visaType: VisaType;
  status: VisaStatus;
  interviewDate: string; // YYYY-MM-DD format or human readable string
  interviewTime?: string; // e.g. "08:30 AM"
  embassyLocation?: string; // e.g. "Embajada de EE.UU. en Lima"
  passportNumber: string;
  email: string;
  phone: string;
  assignedAgent: string;
  ds160Code?: string;
  notes?: string;
}


