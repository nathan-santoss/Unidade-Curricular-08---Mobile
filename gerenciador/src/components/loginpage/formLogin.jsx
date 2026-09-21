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

    // Altera o texto do botão enquanto o login estiver sendo processado.
    if (loading === true) {
        loginButtonText = "Entrando...";
    }

    // Envia as credenciais para a autenticação e libera o acesso quando forem válidas.
    async function fazerLogin() {
        if (loading) return;
        setLoading(true);

        const result = await login(
            email,
            senha
        );

        setLoading(false);

        // Exibe para o usuário o motivo quando a autenticação não for concluída.
        if (result.success === false) {
            Alert.alert(
                "Não foi possível entrar",
                result.message
            );

            return;
        }

        // O AuthContext atualizado faz a navegação abrir a área principal.
    }

    return (
        <View style={login_css.formContainer}>
            {/* Identifica a finalidade principal do formulário. */}
            <Text style={login_css.titulo}>
                Realize Login
            </Text>

            {/* Campo utilizado para localizar o usuário cadastrado. */}
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

            {/* Campo protegido utilizado para validar a senha da conta. */}
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
