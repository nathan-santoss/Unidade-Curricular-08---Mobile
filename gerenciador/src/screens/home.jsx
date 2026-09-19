import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";

import { home_css } from "../styles/homeStyles.js";

export default function HomePage() {
    return (
        // Exibe a área inicial do aplicativo após o login.
        <SafeAreaView style={home_css.container}>
            {/* Mensagem principal da tela inicial. */}
            <Text style={home_css.titulo}>
                Bem-vindo!
            </Text>
        </SafeAreaView>
    );
}