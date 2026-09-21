import AsyncStorage from "@react-native-async-storage/async-storage";

// Cada conta mantém sua preferência; tarefas continuam exclusivamente no SQLite.
function preferenceKey(userId) {
    return `preferences.showCompletedTasks.${userId}`;
}

export async function getShowCompletedTasks(userId) {
    try {
        const value = await AsyncStorage.getItem(preferenceKey(userId));
        return value !== "false";
    } catch {
        throw new Error("Não foi possível carregar sua preferência. Tente novamente.");
    }
}

export async function saveShowCompletedTasks(userId, showCompleted) {
    try {
        await AsyncStorage.setItem(preferenceKey(userId), String(showCompleted));
    } catch {
        throw new Error("Não foi possível salvar sua preferência. Tente novamente.");
    }
}
