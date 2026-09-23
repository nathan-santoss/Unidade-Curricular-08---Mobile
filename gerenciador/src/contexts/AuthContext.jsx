import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    loginController,
    registerController,
} from "../controllers/authController.js";

import { findUserById } from "../repositories/userRepository.js";

import {
    clearSession,
    getSavedSessionUserId,
    saveSession,
} from "../services/sessionService.js";
import { cancelUserReminders, restoreUserReminders, setNotificationUser } from "../services/notificationService.js";

// Crio um ponto de acesso compartilhado para não passar a conta manualmente entre telas.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // Mantenho a conta em memória e separo os estados de carregamento, erro e lembretes.
    const [user, setUser] = useState(null);
    const [loadingSession, setLoadingSession] = useState(true);
    const [sessionError, setSessionError] = useState("");
    const [sessionAttempt, setSessionAttempt] = useState(0);
    const [reminderWarning, setReminderWarning] = useState("");

    // Associo as notificações à conta antes de liberar a área autenticada.
    async function activateUser(authenticatedUser) {
        setNotificationUser(authenticatedUser.id);
        setReminderWarning(await restoreUserReminders(authenticatedUser.id));
        setUser(authenticatedUser);
    }

    useEffect(() => {
        // Tento restaurar a conta salva quando o aplicativo inicia.
        async function restoreSession() {
            setLoadingSession(true);
            setSessionError("");
            try {
                const userId = await getSavedSessionUserId();

                // Encerro a recuperação quando não encontro um ID salvo.
                if (userId === null) {
                    return;
                }

                // Consulto o cadastro pelo ID para recuperar nome e e-mail atuais.
                const savedUser = await findUserById(userId);

                // Descarto uma sessão antiga se o cadastro correspondente já não existe.
                if (savedUser === null) {
                    await clearSession();

                    return;
                }

                await activateUser(savedUser);
            } catch {
                // Preservo a sessão salva quando a leitura falha, permitindo tentar novamente.
                setSessionError("Não foi possível recuperar sua sessão. Tente novamente.");
                setUser(null);
            } finally {
                setLoadingSession(false);
            }
        }

        restoreSession();
    }, [sessionAttempt]);

    // Compartilho a conclusão do login e do cadastro, recebendo a mensagem adequada a cada falha.
    async function completeAuthentication(result, sessionErrorMessage) {
        if (!result.success) return result;
        try {
            await saveSession(result.user.id);
            await activateUser(result.user);
            return result;
        } catch {
            return { success: false, message: sessionErrorMessage };
        }
    }

    async function login(email, password) {
        const result = await loginController(email, password);
        return completeAuthentication(result, "Não foi possível salvar a sessão. Tente entrar novamente.");
    }

    async function register(name, email, password) {
        const result = await registerController(name, email, password);
        return completeAuthentication(result,
            "Sua conta foi criada, mas a sessão não pôde ser salva. Volte ao login e entre com seus dados.");
    }

    // Cancelo os lembretes antes de limpar a sessão e retirar a conta da memória.
    async function logout() {
        try {
            await cancelUserReminders(user.id);
            await clearSession();
            setNotificationUser(null);
            setUser(null);
            setReminderWarning("");
            return { success: true };
        } catch {
            return { success: false, message: "Não foi possível encerrar a sessão. Tente novamente." };
        }
    }

    // Reaproveito a restauração para a atualização manual e guardo o aviso para o Perfil.
    async function refreshReminders() {
        const warning = await restoreUserReminders(user.id);
        setReminderWarning(warning);
        return warning;
    }

    // Disponibilizo os dados e as ações da conta às telas pelo mesmo contexto.
    const authData = {
        user: user,
        loadingSession: loadingSession,
        login: login,
        register: register,
        logout: logout,
        sessionError,
        reminderWarning,
        refreshReminders,
        // Altero este contador para executar novamente o efeito que recupera a sessão.
        retrySession: () => setSessionAttempt((previous) => previous + 1),
    };

    return (
        <AuthContext.Provider value={authData}>
            {children}
        </AuthContext.Provider>
    );
}

// Facilito o acesso à conta e às ações de autenticação com este hook.
export function useAuth() {
    const context = useContext(AuthContext);

    // Aviso quando uma tela tenta consultar a autenticação fora do seu provedor.
    if (context === null) {
        throw new Error(
            "useAuth precisa ser utilizado dentro de AuthProvider."
        );
    }

    return context;
}
