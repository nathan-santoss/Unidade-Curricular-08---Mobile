import * as SecureStore from "expo-secure-store";

const SESSION_USER_KEY = "session_user_id";

// Salvo apenas o ID da conta para reconhecer a sessão na próxima abertura.
export async function saveSession(userId) {
    // Converto o número em texto porque o SecureStore recebe valores nesse formato.
    const userIdText = String(userId);

    await SecureStore.setItemAsync(
        SESSION_USER_KEY,
        userIdText
    );
}

// Leio o ID salvo para tentar restaurar a sessão ao iniciar o aplicativo.
export async function getSavedSessionUserId() {
    const savedUserId = await SecureStore.getItemAsync(
        SESSION_USER_KEY
    );

    // Indico com null que ainda não há uma conta conectada.
    if (savedUserId === null) {
        return null;
    }

    const userId = Number(savedUserId);

    // Descarto valores inválidos para não consultar uma conta com um ID corrompido.
    if (!Number.isSafeInteger(userId) || userId <= 0) {
        await clearSession();
        return null;
    }

    return userId;
}

// Removo a referência da sessão sem apagar o cadastro nem as tarefas.
export async function clearSession() {
    await SecureStore.deleteItemAsync(
        SESSION_USER_KEY
    );
}
