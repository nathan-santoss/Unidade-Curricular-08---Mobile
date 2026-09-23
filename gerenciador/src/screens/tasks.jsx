import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useUserTasks } from "../hooks/useUserTasks.js";
import { getShowCompletedTasks } from "../services/preferencesService.js";
import { STATUS_OPTIONS, TASK_STATUS } from "../constants/taskConstants.js";
import AppButton from "../components/AppButton.jsx";
import TaskCard from "../components/TaskCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import OptionSelector from "../components/OptionSelector.jsx";
import { commonStyles } from "../styles/commonStyles.js";

// Acrescento a opção Todas aos status que já uso no restante do aplicativo.
const FILTER_OPTIONS = [{ value: "ALL", label: "Todas" }, ...STATUS_OPTIONS];

export default function TasksPage({ navigation }) {
    const { user } = useAuth();
    const { tasks, loading, error, reload } = useUserTasks();
    const [filter, setFilter] = useState("ALL");
    const [showCompleted, setShowCompleted] = useState(true);
    const [preferencesLoading, setPreferencesLoading] = useState(true);
    const [preferencesError, setPreferencesError] = useState("");
    const [attempt, setAttempt] = useState(0);

    // Releio a preferência ao voltar à lista, pois ela pode ter mudado no Perfil.
    useFocusEffect(useCallback(() => {
        let active = true;
        setPreferencesLoading(true);
        setPreferencesError("");
        async function loadPreference() {
            try {
                const value = await getShowCompletedTasks(user.id);
                if (active) setShowCompleted(value);
            } catch (failure) {
                if (active) setPreferencesError(failure.message);
            } finally {
                if (active) setPreferencesLoading(false);
            }
        }
        loadPreference();
        return () => { active = false; };
    }, [user.id, attempt]));

    // Combino a preferência de concluídas com o filtro de status sem alterar as tarefas salvas.
    const visibleTasks = tasks.filter((task) => {
        if (!showCompleted && task.status === TASK_STATUS.COMPLETED) return false;
        if (filter !== "ALL" && task.status !== filter) return false;
        return true;
    });

    // Repito tanto a consulta das tarefas quanto a leitura da preferência.
    function retry() {
        reload();
        setAttempt((value) => value + 1);
    }

    let content;
    if (loading || preferencesLoading) {
        content = <ActivityIndicator style={styles.loading} size="large" color="#2563EB" />;
    } else if (error || preferencesError) {
        content = (
            <View style={commonStyles.center}>
                <Text style={commonStyles.error}>{error || preferencesError}</Text>
                <AppButton title="Tentar novamente" onPress={retry} />
            </View>
        );
    } else {
        let emptyTitle = "Nenhuma tarefa neste filtro";
        let emptyMessage = "Escolha outro status ou confira sua preferência no Perfil.";
        // Diferencio uma conta sem tarefas de um filtro que apenas não encontrou resultados.
        if (tasks.length === 0) {
            emptyTitle = "Nenhuma tarefa cadastrada";
            emptyMessage = "Adicione uma tarefa para começar a organizar suas atividades.";
        }
        content = (
            <FlatList data={visibleTasks} keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.list} ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                renderItem={({ item }) => <TaskCard task={item} onPress={() => navigation.navigate("TaskDetails", { taskId: item.id })} />}
                ListEmptyComponent={<EmptyState title={emptyTitle} message={emptyMessage} />} />
        );
    }

    return (
        <SafeAreaView style={commonStyles.screen} edges={["top", "left", "right"]}>
            <View style={styles.header}>
                <View>
                    <Text style={commonStyles.title}>Minhas tarefas</Text>
                    <Text style={commonStyles.subtitle}>Organize e acompanhe suas atividades.</Text>
                </View>
                <AppButton title="+ Nova tarefa" onPress={() => navigation.navigate("TaskForm")} />
                <OptionSelector options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
                {/* Explico por que uma tarefa concluída pode não aparecer na lista. */}
                {!showCompleted && <Text style={styles.notice}>Concluídas ocultas. Altere essa preferência no Perfil.</Text>}
            </View>
            {content}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: { padding: 20, gap: 16 },
    list: { paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 },
    loading: { marginTop: 40 },
    notice: { color: "#6B6B6B", fontSize: 13, lineHeight: 18 },
});
