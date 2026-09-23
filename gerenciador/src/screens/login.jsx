import { KeyboardAvoidingView, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { login_css } from "../styles/loginStyles.js";
import FormLogin from "../components/loginpage/formLogin.jsx";

// Organizo a tela de entrada e passo ao formulário a ação de abrir o cadastro.
export default function LoginPage({ navigation }) {
    return (
        <SafeAreaView style={login_css.container}>
            {/* Ajusto a área do formulário quando o teclado aparece e permito rolar o conteúdo. */}
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <FormLogin openRegister={() => navigation.navigate("Register")} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
