import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { TASK_STATUS } from "../constants/taskConstants.js";
import { findTasksByUser } from "../repositories/taskRepository.js";
import { getTaskDateTime } from "../utils/dateUtils.js";
import { vibrateFeedback } from "../utils/vibration.js";

// Separo o canal de som/vibração da marca que uso para reconhecer os avisos do gerenciador.
const CHANNEL_ID = "task-reminders";
const SOURCE = "gerenciador-task";
let activeUserId = null;

// Acompanho a conta conectada em memória para decidir quais avisos posso apresentar.
export function setNotificationUser(userId) {
    activeUserId = userId;
}

// Reconheço os lembretes que criei pelo campo source incluído na notificação.
export function isTaskNotification(request) {
    return request.content.data?.source === SOURCE;
}

// Apresento os lembretes recebidos com o aplicativo aberto somente para a conta ativa.
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

// Agrupo os lembretes num canal Android com som e vibração configurados.
async function prepareChannel() {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
            name: "Lembretes de tarefas", importance: Notifications.AndroidImportance.HIGH,
            sound: "default", enableVibrate: true, vibrationPattern: [0, 250, 150, 250],
        });
    }
}

// Considero também as autorizações provisória e temporária oferecidas pelo iOS.
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
    // Só abro o pedido de permissão quando solicitado e quando o sistema permite perguntar.
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

// Componho uma chave única com conta e tarefa para localizar o aviso depois.
function reminderId(taskId, userId) {
    return `${SOURCE}-${userId}-${taskId}`;
}

export async function cancelTaskReminder(taskId, userId) {
    const identifier = reminderId(taskId, userId);
    try {
        // Cancelo a entrega futura e retiro também um aviso que já esteja visível.
        await Notifications.cancelScheduledNotificationAsync(identifier);
        await Notifications.dismissNotificationAsync(identifier);
    } catch {
        throw new Error("Não foi possível cancelar o lembrete anterior. Tente novamente antes de alterar a tarefa.");
    }
}

async function scheduleTaskReminder(task) {
    await Notifications.scheduleNotificationAsync({
        // Reutilizo o mesmo identificador para atualizar o lembrete sem criar outro aviso.
        identifier: reminderId(task.id, task.user_id),
        content: {
            title: "Hora da sua tarefa", body: task.title, sound: "default",
            vibrate: [0, 250, 150, 250],
            // Incluo os IDs para abrir a tarefa certa quando houver um toque no aviso.
            data: { source: SOURCE, taskId: task.id, userId: task.user_id },
        },
        // Agendo uma única entrega para a data e o horário escolhidos.
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: getTaskDateTime(task.due_date, task.due_time), channelId: CHANNEL_ID,
        },
    });
}

// Excluo do agendamento as concluídas, as sem horário e as que já venceram.
function needsReminder(task) {
    if (task.status === TASK_STATUS.COMPLETED || !task.due_time || !task.due_date) return false;
    return getTaskDateTime(task.due_date, task.due_time).getTime() > Date.now();
}

// Trato falhas de notificação como avisos, pois já salvei a tarefa no banco.
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

// Retiro os avisos desta conta, tanto os futuros quanto os que já apareceram.
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

// Recrio os lembretes a partir do banco ao entrar na conta ou atualizar as Configurações.
export async function restoreUserReminders(userId) {
    try {
        const tasks = await findTasksByUser(userId);
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        // Limpo os agendamentos anteriores antes de reconstruir os lembretes da conta atual.
        for (const request of scheduled) {
            if (isTaskNotification(request)) {
                await Notifications.cancelScheduledNotificationAsync(request.identifier);
            }
        }
        // Removo da central de notificações os avisos que pertencem a outra conta.
        const presented = await Notifications.getPresentedNotificationsAsync();
        for (const notification of presented) {
            const request = notification.request;
            if (isTaskNotification(request) && request.content.data.userId !== userId) {
                await Notifications.dismissNotificationAsync(request.identifier);
            }
        }
        const pending = tasks.filter(needsReminder);
        if (pending.length === 0) return "";
        // Consulto a autorização sem abrir um pedido durante a restauração automática.
        const permission = await getNotificationPermission();
        if (!permission.allowed) return "Autorize as notificações para receber os lembretes das tarefas com horário.";
        for (const task of pending) await scheduleTaskReminder(task);
        return "";
    } catch {
        return "Não foi possível atualizar todos os lembretes. Tente novamente nas Configurações.";
    }
}
