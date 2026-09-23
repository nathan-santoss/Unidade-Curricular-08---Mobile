import AsyncStorage from "@react-native-async-storage/async-storage";

// Incluo o ID na chave para cada conta manter sua própria preferência.
function preferenceKey(userId) {
    return `preferences.showCompletedTasks.${userId}`;
}

export async function getShowCompletedTasks(userId) {
    try {
        const value = await AsyncStorage.getItem(preferenceKey(userId));
        // Exibo concluídas por padrão quando ainda não encontro uma preferência salva.
        return value !== "false";
    } catch {
        throw new Error("Não foi possível carregar sua preferência. Tente novamente.");
    }
}

export async function saveShowCompletedTasks(userId, showCompleted) {
    try {
        // Transformo o booleano em texto para gravá-lo no AsyncStorage.
        await AsyncStorage.setItem(preferenceKey(userId), String(showCompleted));
    } catch {
        throw new Error("Não foi possível salvar sua preferência. Tente novamente.");
    }
}
