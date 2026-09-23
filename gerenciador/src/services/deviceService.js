import * as Device from "expo-device";

// Traduzo o código do aparelho para uma descrição fácil de ler na tela.
function getDeviceTypeLabel(type) {
    switch (type) {
        case Device.DeviceType.PHONE: return "Celular";
        case Device.DeviceType.TABLET: return "Tablet";
        case Device.DeviceType.DESKTOP: return "Computador";
        case Device.DeviceType.TV: return "TV";
        default: return "Não identificado";
    }
}

// Consulto o aparelho em uso para mostrar informações reais nas Configurações.
export async function getDeviceInformation() {
    const type = await Device.getDeviceTypeAsync();
    // Distingo um aparelho físico de um ambiente virtual de desenvolvimento.
    let environment = "Virtual (emulador ou simulador)";
    if (Device.isDevice) environment = "Dispositivo físico";

    // Organizo rótulo e valor no mesmo formato e indico quando um dado não está disponível.
    return [
        { label: "Modelo", value: Device.modelName },
        { label: "Sistema operacional", value: Device.osName },
        { label: "Versão do sistema", value: Device.osVersion },
        { label: "Marca", value: Device.brand },
        { label: "Fabricante", value: Device.manufacturer },
        { label: "Ambiente", value: environment },
        { label: "Classe do dispositivo", value: getDeviceTypeLabel(type) },
    ].map((info) => ({ ...info, value: info.value || "Não informado pelo dispositivo" }));
}
