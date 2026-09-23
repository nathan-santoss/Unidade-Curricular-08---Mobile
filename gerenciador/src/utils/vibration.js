import { Platform, Vibration } from "react-native";

// Adapto a confirmação tátil: uso a duração padrão no iOS e 150 milissegundos no Android.
export function vibrateFeedback() {
    try {
        if (Platform.OS === "ios") {
            Vibration.vibrate();
        } else if (Platform.OS === "android") {
            Vibration.vibrate(150);
        }
    } catch {
        // Preservo a ação principal mesmo quando o aparelho não consegue vibrar.
    }
}
