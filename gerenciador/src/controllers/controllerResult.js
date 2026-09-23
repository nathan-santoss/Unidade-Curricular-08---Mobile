// Padronizo a resposta dos controllers para as telas verificarem success e message.
// Recebo uma função com a operação e os dados que devo devolver se houver falha.
export async function executeController(operation, emptyData = {}) {
    try {
        // Aguardo a operação terminar antes de informar sucesso à tela.
        const data = await operation();
        return { success: true, ...data, message: "" };
    } catch (error) {
        // Repasso a mensagem do erro e mantenho campos como task ou user com valor vazio.
        return { success: false, ...emptyData, message: error.message };
    }
}
