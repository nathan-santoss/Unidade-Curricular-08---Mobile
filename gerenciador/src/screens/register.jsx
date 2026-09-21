import { useState } from "react";
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext.jsx";
import AppInput from "../components/AppInput.jsx";
import AppButton from "../components/AppButton.jsx";
import { commonStyles } from "../styles/commonStyles.js";

export default function RegisterPage({ navigation }) {
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    let registerButtonText = "Cadastrar";
    if (loading) registerButtonText = "Cadastrando...";

    // O serviço valida os dados; a tela confere apenas a confirmação de senha.
    async function cadastrarUsuario() {
        if (loading) return;
        if (password !== confirmPassword) {
            Alert.alert("Atenção", "As senhas informadas são diferentes.");
            return;
        }

        setLoading(true);
        const result = await register(name, email, password);
        setLoading(false);
        if (!result.success) {
            Alert.alert("Não foi possível cadastrar", result.message);
        }
        // O AuthContext atualizado faz a navegação abrir a área principal.
    }

    return (
        <SafeAreaView style={commonStyles.screen}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <Text style={styles.title}>Criar conta</Text>
                        <Text style={styles.subtitle}>Preencha seus dados para começar a organizar suas tarefas.</Text>
                    </View>
                    <View style={styles.form}>
                        <AppInput label="Nome" placeholder="Digite seu nome" value={name}
                            onChangeText={setName} autoCapitalize="words" editable={!loading} />
                        <AppInput label="E-mail" placeholder="Digite seu e-mail" value={email}
                            onChangeText={setEmail} autoCapitalize="none" autoCorrect={false}
                            keyboardType="email-address" editable={!loading} />
                        <AppInput label="Senha" placeholder="Digite sua senha" value={password}
                            onChangeText={setPassword} secureTextEntry editable={!loading} />
                        <AppInput label="Confirmar senha" placeholder="Digite novamente sua senha" value={confirmPassword}
                            onChangeText={setConfirmPassword} secureTextEntry editable={!loading} />
                    </View>
                    <View style={styles.actions}>
                        <AppButton title={registerButtonText} onPress={cadastrarUsuario} loading={loading} />
                        <AppButton title="Já tenho uma conta" variant="text" onPress={() => navigation.goBack()} disabled={loading} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// Mantém apenas o espaçamento e a tipografia próprios do cadastro.
const styles = StyleSheet.create({
    content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 30 },
    header: { marginBottom: 32 },
    title: { fontSize: 30, fontWeight: "700", color: "#1F1F1F" },
    subtitle: { marginTop: 8, fontSize: 15, lineHeight: 22, color: "#6B6B6B" },
    form: { gap: 18 },
    actions: { marginTop: 32, gap: 12 },
});
