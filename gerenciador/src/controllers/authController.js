import { loginUser, registerUser } from "../services/authService.js";
import { executeController } from "./controllerResult.js";

export function registerController(name, email, password) {
    return executeController(async () => ({
        user: await registerUser(name, email, password),
    }), { user: null });
}

export function loginController(email, password) {
    return executeController(async () => ({
        user: await loginUser(email, password),
    }), { user: null });
}
