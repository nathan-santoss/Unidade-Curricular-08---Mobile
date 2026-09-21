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

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingSession, setLoadingSession] = useState(true);
    const [sessionError, setSessionError] = useState("");
    const [sessionAttempt, setSessionAttempt] = useState(0);

    useEffect(() => {
        // Verifica se existe uma sessão salva quando o aplicativo é iniciado.
        async function restoreSession() {
            setLoadingSession(true);
            setSessionError("");
            try {
                const userId = await getSavedSessionUserId();

                // Finaliza a busca quando nenhuma sessão estiver armazenada.
                if (userId === null) {
                    return;
                }

                // Busca no SQLite os dados do usuário ligado à sessão salva.
                const savedUser = await findUserById(userId);

                // Remove uma sessão antiga caso o usuário não exista mais no banco.
                if (savedUser === null) {
                    await clearSession();

                    return;
                }

                setUser(savedUser);
            } catch {
                // Uma falha de leitura não deve apagar uma sessão potencialmente válida.
                setSessionError("Não foi possível recuperar sua sessão. Tente novamente.");
                setUser(null);
            } finally {
                setLoadingSession(false);
            }
        }

        restoreSession();
    }, [sessionAttempt]);

    // Login e cadastro compartilham a gravação da sessão, mas mantêm mensagens próprias.
    async function completeAuthentication(result, sessionErrorMessage) {
        if (!result.success) return result;
        try {
            await saveSession(result.user.id);
            setUser(result.user);
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

    // Encerra a sessão atual e remove seus dados do armazenamento seguro.
    async function logout() {
        try {
            await clearSession();
            setUser(null);
            return { success: true };
        } catch {
            return { success: false, message: "Não foi possível encerrar a sessão. Tente novamente." };
        }
    }

    // Centraliza os dados e ações de autenticação disponíveis para o aplicativo.
    const authData = {
        user: user,
        loadingSession: loadingSession,
        login: login,
        register: register,
        logout: logout,
        sessionError,
        retrySession: () => setSessionAttempt((previous) => previous + 1),
    };

    return (
        <AuthContext.Provider value={authData}>
            {children}
        </AuthContext.Provider>
    );
}

// Permite acessar a autenticação de forma simples em qualquer tela.
export function useAuth() {
    const context = useContext(AuthContext);

    // Impede o uso do contexto fora da estrutura preparada pelo AuthProvider.
    if (context === null) {
        throw new Error(
            "useAuth precisa ser utilizado dentro de AuthProvider."
        );
    }

    return context;
}
