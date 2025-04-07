/**
 * Constantes relacionadas a datas, calendários e períodos de tempo
 */

// Dias da semana abreviados
export const WEEK_DAYS_SHORT = [
    { id: '1', day: 'Seg', value: 'segunda', fullName: 'Segunda-feira', index: 0 },
    { id: '2', day: 'Ter', value: 'terca', fullName: 'Terça-feira', index: 1 },
    { id: '3', day: 'Qua', value: 'quarta', fullName: 'Quarta-feira', index: 2 },
    { id: '4', day: 'Qui', value: 'quinta', fullName: 'Quinta-feira', index: 3 },
    { id: '5', day: 'Sex', value: 'sexta', fullName: 'Sexta-feira', index: 4 },
    { id: '6', day: 'Sáb', value: 'sabado', fullName: 'Sábado', index: 5 },
    { id: '7', day: 'Dom', value: 'domingo', fullName: 'Domingo', index: 6 },
];

// Meses do ano
export const MONTHS = [
    { id: '1', short: 'Jan', fullName: 'Janeiro', value: '01' },
    { id: '2', short: 'Fev', fullName: 'Fevereiro', value: '02' },
    { id: '3', short: 'Mar', fullName: 'Março', value: '03' },
    { id: '4', short: 'Abr', fullName: 'Abril', value: '04' },
    { id: '5', short: 'Mai', fullName: 'Maio', value: '05' },
    { id: '6', short: 'Jun', fullName: 'Junho', value: '06' },
    { id: '7', short: 'Jul', fullName: 'Julho', value: '07' },
    { id: '8', short: 'Ago', fullName: 'Agosto', value: '08' },
    { id: '9', short: 'Set', fullName: 'Setembro', value: '09' },
    { id: '10', short: 'Out', fullName: 'Outubro', value: '10' },
    { id: '11', short: 'Nov', fullName: 'Novembro', value: '11' },
    { id: '12', short: 'Dez', fullName: 'Dezembro', value: '12' },
];

// Mapeamento entre meses em inglês e português
export const MONTH_MAP_EN_PT = {
    "Jan": "Janeiro",
    "Feb": "Fevereiro",
    "Mar": "Março",
    "Apr": "Abril",
    "May": "Maio",
    "Jun": "Junho",
    "Jul": "Julho",
    "Aug": "Agosto",
    "Sep": "Setembro",
    "Oct": "Outubro",
    "Nov": "Novembro",
    "Dec": "Dezembro"
};

// Tipos de frequência
export const ATTENDANCE_TYPES = {
    PRESENT: {
        key: 'present',
        title: 'Presente',
        color: '#4CAF50',  // Verde
        lightColor: '#E8F5E9'
    },
    ABSENT: {
        key: 'absent',
        title: 'Ausente',
        color: '#F44336',  // Vermelho
        lightColor: '#FFEBEE'
    },
    HALF_DAY: {
        key: 'halfDay',
        title: 'Presente',
        color: '#FF9800',  // Laranja/Secundário
        lightColor: '#FFF3E0'
    },
    HOLIDAY: {
        key: 'holiday',
        title: 'Feriado',
        color: '#4CAF50',  // Verde
        lightColor: '#E8F5E9'
    }
};

// Valores padrão para dados ausentes em aulas
export const DEFAULT_LESSON_VALUES = {
    subject: "Aula sem título",
    startTime: "00:00",
    endTime: "00:00",
    teacher: "Professor não definido",
    room: "Sala não definida",
    duration: "1h"
};

// Configuração de localização para o calendário em português
export const CALENDAR_LOCALE_CONFIG = {
    monthNames: MONTHS.map(month => month.fullName),
    monthNamesShort: MONTHS.map(month => month.short + '.'),
    dayNames: WEEK_DAYS_SHORT.map(day => day.fullName).slice(6).concat(WEEK_DAYS_SHORT.map(day => day.fullName).slice(0, 6)),
    dayNamesShort: WEEK_DAYS_SHORT.map(day => day.day + '.').slice(6).concat(WEEK_DAYS_SHORT.map(day => day.day + '.').slice(0, 6)),
    today: 'Hoje'
};

/**
 * Funções utilitárias para trabalhar com datas
 */

// Função para obter o dia da semana formatado a partir do índice
export const getDayOfWeekByIndex = (index) => {
    if (index >= 0 && index < WEEK_DAYS_SHORT.length) {
        return WEEK_DAYS_SHORT[index];
    }
    return null;
};

// Função para obter o mês formatado a partir do valor numérico
export const getMonthByValue = (value) => {
    const month = MONTHS.find(month => month.value === value);
    return month || null;
};

// Função para formatar data no padrão DD/MM/YYYY
export const formatDateToBR = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
};

// Função para converter mês em inglês para português
export const convertMonthEnToPt = (enMonth) => {
    return MONTH_MAP_EN_PT[enMonth] || enMonth;
};

// Função para adicionar zero à esquerda em números menores que 10
export const padZero = (number) => {
    return number.toString().length === 1 ? `0${number}` : number;
}; 