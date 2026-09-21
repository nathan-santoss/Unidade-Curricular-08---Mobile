import { KeyboardAvoidingView, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { login_css } from "../styles/loginStyles.js";
import FormLogin from "../components/loginpage/formLogin.jsx";

export default function LoginPage({ navigation }) {
    return (
        <SafeAreaView style={login_css.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <FormLogin openRegister={() => navigation.navigate("Register")} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
