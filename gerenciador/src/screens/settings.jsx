import { useEffect, useState } from "react";
import { Alert, AppState, Linking, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getDeviceInformationController, getNotificationPermissionController } from "../controllers/settingsController.js";
import { vibrateFeedback } from "../utils/vibration.js";
import AppButton from "../components/AppButton.jsx";
import { commonStyles as styles } from "../styles/commonStyles.js";

export default function SettingsPage({ navigation }) {
    const { reminderWarning, refreshReminders } = useAuth();
    // Separo os dados do aparelho dos estados de consulta e de atualização dos lembretes.
    const [information, setInformation] = useState([]);
    const [loadingDevice, setLoadingDevice] = useState(false);
    const [permissionLabel, setPermissionLabel] = useState("Consultando permissão...");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        let active = true;
        async function loadPermission() {
            const result = await getNotificationPermissionController();
            // Ignoro a consulta concluída depois de sair desta tela.
            if (!active) return;
            if (result.success) setPermissionLabel(result.permission.label);
            else setPermissionLabel("Não foi possível consultar a permissão.");
        }
        loadPermission();
        // Reconsulto a permissão quando volto dos ajustes do aparelho para o aplicativo.
        const subscription = AppState.addEventListener("change", (state) => {
            if (state === "active") loadPermission();
        });
        return () => { active = false; subscription.remove(); };
    }, []);

    // Vibro no toque e consulto os dados do aparelho para preencher os cartões.
    async function showDeviceInformation() {
        if (loadingDevice) return;
        vibrateFeedback();
        setLoadingDevice(true);
        const result = await getDeviceInformationController();
        setLoadingDevice(false);
        if (!result.success) {
            Alert.alert("Dispositivo", "Não foi possível consultar as informações. Tente novamente.");
            return;
        }
        setInformation(result.information);
    }

    // Tento obter a autorização antes de recriar os lembretes das tarefas futuras.
    async function activateReminders() {
        if (updating) return;
        setUpdating(true);
        const result = await getNotificationPermissionController(true);
        if (!result.success) {
            Alert.alert("Notificações", "Não foi possível configurar as notificações. Tente novamente.");
        } else {
            setPermissionLabel(result.permission.label);
            if (!result.permission.allowed) {
                Alert.alert("Permissão necessária", "Autorize notificações nos ajustes do aparelho e depois toque em Ativar ou atualizar lembretes.");
            } else {
                const warning = await refreshReminders();
                let message = "Os lembretes das tarefas não concluídas com data e horário futuros foram atualizados.";
                if (warning) message = warning;
                Alert.alert("Lembretes", message);
            }
        }
        setUpdating(false);
    }

    // Abro os ajustes do sistema para permitir a mudança de uma permissão negada.
    async function openSystemSettings() {
        try {
            await Linking.openSettings();
        } catch {
            Alert.alert("Ajustes", "Abra os ajustes do dispositivo e procure as permissões deste aplicativo.");
        }
    }

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.content}>
                <AppButton title="Voltar ao Perfil" variant="secondary" onPress={() => navigation.goBack()} disabled={updating} />
                <Text style={styles.title}>Configurações</Text>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Lembretes de tarefas</Text>
                    <Text style={styles.value}>{permissionLabel}</Text>
                    <Text style={styles.subtitle}>Preencha data e horário ao criar uma tarefa para receber uma notificação local.</Text>
                    <Text style={styles.subtitle}>Som e vibração dependem dos ajustes do aparelho. No iPhone, confira também o modo Foco e os ajustes táteis.</Text>
                    {Boolean(reminderWarning) && <Text style={styles.error}>{reminderWarning}</Text>}
                    <AppButton title="Ativar ou atualizar lembretes" onPress={activateReminders} loading={updating} />
                    <AppButton title="Abrir ajustes do aparelho" variant="text" onPress={openSystemSettings} disabled={updating} />
                </View>
                <Text style={styles.sectionTitle}>Dispositivo</Text>
                <AppButton title="Informações do dispositivo" onPress={showDeviceInformation} loading={loadingDevice} />
                {/* Crio um cartão para cada informação retornada pelo serviço do dispositivo. */}
                {information.map((info) => (
                    <View key={info.label} style={styles.card}>
                        <Text style={styles.label}>{info.label}</Text>
                        <Text style={styles.value}>{info.value}</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
