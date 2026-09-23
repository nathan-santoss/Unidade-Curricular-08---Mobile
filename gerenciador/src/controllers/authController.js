import { loginUser, registerUser } from "../services/authService.js";
import { executeController } from "./controllerResult.js";

// Encaminho o cadastro ao serviço e devolvo o usuário no formato comum dos controllers.
export function registerController(name, email, password) {
    return executeController(async () => ({
        user: await registerUser(name, email, password),
    }), { user: null });
}

// Aproveito o mesmo tratamento de erros para responder à tentativa de login.
export function loginController(email, password) {
    return executeController(async () => ({
        user: await loginUser(email, password),
    }), { user: null });
}
