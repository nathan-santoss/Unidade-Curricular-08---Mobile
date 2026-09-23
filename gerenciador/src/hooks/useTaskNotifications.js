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
            // Distingo cada entrega pelo ID e pela data para não abrir o mesmo aviso duas vezes.
            const responseId = `${request.identifier}-${response.notification.date}`;
            // Aceito somente avisos desta conta que tragam um ID válido de tarefa.
            if (!isTaskNotification(request) || data.userId !== user.id ||
                !Number.isSafeInteger(data.taskId) || data.taskId <= 0 || handledId === responseId) return;
            handledId = responseId;
            // Volto à área principal e abro os detalhes, onde confiro novamente o dono da tarefa.
            navigation.popTo("Main", {
                screen: "Tasks", params: { screen: "TaskDetails", params: { taskId: data.taskId }, initial: false },
            });
            Notifications.clearLastNotificationResponseAsync().catch(() => {
                // Mantenho a tarefa aberta mesmo se não conseguir limpar a resposta do aviso.
            });
        }
        // Escuto os próximos toques enquanto este fluxo de navegação estiver montado.
        const subscription = Notifications.addNotificationResponseReceivedListener(openNotification);
        // Recupero também o toque que abriu o aplicativo depois de ele estar fechado.
        Notifications.getLastNotificationResponseAsync().then(openNotification).catch(() => {
            // Preservo a navegação normal se não conseguir recuperar esse toque.
        });
        // Ao sair deste fluxo, paro de escutar eventos e ignoro respostas ainda pendentes.
        return () => { active = false; subscription.remove(); };
    }, [navigation, user.id]);
}
