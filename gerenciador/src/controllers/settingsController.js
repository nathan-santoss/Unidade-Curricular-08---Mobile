import { executeController } from "./controllerResult.js";
import { getDeviceInformation } from "../services/deviceService.js";
import { getNotificationPermission } from "../services/notificationService.js";

// Levo os dados do aparelho até a tela sem deixar uma falha interromper a interface.
export function getDeviceInformationController() {
    return executeController(async () => ({ information: await getDeviceInformation() }), { information: [] });
}

// Consulto a permissão; quando recebo true, também tento solicitar a autorização.
export function getNotificationPermissionController(request = false) {
    return executeController(async () => ({ permission: await getNotificationPermission(request) }), { permission: null });
}
