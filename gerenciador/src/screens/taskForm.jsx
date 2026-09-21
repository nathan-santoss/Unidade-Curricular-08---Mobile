import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext.jsx";
import { createTaskController, getTaskByIdController, updateTaskController } from "../controllers/taskController.js";
import { PRIORITY_OPTIONS, TASK_PRIORITY } from "../constants/taskConstants.js";
import { formatDateForDisplay } from "../utils/dateUtils.js";
import AppButton from "../components/AppButton.jsx";
import AppInput from "../components/AppInput.jsx";
import OptionSelector from "../components/OptionSelector.jsx";
import { commonStyles as styles } from "../styles/commonStyles.js";

export default function TaskFormPage({ navigation, route }) {
    const { user } = useAuth();
    const taskId = route.params?.taskId;
    const editing = taskId !== undefined;
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState(TASK_PRIORITY.MEDIUM);
    const [loading, setLoading] = useState(editing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [attempt, setAttempt] = useState(0);

    // Um único formulário atende ao cadastro e à edição, recebendo somente o ID.
    useEffect(() => {
        if (!editing) {
            setTitulo("");
            setDescricao("");
            setDueDate("");
            setPriority(TASK_PRIORITY.MEDIUM);
            setError("");
            setLoading(false);
            return;
        }
        let active = true;
        setLoading(true);
        setError("");
        async function loadTask() {
            const result = await getTaskByIdController(taskId, user.id);
            if (!active) return;
            if (result.success) {
                setTitulo(result.task.title);
                setDescricao(result.task.description || "");
                setDueDate(formatDateForDisplay(result.task.due_date));
                setPriority(result.task.priority);
            } else {
                setError(result.message);
            }
            setLoading(false);
        }
        loadTask();
        return () => { active = false; };
    }, [editing, taskId, user.id, attempt]);

    async function salvarTarefa() {
        if (saving || loading || error) return;
        setSaving(true);
        let result;
        if (editing) {
            result = await updateTaskController(taskId, user.id, titulo, descricao, dueDate, priority);
        } else {
            result = await createTaskController(user.id, titulo, descricao, dueDate, priority);
        }
        setSaving(false);
        if (!result.success) {
            Alert.alert("Não foi possível salvar", result.message);
            return;
        }
        navigation.goBack();
    }

    let title = "Nova tarefa";
    if (editing) title = "Editar tarefa";
    let buttonText = "Salvar tarefa";
    if (saving) buttonText = "Salvando...";

    if (loading) {
        return <SafeAreaView style={styles.center}><ActivityIndicator size="large" color="#2563EB" /></SafeAreaView>;
    }
    if (error) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.error}>{error}</Text>
                <AppButton title="Tentar novamente" onPress={() => setAttempt((value) => value + 1)} />
                <AppButton title="Voltar" variant="secondary" onPress={() => navigation.goBack()} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <View>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subtitle}>Preencha as informações da atividade.</Text>
                    </View>
                    <AppInput label="Título *" accessibilityLabel="Título da tarefa" placeholder="Digite o título da tarefa"
                        value={titulo} onChangeText={setTitulo} editable={!saving} />
                    <AppInput label="Descrição (opcional)" accessibilityLabel="Descrição" style={styles.descriptionInput}
                        placeholder="Adicione detalhes" value={descricao} onChangeText={setDescricao} multiline editable={!saving} />
                    <AppInput label="Data limite (opcional)" accessibilityLabel="Data limite, dia mês e ano" placeholder="DD/MM/AAAA"
                        value={dueDate} onChangeText={setDueDate} maxLength={10} editable={!saving} />
                    <View style={styles.field}>
                        <Text style={styles.label}>Prioridade</Text>
                        <OptionSelector options={PRIORITY_OPTIONS} value={priority} onChange={setPriority} disabled={saving} />
                    </View>
                    <View style={styles.actions}>
                        <AppButton title={buttonText} onPress={salvarTarefa} loading={saving} />
                        <AppButton title="Cancelar" variant="secondary" onPress={() => navigation.goBack()} disabled={saving} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
