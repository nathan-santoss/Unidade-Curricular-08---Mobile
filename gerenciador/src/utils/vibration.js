import { Platform, Vibration } from "react-native";

// O iOS usa a duração padrão; no Android a confirmação é uma vibração curta.
export function vibrateFeedback() {
    try {
        if (Platform.OS === "ios") {
            Vibration.vibrate();
        } else if (Platform.OS === "android") {
            Vibration.vibrate(150);
        }
    } catch {
        // Ausência de suporte tátil não deve interromper a ação do usuário.
    }
}
