// Os valores internos permanecem iguais aos CHECKs definidos no SQLite.
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

export function getStatusLabel(status) {
    switch (status) {
        case TASK_STATUS.PENDING: return "Pendente";
        case TASK_STATUS.IN_PROGRESS: return "Em andamento";
        case TASK_STATUS.COMPLETED: return "Concluída";
        default: return "Status desconhecido";
    }
}

export function getPriorityLabel(priority) {
    switch (priority) {
        case TASK_PRIORITY.LOW: return "Baixa";
        case TASK_PRIORITY.MEDIUM: return "Média";
        case TASK_PRIORITY.HIGH: return "Alta";
        default: return "Prioridade desconhecida";
    }
}

export const STATUS_OPTIONS = Object.values(TASK_STATUS).map((value) => ({
    value, label: getStatusLabel(value),
}));

export const PRIORITY_OPTIONS = Object.values(TASK_PRIORITY).map((value) => ({
    value, label: getPriorityLabel(value),
}));
