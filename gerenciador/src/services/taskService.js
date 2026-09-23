import {
    createTask,
    deleteTask,
    findTaskById,
    findTasksByUser,
    updateTask,
    updateTaskStatus,
} from "../repositories/taskRepository.js";
import { TASK_PRIORITY, TASK_STATUS } from "../constants/taskConstants.js";
import { formatDateForDatabase, formatTimeForDatabase, getTaskDateTime } from "../utils/dateUtils.js";
import { cancelTaskReminder, updateTaskReminder } from "./notificationService.js";

// Reúno as prioridades permitidas a partir das constantes compartilhadas.
const VALID_PRIORITIES = Object.values(TASK_PRIORITY);

// Mantenho a validação de status alinhada aos valores usados pelo aplicativo.
const VALID_STATUS = Object.values(TASK_STATUS);

// Exijo um número inteiro positivo para identificar uma conta ou tarefa.
function validateId(id) {
    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new Error("Identificador inválido.");
    }
}

// Rejeito títulos vazios e prioridades fora da lista antes de gravar.
function validateTaskData(title, priority) {
    if (title.trim() === "") {
        throw new Error("Informe o título da tarefa.");
    }

    if (VALID_PRIORITIES.includes(priority) === false) {
        throw new Error("Prioridade inválida.");
    }
}

// Aceito somente os status definidos para o ciclo de uma tarefa.
function validateStatus(status) {
    if (VALID_STATUS.includes(status) === false) {
        throw new Error("Status inválido.");
    }
}

// Trato data e horário juntos, porque um lembrete precisa dos dois valores.
function validateDeadline(dueDate, dueTime, previousTask = null) {
    const date = formatDateForDatabase(dueDate);
    const time = formatTimeForDatabase(dueTime);
    if (time && !date) throw new Error("Informe também a data para agendar o lembrete.");
    const deadline = getTaskDateTime(date, time);
    // Permito editar outros campos de uma tarefa vencida quando o prazo continua igual.
    const unchanged = previousTask && previousTask.due_date === date && previousTask.due_time === time;
    if (deadline && !unchanged && deadline.getTime() <= Date.now()) {
        throw new Error("Escolha uma data e um horário futuros para o lembrete.");
    }
    return { date, time };
}

// Devolvo um aviso junto da tarefa salva se o agendamento não puder ser concluído.
async function attachReminder(task) {
    task.reminderWarning = await updateTaskReminder(task);
    return task;
}

// Valido os dados, salvo a tarefa e só então tento agendar o lembrete.
export async function createTaskService(
    userId,
    title,
    description = "",
    dueDate = "",
    priority = TASK_PRIORITY.MEDIUM,
    dueTime = ""
) {
    validateId(userId);
    validateTaskData(
        title,
        priority
    );

    const deadline = validateDeadline(dueDate, dueTime);

    const taskId = await createTask(
        userId,
        title,
        description,
        deadline.date,
        priority,
        deadline.time
    );

    // Busco o registro completo para devolver à tela o que realmente foi salvo.
    const task = await findTaskById(
        taskId,
        userId
    );

    return attachReminder(task);
}

// Entrego à listagem apenas as tarefas do usuário informado.
export async function getUserTasksService(userId) {
    validateId(userId);
    const tasks = await findTasksByUser(userId);

    return tasks;
}

// Recupero uma tarefa e aviso quando ela não existe para esta conta.
export async function getTaskByIdService(
    taskId,
    userId
) {
    validateId(taskId);
    validateId(userId);
    const task = await findTaskById(
        taskId,
        userId
    );

    if (task === null) {
        throw new Error("Tarefa não encontrada.");
    }

    return task;
}

// Organizo a edição para validar os dados antes de mexer no lembrete anterior.
export async function updateTaskService(
    taskId,
    userId,
    title,
    description,
    dueDate,
    priority,
    dueTime = ""
) {
    validateTaskData(
        title,
        priority
    );

    // Confirmo a propriedade da tarefa antes de autorizar a alteração.
    const previousTask = await getTaskByIdService(
        taskId,
        userId
    );

    const deadline = validateDeadline(dueDate, dueTime, previousTask);
    if (previousTask.due_time) await cancelTaskReminder(taskId, userId);

    await updateTask(
        taskId,
        userId,
        title,
        description,
        deadline.date,
        priority,
        deadline.time
    );

    return attachReminder(await findTaskById(taskId, userId));
}

// Ajusto a situação da tarefa e sincronizo o lembrete com o novo status.
export async function updateTaskStatusService(
    taskId,
    userId,
    status
) {
    validateStatus(status);

    // Interrompo a mudança se não encontrar a tarefa entre os registros desta conta.
    const previousTask = await getTaskByIdService(
        taskId,
        userId
    );

    if (previousTask.due_time) await cancelTaskReminder(taskId, userId);

    await updateTaskStatus(
        taskId,
        userId,
        status
    );

    return attachReminder(await findTaskById(taskId, userId));
}

// Cancelo o aviso antes de excluir a tarefa para não deixar um lembrete sem registro.
export async function deleteTaskService(
    taskId,
    userId
) {
    const task = await getTaskByIdService(
        taskId,
        userId
    );

    if (task.due_time) await cancelTaskReminder(taskId, userId);

    await deleteTask(
        taskId,
        userId
    );

    return true;
}
