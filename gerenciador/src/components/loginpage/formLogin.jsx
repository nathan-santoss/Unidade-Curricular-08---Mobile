import { useState } from "react";
import {
    Alert,
    Text,
    TextInput,
    View,
} from "react-native";

import { login_css } from "../../styles/loginStyles.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import AppButton from "../AppButton.jsx";

export default function FormLogin({
    openRegister,
}) {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    let loginButtonText = "Entrar";

    // Sinalizo no botão que a tentativa de entrada está em andamento.
    if (loading === true) {
        loginButtonText = "Entrando...";
    }

    // Encaminho e-mail e senha ao contexto, que coordena a autenticação e a sessão.
    async function fazerLogin() {
        // Enquanto aguardo a resposta, bloqueio uma segunda tentativa de entrada.
        if (loading) return;
        setLoading(true);

        const result = await login(
            email,
            senha
        );

        setLoading(false);

        // Apresento a mensagem retornada quando não consigo concluir a entrada.
        if (result.success === false) {
            Alert.alert(
                "Não foi possível entrar",
                result.message
            );

            return;
        }

        // Delego ao contexto a mudança que libera a navegação da conta.
    }

    return (
        <View style={login_css.formContainer}>
            {/* Apresento o título que identifica a tela de entrada. */}
            <Text style={login_css.titulo}>
                Realize Login
            </Text>

            {/* Conecto o texto digitado ao estado do e-mail usado para localizar a conta. */}
            <TextInput
                style={login_css.input}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#888888"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
            />

            {/* Oculto os caracteres na tela enquanto guardo a senha digitada no estado. */}
            <TextInput
                style={login_css.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#888888"
                secureTextEntry={true}
                value={senha}
                onChangeText={setSenha}
            />

            <AppButton title={loginButtonText} onPress={fazerLogin} loading={loading} />
            <AppButton title="Criar uma conta" variant="text" onPress={openRegister} disabled={loading} />
        </View>
    );
}
