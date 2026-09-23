import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { TASK_STATUS } from "../constants/taskConstants.js";
import { findTasksByUser } from "../repositories/taskRepository.js";
import { getTaskDateTime } from "../utils/dateUtils.js";
import { vibrateFeedback } from "../utils/vibration.js";

const CHANNEL_ID = "task-reminders";
const SOURCE = "gerenciador-task";
let activeUserId = null;

export function setNotificationUser(userId) {
    activeUserId = userId;
}

export function isTaskNotification(request) {
    return request.content.data?.source === SOURCE;
}

// Mostra o lembrete com o app aberto apenas para a conta autenticada.
Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
        const show = isTaskNotification(notification.request) &&
            notification.request.content.data.userId === activeUserId;
        if (show && Platform.OS === "ios") vibrateFeedback();
        return {
            shouldShowBanner: show, shouldShowList: show,
            shouldPlaySound: show, shouldSetBadge: false,
        };
    },
});

async function prepareChannel() {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
            name: "Lembretes de tarefas", importance: Notifications.AndroidImportance.HIGH,
            sound: "default", enableVibrate: true, vibrationPattern: [0, 250, 150, 250],
        });
    }
}

function hasPermission(permission) {
    if (Platform.OS === "ios") {
        return [Notifications.IosAuthorizationStatus.AUTHORIZED,
            Notifications.IosAuthorizationStatus.PROVISIONAL,
            Notifications.IosAuthorizationStatus.EPHEMERAL].includes(permission.ios?.status);
    }
    return permission.granted;
}

export async function getNotificationPermission(request = false) {
    await prepareChannel();
    let permission = await Notifications.getPermissionsAsync();
    if (request && !hasPermission(permission) && permission.canAskAgain) {
        permission = await Notifications.requestPermissionsAsync({
            ios: { allowAlert: true, allowSound: true, allowBadge: false },
        });
    }
    let label = "Não autorizadas";
    if (hasPermission(permission)) label = "Autorizadas";
    if (permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
        label = "Autorizadas silenciosamente";
    }
    return { allowed: hasPermission(permission), label };
}

function reminderId(taskId, userId) {
    return `${SOURCE}-${userId}-${taskId}`;
}

export async function cancelTaskReminder(taskId, userId) {
    const identifier = reminderId(taskId, userId);
    try {
        await Notifications.cancelScheduledNotificationAsync(identifier);
        await Notifications.dismissNotificationAsync(identifier);
    } catch {
        throw new Error("Não foi possível cancelar o lembrete anterior. Tente novamente antes de alterar a tarefa.");
    }
}

async function scheduleTaskReminder(task) {
    await Notifications.scheduleNotificationAsync({
        // O ID estável evita duplicar lembretes ao reiniciar ou editar o aplicativo.
        identifier: reminderId(task.id, task.user_id),
        content: {
            title: "Hora da sua tarefa", body: task.title, sound: "default",
            vibrate: [0, 250, 150, 250],
            data: { source: SOURCE, taskId: task.id, userId: task.user_id },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: getTaskDateTime(task.due_date, task.due_time), channelId: CHANNEL_ID,
        },
    });
}

function needsReminder(task) {
    if (task.status === TASK_STATUS.COMPLETED || !task.due_time || !task.due_date) return false;
    return getTaskDateTime(task.due_date, task.due_time).getTime() > Date.now();
}

// A tarefa já foi salva: falhas de notificação viram avisos, sem incentivar novo cadastro.
export async function updateTaskReminder(task) {
    try {
        if (!needsReminder(task)) return "";
        const permission = await getNotificationPermission(true);
        if (!permission.allowed) {
            return "A tarefa foi salva, mas o lembrete não foi agendado. Autorize as notificações em Perfil > Configurações.";
        }
        await scheduleTaskReminder(task);
        return "";
    } catch {
        return "A tarefa foi salva, mas não foi possível agendar o lembrete. Tente atualizar os lembretes em Perfil > Configurações.";
    }
}

// Remove apenas notificações deste gerenciador, inclusive as já apresentadas.
export async function cancelUserReminders(userId) {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const request of scheduled) {
        if (isTaskNotification(request) && request.content.data.userId === userId) {
            await Notifications.cancelScheduledNotificationAsync(request.identifier);
        }
    }
    const presented = await Notifications.getPresentedNotificationsAsync();
    for (const notification of presented) {
        if (isTaskNotification(notification.request) && notification.request.content.data.userId === userId) {
            await Notifications.dismissNotificationAsync(notification.request.identifier);
        }
    }
}

export async function restoreUserReminders(userId) {
    try {
        const tasks = await findTasksByUser(userId);
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        // Limpa agendamentos antigos, de tarefas apagadas ou de outra conta.
        for (const request of scheduled) {
            if (isTaskNotification(request)) {
                await Notifications.cancelScheduledNotificationAsync(request.identifier);
            }
        }
        const presented = await Notifications.getPresentedNotificationsAsync();
        for (const notification of presented) {
            const request = notification.request;
            if (isTaskNotification(request) && request.content.data.userId !== userId) {
                await Notifications.dismissNotificationAsync(request.identifier);
            }
        }
        const pending = tasks.filter(needsReminder);
        if (pending.length === 0) return "";
        const permission = await getNotificationPermission();
        if (!permission.allowed) return "Autorize as notificações para receber os lembretes das tarefas com horário.";
        for (const task of pending) await scheduleTaskReminder(task);
        return "";
    } catch {
        return "Não foi possível atualizar todos os lembretes. Tente novamente nas Configurações.";
    }
}
