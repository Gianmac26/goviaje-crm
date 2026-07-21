import { Agent, AgentStatus, QueueCall, Recording, Evaluation, VisaClient } from './types';

export const companies = [
  'Todas las empresas',
  'Score Cloud Perú',
  'Gotravel Latam',
  'Finanzas Plus',
  'Soporte Premium'
];

export const campaigns = [
  'Todas las campañas',
  'Campañas de Ventas',
  'Soporte Técnico',
  'Fidelización de Clientes',
  'Cobranzas'
];

export const initialAgents: Agent[] = [
  {
    id: 'agent-12',
    extension: '012',
    name: 'Juan Pablo Cordova Castillo',
    role: 'Agente',
    status: AgentStatus.CONECTADO,
    statusDuration: 25290, // 07:01:30
    module: 'Gestor de tickets',
    activeTickets: 20,
    activeStrategies: 'Marcador predictivo',
    activeCall: {
      phone: '+51 950 398 122',
      type: 'Predictivo',
      duration: 23,
      status: 'hablando'
    },
    activeChat: {
      id: 'chat-1',
      contactName: 'Sara Mendoza Aguirre',
      phoneOrChannel: '+51 950 398 122',
      platform: 'WhatsApp',
      lastMessage: 'Quiero consultar sobre mi ticket anterior.',
      duration: 45
    }
  },
  {
    id: 'agent-13',
    extension: '013',
    name: 'María Andrea Romero Angulo',
    role: 'Administrador',
    status: AgentStatus.CONECTADO,
    statusDuration: 29169, // 08:06:09
    module: 'Canales',
    moduleDetails: '(Mis canales)',
    activeTickets: 25,
    activeStrategies: 'Marcador predictivo',
    activeCall: {
      phone: '+51 994 589 230',
      type: 'Predictivo',
      duration: 5,
      status: 'hablando'
    },
    activeChat: {
      id: 'chat-2',
      contactName: 'Carlos Alvarado Carpio',
      phoneOrChannel: 'El comercio oficial',
      platform: 'Telegram',
      lastMessage: 'Confirmado el envío de la cotización.',
      duration: 120
    }
  },
  {
    id: 'agent-14',
    extension: '014',
    name: 'José Ricardo Alva Campos',
    role: 'Agente',
    status: AgentStatus.CONECTADO,
    statusDuration: 26404, // 07:20:04
    module: 'Gestión de usuario',
    moduleDetails: '(Creación de perfiles)',
    activeTickets: 30,
    activeStrategies: 'Marcador progresivo - IVR',
    activeCall: {
      phone: '+51 982 992 011',
      type: 'Progresivo',
      duration: 26,
      status: 'hablando'
    },
    activeChat: {
      id: 'chat-3',
      contactName: 'Juana Magdalena Puertas',
      phoneOrChannel: 'www.securitec.pe',
      platform: 'WebChat',
      lastMessage: 'No puedo restablecer mi contraseña, me da error.',
      duration: 30
    }
  },
  {
    id: 'agent-15',
    extension: '015',
    name: 'Sofía Lorente Rey',
    role: 'Agente',
    status: AgentStatus.ALMUERZO,
    statusDuration: 1845, // ~30:45
    module: 'Gestor de tickets',
    activeTickets: 0,
    activeStrategies: 'Marcador manual'
  },
  {
    id: 'agent-16',
    extension: '016',
    name: 'Carlos Eduardo Vaca',
    role: 'Agente',
    status: AgentStatus.PAUSA,
    statusDuration: 620, // 10:20
    module: 'Soporte Técnico',
    activeTickets: 8,
    activeStrategies: 'Marcador predictivo'
  },
  {
    id: 'agent-17',
    extension: '017',
    name: 'Diana Patricia Ruiz',
    role: 'Agente',
    status: AgentStatus.BANO,
    statusDuration: 342, // 05:42
    module: 'Gestor de tickets',
    activeTickets: 2,
    activeStrategies: 'Marcador progresivo - IVR'
  },
  {
    id: 'agent-18',
    extension: '018',
    name: 'Miguel Ángel Torres',
    role: 'Agente',
    status: AgentStatus.DESCONECTADO,
    statusDuration: 3600, // 01:00:00
    module: 'Fidelización de Clientes',
    activeTickets: 0,
    activeStrategies: 'Inactivo'
  }
];

export const initialQueueCalls: QueueCall[] = [
  {
    id: 'q-1',
    phone: '+51 902 443 211',
    waitingTime: 145, // seconds
    campaign: 'Soporte Técnico',
    priority: 'Alta',
    state: 'En espera'
  },
  {
    id: 'q-2',
    phone: '+51 941 229 001',
    waitingTime: 82,
    campaign: 'Campañas de Ventas',
    priority: 'Media',
    state: 'En espera'
  },
  {
    id: 'q-3',
    phone: '+51 915 677 344',
    waitingTime: 45,
    campaign: 'Cobranzas',
    priority: 'Alta',
    state: 'En espera'
  },
  {
    id: 'q-4',
    phone: '+51 983 234 567',
    waitingTime: 12,
    campaign: 'Fidelización de Clientes',
    priority: 'Baja',
    state: 'En espera'
  }
];

export const initialRecordings: Recording[] = [
  {
    id: 'rec-1',
    phone: '+51 950 398 122',
    agentName: 'Juan Pablo Cordova Castillo',
    campaign: 'Campañas de Ventas',
    duration: 185,
    date: '2026-07-20',
    time: '09:12:45',
    sentiment: 'Positivo',
    url: '#'
  },
  {
    id: 'rec-2',
    phone: '+51 994 589 230',
    agentName: 'María Andrea Romero Angulo',
    campaign: 'Soporte Técnico',
    duration: 342,
    date: '2026-07-20',
    time: '08:35:10',
    sentiment: 'Neutro',
    url: '#'
  },
  {
    id: 'rec-3',
    phone: '+51 982 992 011',
    agentName: 'José Ricardo Alva Campos',
    campaign: 'Cobranzas',
    duration: 120,
    date: '2026-07-19',
    time: '17:40:02',
    sentiment: 'Negativo',
    url: '#'
  },
  {
    id: 'rec-4',
    phone: '+51 911 223 344',
    agentName: 'Carlos Eduardo Vaca',
    campaign: 'Fidelización de Clientes',
    duration: 256,
    date: '2026-07-19',
    time: '14:22:18',
    sentiment: 'Positivo',
    url: '#'
  },
  {
    id: 'rec-5',
    phone: '+51 955 667 788',
    agentName: 'Diana Patricia Ruiz',
    campaign: 'Campañas de Ventas',
    duration: 94,
    date: '2026-07-19',
    time: '11:05:59',
    sentiment: 'Neutro',
    url: '#'
  }
];

export const initialEvaluations: Evaluation[] = [
  {
    id: 'eval-1',
    agentId: 'agent-12',
    agentName: 'Juan Pablo Cordova Castillo',
    evaluator: 'Sofhia',
    date: '2026-07-20',
    score: 92,
    feedback: 'Excelente trato al cliente y manejo del guión comercial. Cerró la venta de manera muy profesional.',
    criteria: {
      greeting: 19,
      listening: 18,
      solution: 20,
      professionalism: 18,
      closing: 17
    }
  },
  {
    id: 'eval-2',
    agentId: 'agent-14',
    agentName: 'José Ricardo Alva Campos',
    evaluator: 'Sofhia',
    date: '2026-07-19',
    score: 78,
    feedback: 'Falta un poco de escucha activa. Aunque solucionó el problema técnico, interrumpió al usuario dos veces al inicio.',
    criteria: {
      greeting: 15,
      listening: 14,
      solution: 18,
      professionalism: 16,
      closing: 15
    }
  }
];

export const initialVisaClients: VisaClient[] = [
  {
    id: 'client-1',
    name: 'Carlos Eduardo Mendoza',
    visaType: 'Visa USA',
    status: 'Llenando DS-160',
    interviewDate: '10 de Septiembre, 2026',
    passportNumber: 'P-98421039',
    email: 'carlos.mendoza@email.com',
    phone: '+51 987 654 321',
    assignedAgent: 'Juan Pablo Cordova Castillo',
    ds160Code: 'AA00C9X12B',
    notes: 'Revisando información laboral e historial de viajes previos a Canadá.'
  },
  {
    id: 'client-2',
    name: 'Ana Sofía Martínez',
    visaType: 'Visa USA',
    status: 'Esperando Cita',
    interviewDate: '15 de Agosto, 2026',
    passportNumber: 'P-45210984',
    email: 'ana.martinez@email.com',
    phone: '+51 912 345 678',
    assignedAgent: 'María Andrea Romero Angulo',
    ds160Code: 'AA00D8Z44C',
    notes: 'Formulario DS-160 enviado. Esperando apertura de slots prioritarios en el sistema CAS.'
  },
  {
    id: 'client-3',
    name: 'Mateo Alejandro Silva',
    visaType: 'Visa Canadá',
    status: 'Aprobado',
    interviewDate: '05 de Julio, 2026',
    passportNumber: 'P-77123904',
    email: 'mateo.silva@email.com',
    phone: '+51 955 888 112',
    assignedAgent: 'José Ricardo Alva Campos',
    notes: 'Visa de turismo aprobada por 10 años. Pasaporte estampado con éxito.'
  },
  {
    id: 'client-4',
    name: 'Valeria Lucía Torres',
    visaType: 'Visa USA',
    status: 'Cita Programada',
    interviewDate: '22 de Agosto, 2026',
    passportNumber: 'P-33981245',
    email: 'valeria.torres@email.com',
    phone: '+51 933 441 223',
    assignedAgent: 'Sofía Lorente Rey',
    ds160Code: 'AA00E5K88M',
    notes: 'Cita confirmada en la Embajada de EEUU a las 09:30 AM. Simulación de entrevista programada.'
  },
  {
    id: 'client-5',
    name: 'Fernando Gabriel Ramos',
    visaType: 'Visa Canadá',
    status: 'En Revisión',
    interviewDate: '01 de Septiembre, 2026',
    passportNumber: 'P-66109283',
    email: 'fernando.ramos@email.com',
    phone: '+51 977 123 990',
    assignedAgent: 'Carlos Eduardo Vaca',
    notes: 'Biométricos completados en VFS Global. En espera de decisión por parte del consulado.'
  }
];

