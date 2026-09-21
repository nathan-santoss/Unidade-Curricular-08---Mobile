// Todas as operações devolvem o mesmo formato de sucesso/erro para a interface.
// Cada controller informa apenas a operação e os dados vazios em caso de falha.
export async function executeController(operation, emptyData = {}) {
    try {
        const data = await operation();
        return { success: true, ...data, message: "" };
    } catch (error) {
        return { success: false, ...emptyData, message: error.message };
    }
}
