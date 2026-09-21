import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getShowCompletedTasks, saveShowCompletedTasks } from "../services/preferencesService.js";
import AppButton from "../components/AppButton.jsx";
import { commonStyles } from "../styles/commonStyles.js";

// Endereço conferido no remote origin deste projeto.
const REPOSITORY_URL = "https://github.com/nathan-santoss/Unidade-Curricular-08---Mobile";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [showCompleted, setShowCompleted] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [error, setError] = useState("");
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError("");
        async function loadPreference() {
            try {
                const value = await getShowCompletedTasks(user.id);
                if (active) setShowCompleted(value);
            } catch (failure) {
                if (active) setError(failure.message);
            } finally {
                if (active) setLoading(false);
            }
        }
        loadPreference();
        return () => { active = false; };
    }, [user.id, attempt]);

    async function changePreference(value) {
        if (saving || loading) return;
        setSaving(true);
        try {
            // Só confirma visualmente a alteração depois de persistir a preferência.
            await saveShowCompletedTasks(user.id, value);
            setShowCompleted(value);
        } catch (failure) {
            Alert.alert("Preferências", failure.message);
        } finally {
            setSaving(false);
        }
    }

    async function fazerLogout() {
        if (leaving || saving) return;
        setLeaving(true);
        const result = await logout();
        setLeaving(false);
        if (!result.success) Alert.alert("Não foi possível sair", result.message);
    }

    async function openRepository() {
        try {
            await Linking.openURL(REPOSITORY_URL);
        } catch {
            Alert.alert("Não foi possível abrir o link", "Verifique se há um navegador disponível e tente novamente.");
        }
    }

    return (
        <SafeAreaView style={commonStyles.screen} edges={["top", "left", "right"]}>
            <ScrollView contentContainerStyle={commonStyles.content}>
                <View>
                    <Text style={commonStyles.title}>Perfil</Text>
                    <Text style={commonStyles.subtitle}>Suas informações e preferências.</Text>
                </View>
                <View style={commonStyles.card}>
                    <Text style={commonStyles.label}>Nome</Text>
                    <Text style={commonStyles.value}>{user.name}</Text>
                    <Text style={commonStyles.label}>E-mail</Text>
                    <Text style={commonStyles.value}>{user.email}</Text>
                </View>
                <Text style={commonStyles.sectionTitle}>Preferências</Text>
                <View style={commonStyles.card}>
                    <View style={styles.preference}>
                        <Text style={styles.preferenceLabel}>Mostrar tarefas concluídas</Text>
                        <Switch accessibilityLabel="Mostrar tarefas concluídas" value={showCompleted} onValueChange={changePreference}
                            disabled={loading || saving || leaving || Boolean(error)} trackColor={{ false: "#BDBDBD", true: "#2563EB" }} />
                    </View>
                    <Text style={commonStyles.subtitle}>Controla a exibição de concluídas na lista de tarefas. O resumo da Home sempre considera todas.</Text>
                    {(loading || saving) && <ActivityIndicator color="#2563EB" />}
                    {Boolean(error) && <View style={commonStyles.actions}><Text style={commonStyles.error}>{error}</Text><AppButton title="Tentar novamente" onPress={() => setAttempt((value) => value + 1)} /></View>}
                </View>
                <Text style={commonStyles.sectionTitle}>Sobre o aplicativo</Text>
                <Text style={commonStyles.subtitle}>Gerenciador de tarefas acadêmico. Contas e tarefas ficam neste dispositivo. A consulta ao repositório abre o navegador.</Text>
                <AppButton title="Abrir repositório do projeto" variant="secondary" onPress={openRepository} />
                <AppButton title="Sair da conta" variant="danger" onPress={fazerLogout} loading={leaving} disabled={saving} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    preference: { flexDirection: "row", alignItems: "center", gap: 12 },
    preferenceLabel: { flex: 1, fontSize: 16, fontWeight: "600", color: "#1F1F1F" },
});
