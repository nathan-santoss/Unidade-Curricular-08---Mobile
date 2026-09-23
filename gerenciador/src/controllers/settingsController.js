import { executeController } from "./controllerResult.js";
import { getDeviceInformation } from "../services/deviceService.js";
import { getNotificationPermission } from "../services/notificationService.js";

export function getDeviceInformationController() {
    return executeController(async () => ({ information: await getDeviceInformation() }), { information: [] });
}

export function getNotificationPermissionController(request = false) {
    return executeController(async () => ({ permission: await getNotificationPermission(request) }), { permission: null });
}
