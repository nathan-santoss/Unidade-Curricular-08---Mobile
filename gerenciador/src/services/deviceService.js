import * as Device from "expo-device";

function getDeviceTypeLabel(type) {
    switch (type) {
        case Device.DeviceType.PHONE: return "Celular";
        case Device.DeviceType.TABLET: return "Tablet";
        case Device.DeviceType.DESKTOP: return "Computador";
        case Device.DeviceType.TV: return "TV";
        default: return "Não identificado";
    }
}

export async function getDeviceInformation() {
    const type = await Device.getDeviceTypeAsync();
    let environment = "Virtual (emulador ou simulador)";
    if (Device.isDevice) environment = "Dispositivo físico";

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
