import * as SecureStore from "expo-secure-store";

const SESSION_USER_KEY = "session_user_id";

// Salva o identificador do usuário autenticado para manter a sessão no dispositivo.
export async function saveSession(userId) {
    const userIdText = String(userId);

    await SecureStore.setItemAsync(
        SESSION_USER_KEY,
        userIdText
    );
}

// Recupera o usuário salvo anteriormente para restaurar a sessão ao abrir o aplicativo.
export async function getSavedSessionUserId() {
    const savedUserId = await SecureStore.getItemAsync(
        SESSION_USER_KEY
    );

    // Retorna nulo quando nenhuma sessão estiver armazenada.
    if (savedUserId === null) {
        return null;
    }

    const userId = Number(savedUserId);

    // Evita retornar um identificador inválido caso o valor salvo esteja corrompido.
    if (!Number.isSafeInteger(userId) || userId <= 0) {
        await clearSession();
        return null;
    }

    return userId;
}

// Remove os dados da sessão quando o usuário sair da conta.
export async function clearSession() {
    await SecureStore.deleteItemAsync(
        SESSION_USER_KEY
    );
}
