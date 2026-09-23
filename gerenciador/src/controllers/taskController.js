import {
    createTaskService,
    deleteTaskService,
    getTaskByIdService,
    getUserTasksService,
    updateTaskService,
    updateTaskStatusService,
} from "../services/taskService.js";
import { executeController } from "./controllerResult.js";

// Encaminho os dados ao serviço e reaproveito o tratamento comum de sucesso e erro.
export function createTaskController(userId, title, description, dueDate, priority, dueTime) {
    return executeController(async () => ({
        task: await createTaskService(userId, title, description, dueDate, priority, dueTime),
    }), { task: null });
}

// Devolvo uma lista vazia em caso de falha para a tela manter um formato previsível.
export function getUserTasksController(userId) {
    return executeController(async () => ({
        tasks: await getUserTasksService(userId),
    }), { tasks: [] });
}

// Envio também o usuário para o serviço conferir a quem pertence a tarefa.
export function getTaskByIdController(taskId, userId) {
    return executeController(async () => ({
        task: await getTaskByIdService(taskId, userId),
    }), { task: null });
}

// Repasso os campos editáveis, incluindo o horário usado pelo lembrete.
export function updateTaskController(taskId, userId, title, description, dueDate, priority, dueTime) {
    return executeController(async () => ({
        task: await updateTaskService(taskId, userId, title, description, dueDate, priority, dueTime),
    }), { task: null });
}

// Separo a troca de status da edição dos demais campos.
export function updateTaskStatusController(taskId, userId, status) {
    return executeController(async () => ({
        task: await updateTaskStatusService(taskId, userId, status),
    }), { task: null });
}

// Aguardo a exclusão e retorno só a confirmação, pois o registro deixa de existir.
export function deleteTaskController(taskId, userId) {
    return executeController(async () => {
        await deleteTaskService(taskId, userId);
        return {};
    });
}
