import {
    createTaskService,
    deleteTaskService,
    getTaskByIdService,
    getUserTasksService,
    updateTaskService,
    updateTaskStatusService,
} from "../services/taskService.js";
import { executeController } from "./controllerResult.js";

// Cada operação informa seus dados; o helper centraliza apenas sucesso e erro.
export function createTaskController(userId, title, description, dueDate, priority, dueTime) {
    return executeController(async () => ({
        task: await createTaskService(userId, title, description, dueDate, priority, dueTime),
    }), { task: null });
}

export function getUserTasksController(userId) {
    return executeController(async () => ({
        tasks: await getUserTasksService(userId),
    }), { tasks: [] });
}

export function getTaskByIdController(taskId, userId) {
    return executeController(async () => ({
        task: await getTaskByIdService(taskId, userId),
    }), { task: null });
}

export function updateTaskController(taskId, userId, title, description, dueDate, priority, dueTime) {
    return executeController(async () => ({
        task: await updateTaskService(taskId, userId, title, description, dueDate, priority, dueTime),
    }), { task: null });
}

export function updateTaskStatusController(taskId, userId, status) {
    return executeController(async () => ({
        task: await updateTaskStatusService(taskId, userId, status),
    }), { task: null });
}

export function deleteTaskController(taskId, userId) {
    return executeController(async () => {
        await deleteTaskService(taskId, userId);
        return {};
    });
}
