// Preservo os valores aceitos pelo SQLite para usar as mesmas opções em todo o aplicativo.
export const TASK_STATUS = {
    PENDING: "PENDENTE",
    IN_PROGRESS: "EM_ANDAMENTO",
    COMPLETED: "CONCLUIDA",
};

export const TASK_PRIORITY = {
    LOW: "BAIXA",
    MEDIUM: "MEDIA",
    HIGH: "ALTA",
};

// Traduzo os valores internos para os textos apresentados ao usuário.
export function getStatusLabel(status) {
    switch (status) {
        case TASK_STATUS.PENDING: return "Pendente";
        case TASK_STATUS.IN_PROGRESS: return "Em andamento";
        case TASK_STATUS.COMPLETED: return "Concluída";
        default: return "Status desconhecido";
    }
}

// Acrescento a escrita amigável de cada prioridade sem mudar o valor salvo.
export function getPriorityLabel(priority) {
    switch (priority) {
        case TASK_PRIORITY.LOW: return "Baixa";
        case TASK_PRIORITY.MEDIUM: return "Média";
        case TASK_PRIORITY.HIGH: return "Alta";
        default: return "Prioridade desconhecida";
    }
}

// Transformo as constantes em pares de valor e rótulo para montar os seletores.
export const STATUS_OPTIONS = Object.values(TASK_STATUS).map((value) => ({
    value, label: getStatusLabel(value),
}));

export const PRIORITY_OPTIONS = Object.values(TASK_PRIORITY).map((value) => ({
    value, label: getPriorityLabel(value),
}));
