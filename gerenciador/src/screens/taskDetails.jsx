import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext.jsx";
import { deleteTaskController, getTaskByIdController, updateTaskStatusController } from "../controllers/taskController.js";
import { getPriorityLabel, getStatusLabel, STATUS_OPTIONS } from "../constants/taskConstants.js";
import { formatDateForDisplay } from "../utils/dateUtils.js";
import AppButton from "../components/AppButton.jsx";
import OptionSelector from "../components/OptionSelector.jsx";
import { commonStyles as styles } from "../styles/commonStyles.js";

export default function TaskDetailsPage({ route, navigation }) {
    const { user } = useAuth();
    const taskId = route.params?.taskId;
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [attempt, setAttempt] = useState(0);

    // Atualiza os detalhes após a edição sem transportar a tarefa inteira pela rota.
    useFocusEffect(useCallback(() => {
        let active = true;
        setLoading(true);
        setError("");
        async function loadTask() {
            const result = await getTaskByIdController(taskId, user.id);
            if (!active) return;
            setTask(result.task);
            setError(result.message);
            setLoading(false);
        }
        loadTask();
        return () => { active = false; };
    }, [taskId, user.id, attempt]));

    async function changeStatus(status) {
        if (busy || task.status === status) return;
        setBusy(true);
        const result = await updateTaskStatusController(taskId, user.id, status);
        setBusy(false);
        if (!result.success) {
            Alert.alert("Não foi possível alterar o status", result.message);
            return;
        }
        setTask(result.task);
    }

    async function deleteTask() {
        if (busy) return;
        setBusy(true);
        const result = await deleteTaskController(taskId, user.id);
        setBusy(false);
        if (!result.success) {
            Alert.alert("Não foi possível excluir", result.message);
            return;
        }
        navigation.goBack();
    }

    function confirmDelete() {
        Alert.alert("Excluir tarefa?", "Esta ação não pode ser desfeita.", [
            { text: "Cancelar", style: "cancel" },
            { text: "Excluir", style: "destructive", onPress: deleteTask },
        ]);
    }

    if (loading) {
        return <SafeAreaView style={styles.center}><ActivityIndicator size="large" color="#2563EB" /></SafeAreaView>;
    }
    if (error || !task) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.error}>{error || "Tarefa não encontrada."}</Text>
                <AppButton title="Tentar novamente" onPress={() => setAttempt((value) => value + 1)} />
                <AppButton title="Voltar" variant="secondary" onPress={() => navigation.goBack()} />
            </SafeAreaView>
        );
    }

    let dueDate = "Sem data limite";
    if (task.due_date) dueDate = formatDateForDisplay(task.due_date);
    let description = "Sem descrição";
    if (task.description) description = task.description;

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <ScrollView contentContainerStyle={styles.content}>
                <AppButton title="Voltar para tarefas" variant="secondary" onPress={() => navigation.goBack()} disabled={busy} />
                <Text style={styles.title}>{task.title}</Text>
                <View style={styles.card}>
                    <Text style={styles.label}>Descrição</Text>
                    <Text style={styles.value}>{description}</Text>
                    <Text style={styles.label}>Data limite</Text>
                    <Text style={styles.value}>{dueDate}</Text>
                    <Text style={styles.label}>Prioridade</Text>
                    <Text style={styles.value}>{getPriorityLabel(task.priority)}</Text>
                    <Text style={styles.label}>Status atual</Text>
                    <Text style={styles.value}>{getStatusLabel(task.status)}</Text>
                </View>
                <View style={styles.field}>
                    <Text style={styles.label}>Alterar status</Text>
                    <OptionSelector options={STATUS_OPTIONS} value={task.status} onChange={changeStatus} disabled={busy} />
                    {busy && <ActivityIndicator color="#2563EB" />}
                </View>
                <View style={styles.actions}>
                    <AppButton title="Editar tarefa" onPress={() => navigation.navigate("TaskForm", { taskId })} disabled={busy} />
                    <AppButton title="Excluir tarefa" variant="danger" onPress={confirmDelete} disabled={busy} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
