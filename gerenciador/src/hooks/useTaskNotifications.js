import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useAuth } from "../contexts/AuthContext.jsx";
import { isTaskNotification } from "../services/notificationService.js";

export function useTaskNotifications(navigation) {
    const { user } = useAuth();

    useEffect(() => {
        let active = true;
        let handledId = null;
        function openNotification(response) {
            if (!active || !response) return;
            const request = response.notification.request;
            const data = request.content.data;
            const responseId = `${request.identifier}-${response.notification.date}`;
            if (!isTaskNotification(request) || data.userId !== user.id ||
                !Number.isSafeInteger(data.taskId) || data.taskId <= 0 || handledId === responseId) return;
            handledId = responseId;
            // A tela de detalhes consulta novamente a propriedade da tarefa no SQLite.
            navigation.popTo("Main", {
                screen: "Tasks", params: { screen: "TaskDetails", params: { taskId: data.taskId }, initial: false },
            });
            Notifications.clearLastNotificationResponseAsync().catch(() => {
                // A falha de limpeza não impede a abertura da tarefa.
            });
        }
        const subscription = Notifications.addNotificationResponseReceivedListener(openNotification);
        // Recupera também o toque que iniciou o aplicativo quando ele estava fechado.
        Notifications.getLastNotificationResponseAsync().then(openNotification).catch(() => {
            // A navegação normal continua disponível se não for possível ler a resposta.
        });
        return () => { active = false; subscription.remove(); };
    }, [navigation, user.id]);
}
