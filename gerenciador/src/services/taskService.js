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

// Define as prioridades aceitas pelo banco e pelas telas.
const VALID_PRIORITIES = Object.values(TASK_PRIORITY);

// Define os status permitidos para uma tarefa.
const VALID_STATUS = Object.values(TASK_STATUS);

function validateId(id) {
    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new Error("Identificador inválido.");
    }
}

// Valida os dados principais antes de cadastrar ou atualizar uma tarefa.
function validateTaskData(title, priority) {
    if (title.trim() === "") {
        throw new Error("Informe o título da tarefa.");
    }

    if (VALID_PRIORITIES.includes(priority) === false) {
        throw new Error("Prioridade inválida.");
    }
}

// Valida o status antes de atualizar a situação da tarefa.
function validateStatus(status) {
    if (VALID_STATUS.includes(status) === false) {
        throw new Error("Status inválido.");
    }
}

function validateDeadline(dueDate, dueTime, previousTask = null) {
    const date = formatDateForDatabase(dueDate);
    const time = formatTimeForDatabase(dueTime);
    if (time && !date) throw new Error("Informe também a data para agendar o lembrete.");
    const deadline = getTaskDateTime(date, time);
    const unchanged = previousTask && previousTask.due_date === date && previousTask.due_time === time;
    if (deadline && !unchanged && deadline.getTime() <= Date.now()) {
        throw new Error("Escolha uma data e um horário futuros para o lembrete.");
    }
    return { date, time };
}

async function attachReminder(task) {
    task.reminderWarning = await updateTaskReminder(task);
    return task;
}

// Cadastra uma nova tarefa depois de validar os dados recebidos.
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

    // Retorna a tarefa cadastrada para manter as telas atualizadas.
    const task = await findTaskById(
        taskId,
        userId
    );

    return attachReminder(task);
}

// Recupera todas as tarefas pertencentes ao usuário autenticado.
export async function getUserTasksService(userId) {
    validateId(userId);
    const tasks = await findTasksByUser(userId);

    return tasks;
}

// Recupera uma tarefa específica para detalhes ou edição.
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

// Atualiza os dados de uma tarefa já cadastrada.
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

    // Confirma que a tarefa existe e pertence ao usuário antes da alteração.
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

// Atualiza somente o status de uma tarefa.
export async function updateTaskStatusService(
    taskId,
    userId,
    status
) {
    validateStatus(status);

    // Impede a alteração de uma tarefa inexistente ou de outro usuário.
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

// Exclui uma tarefa depois de confirmar que ela pertence ao usuário.
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
