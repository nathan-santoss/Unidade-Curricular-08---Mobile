import { SafeAreaView } from "react-native-safe-area-context";
import { login_css } from "../styles/loginStyles";

import FormLogin from "../components/loginpage/formLogin.jsx";

export default function LoginPage() {
    return (
        <SafeAreaView style={login_css.container}>
            <FormLogin/>
        </SafeAreaView>
    );
}