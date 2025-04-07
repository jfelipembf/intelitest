/**
 * Dados fictícios para uso nas telas da aplicação
 * Centraliza todos os dados de exemplo em um único local
 */

import { Colors } from './styles';

// DADOS DE CALENDÁRIO E FREQUÊNCIA
export const markedDates = [
  {
    festivalAndHoliDays: {
      "2026-01-25": { selected: true, selectedColor: Colors.greenColor },
      "2026-01-26": { selected: true, selectedColor: Colors.greenColor },
    },
    absentDays: {
      "2026-01-18": { selected: true, selectedColor: Colors.redColor },
      "2026-01-19": { selected: true, selectedColor: Colors.redColor },
    },
    halfDays: {
      "2026-01-07": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2026-02-25": { selected: true, selectedColor: Colors.greenColor },
      "2026-02-07": { selected: true, selectedColor: Colors.greenColor },
    },
    absentDays: {
      "2026-02-10": { selected: true, selectedColor: Colors.redColor },
      "2026-02-11": { selected: true, selectedColor: Colors.redColor },
    },
    halfDays: {
      "2026-02-04": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2026-03-25": { selected: true, selectedColor: Colors.greenColor },
      "2026-03-07": { selected: true, selectedColor: Colors.greenColor },
    },
    absentDays: {
      "2026-03-10": { selected: true, selectedColor: Colors.redColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2026-04-25": { selected: true, selectedColor: Colors.greenColor },
    },
    absentDays: {
      "2026-04-10": { selected: true, selectedColor: Colors.redColor },
      "2026-04-11": { selected: true, selectedColor: Colors.redColor },
    },
    halfDays: {
      "2026-04-04": { selected: true, selectedColor: Colors.secondaryColor },
      "2026-04-07": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2026-05-25": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2026-05-04": { selected: true, selectedColor: Colors.secondaryColor },
      "2026-05-08": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },  
  {
    festivalAndHoliDays: {
      "2025-01-06": { selected: true, selectedColor: Colors.greenColor },
      "2025-01-21": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-01-04": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-02-11": { selected: true, selectedColor: Colors.greenColor },
      "2025-02-08": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-02-22": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-03-06": { selected: true, selectedColor: Colors.greenColor },
      "2025-03-24": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-03-22": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-04-08": { selected: true, selectedColor: Colors.greenColor },
      "2025-04-24": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-04-05": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-05-08": { selected: true, selectedColor: Colors.greenColor },
      "2025-05-19": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-05-31": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-06-27": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-06-05": { selected: true, selectedColor: Colors.secondaryColor },
      "2025-06-07": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-07-14": { selected: true, selectedColor: Colors.greenColor },
      "2025-07-26": { selected: true, selectedColor: Colors.greenColor },
      "2025-07-31": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-07-10": { selected: true, selectedColor: Colors.secondaryColor },
      "2025-07-24": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-08-25": { selected: true, selectedColor: Colors.greenColor },
      "2025-08-26": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-08-07": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    halfDays: {
      "2025-09-07": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-10-16": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-10-07": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-11-16": { selected: true, selectedColor: Colors.greenColor },
      "2025-11-20": { selected: true, selectedColor: Colors.greenColor },
      "2025-11-25": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-11-04": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-12-06": { selected: true, selectedColor: Colors.greenColor },
      "2025-12-12": { selected: true, selectedColor: Colors.greenColor },
    },
  },
];

// DADOS DE BOLETIM E NOTAS
export const subjectsList = [
  {
    id: '1',
    subject: 'Matemática',
    color: Colors.purpleColor,
    lightColor: Colors.lightPurpleColor,
    units: [
      {
        name: 'Primeira Unidade',
        grades: [
          { title: 'Prova', value: 3.5 },
          { title: 'Trabalho', value: 4.0 },
          { title: 'Participação', value: 3.0 }
        ]
      },
      {
        name: 'Segunda Unidade',
        grades: [
          { title: 'Prova', value: 4.0 },
          { title: 'Trabalho', value: 5.5 },
          { title: 'Participação', value: 5.0 }
        ]
      },
      {
        name: 'Terceira Unidade',
        grades: [
          { title: 'Prova', value: 4.5 },
          { title: 'Trabalho', value: 5.0 },
          { title: 'Participação', value: 4.0 }
        ]
      },
      {
        name: 'Quarta Unidade',
        grades: [
          { title: 'Prova', value: 6.5 },
          { title: 'Trabalho', value: 7.5 },
          { title: 'Participação', value: 8.0 }
        ]
      },
      {
        name: 'Recuperação',
        grades: [
          { title: 'Prova Final', value: 8.0 }
        ]
      }
    ]
  },
  {
    id: '2',
    subject: 'Ciências',
    color: Colors.secondaryColor,
    lightColor: Colors.lightSecondaryColor,
    units: [
      {
        name: 'Primeira Unidade',
        grades: [
          { title: 'Prova', value: 4.5 },
          { title: 'Laboratório', value: 5.5 },
          { title: 'Projeto', value: 6.0 }
        ]
      },
      {
        name: 'Segunda Unidade',
        grades: [
          { title: 'Prova', value: 5.5 },
          { title: 'Laboratório', value: 6.0 },
          { title: 'Projeto', value: 5.0 }
        ]
      },
      {
        name: 'Terceira Unidade',
        grades: [
          { title: 'Prova', value: 8.0 },
          { title: 'Laboratório', value: 7.5 },
          { title: 'Projeto', value: 8.5 }
        ]
      },
      {
        name: 'Quarta Unidade',
        grades: [
          { title: 'Prova', value: 7.0 },
          { title: 'Laboratório', value: 8.0 },
          { title: 'Projeto', value: 7.5 }
        ]
      }
    ]
  },
  {
    id: '3',
    subject: 'Português',
    color: Colors.greenColor,
    lightColor: Colors.lightGreenColor,
    units: [
      {
        name: 'Primeira Unidade',
        grades: [
          { title: 'Prova', value: 4.0 },
          { title: 'Redação', value: 5.5 },
          { title: 'Apresentação', value: 5.0 }
        ]
      },
      {
        name: 'Segunda Unidade',
        grades: [
          { title: 'Prova', value: 8.5 },
          { title: 'Redação', value: 8.0 },
          { title: 'Apresentação', value: 7.5 }
        ]
      },
      {
        name: 'Terceira Unidade',
        grades: [
          { title: 'Prova', value: 7.0 },
          { title: 'Redação', value: 8.5 },
          { title: 'Apresentação', value: 9.0 }
        ]
      },
      {
        name: 'Recuperação',
        grades: [
          { title: 'Prova Final', value: 7.5 }
        ]
      }
    ]
  },
  {
    id: '4',
    subject: 'História',
    color: Colors.cyanColor,
    lightColor: Colors.lightCyanColor,
    units: [
      {
        name: 'Primeira Unidade',
        grades: [
          { title: 'Prova', value: 7.5 },
          { title: 'Trabalho', value: 9.0 },
          { title: 'Seminário', value: 8.5 }
        ]
      },
      {
        name: 'Segunda Unidade',
        grades: [
          { title: 'Prova', value: 8.0 },
          { title: 'Trabalho', value: 7.5 },
          { title: 'Seminário', value: 8.0 }
        ]
      }
    ]
  }
];

// DADOS DE ALUNOS
export const studentData = {
  id: '1',
  name: 'João Silva',
  class: '9º Ano A',
  grade: '9º Ano',
  rollNumber: '2023001',
  profilePic: null, // Pode ser substituído pelo caminho da imagem
  birthDate: '2010-03-15',
  contactInfo: {
    email: 'joao.silva@exemplo.com',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123 - São Paulo, SP'
  },
  parentInfo: {
    name: 'Carlos Silva',
    phone: '(11) 91234-5678',
    email: 'carlos.silva@exemplo.com'
  }
};

// DADOS DE ESCOLA
export const schoolData = {
  id: '1',
  name: 'Colégio Exemplo',
  address: 'Av. Educação, 1000 - São Paulo, SP',
  phone: '(11) 3333-4444',
  email: 'contato@colegioexemplo.com.br',
  website: 'www.colegioexemplo.com.br',
  logo: null, // Pode ser substituído pelo caminho da imagem
  currentSemester: '1º Semestre 2025'
};

// DADOS DE TURMA
export const classData = {
  id: '1',
  name: 'A',
  grade: '9º Ano',
  year: '2025',
  teacher: 'Profa. Ana Souza',
  schedule: 'Manhã - 7:30 às 12:00',
  room: 'Sala 105'
};

// DADOS DE AULAS
export const lessonsData = [
  {
    id: '1',
    subject: 'Matemática',
    teacher: { id: '1', label: 'Prof. Ricardo Santos' },
    room: { id: '1', label: 'Sala 105' },
    startTime: '07:30',
    endTime: '08:20',
    duration: '50min',
    period: '1º',
    daysOfWeek: [
      { value: 'segunda', label: 'Segunda-feira' },
      { value: 'quarta', label: 'Quarta-feira' },
      { value: 'sexta', label: 'Sexta-feira' }
    ]
  },
  {
    id: '2',
    subject: 'Português',
    teacher: { id: '2', label: 'Profa. Márcia Oliveira' },
    room: { id: '1', label: 'Sala 105' },
    startTime: '08:20',
    endTime: '09:10',
    duration: '50min',
    period: '2º',
    daysOfWeek: [
      { value: 'segunda', label: 'Segunda-feira' },
      { value: 'terca', label: 'Terça-feira' },
      { value: 'quinta', label: 'Quinta-feira' }
    ]
  },
  {
    id: '3',
    subject: 'Ciências',
    teacher: { id: '3', label: 'Prof. Paulo Mendes' },
    room: { id: '2', label: 'Laboratório' },
    startTime: '09:30',
    endTime: '10:20',
    duration: '50min',
    period: '3º',
    daysOfWeek: [
      { value: 'terca', label: 'Terça-feira' },
      { value: 'quinta', label: 'Quinta-feira' }
    ]
  },
  {
    id: '4',
    subject: 'História',
    teacher: { id: '4', label: 'Profa. Laura Costa' },
    room: { id: '1', label: 'Sala 105' },
    startTime: '10:20',
    endTime: '11:10',
    duration: '50min',
    period: '4º',
    daysOfWeek: [
      { value: 'quarta', label: 'Quarta-feira' },
      { value: 'sexta', label: 'Sexta-feira' }
    ]
  },
  {
    id: '5',
    subject: 'Geografia',
    teacher: { id: '5', label: 'Prof. Carlos Dias' },
    room: { id: '1', label: 'Sala 105' },
    startTime: '11:10',
    endTime: '12:00',
    duration: '50min',
    period: '5º',
    daysOfWeek: [
      { value: 'segunda', label: 'Segunda-feira' },
      { value: 'quinta', label: 'Quinta-feira' }
    ]
  },
  {
    id: '6',
    subject: 'Educação Física',
    teacher: { id: '6', label: 'Prof. André Lima' },
    room: { id: '3', label: 'Quadra' },
    startTime: '09:30',
    endTime: '11:10',
    duration: '1h40min',
    period: '3º e 4º',
    daysOfWeek: [
      { value: 'sabado', label: 'Sábado' }
    ]
  },
  {
    id: '7',
    subject: 'Inglês',
    teacher: { id: '7', label: 'Prof. Daniel Torres' },
    room: { id: '4', label: 'Sala de Idiomas' },
    startTime: '11:10',
    endTime: '12:00',
    duration: '50min',
    period: '5º',
    daysOfWeek: [
      { value: 'terca', label: 'Terça-feira' },
      { value: 'sexta', label: 'Sexta-feira' }
    ]
  },
  {
    id: '8',
    subject: 'Arte',
    teacher: { id: '8', label: 'Profa. Camila Rocha' },
    room: { id: '5', label: 'Sala de Arte' },
    startTime: '07:30',
    endTime: '09:10',
    duration: '1h40min',
    period: '1º e 2º',
    daysOfWeek: [
      { value: 'sabado', label: 'Sábado' }
    ]
  }
]; 