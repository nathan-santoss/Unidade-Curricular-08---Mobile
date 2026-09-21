import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useUserTasks } from "../hooks/useUserTasks.js";
import { STATUS_OPTIONS } from "../constants/taskConstants.js";
import AppButton from "../components/AppButton.jsx";
import EmptyState from "../components/EmptyState.jsx";
import TaskCard from "../components/TaskCard.jsx";
import { commonStyles } from "../styles/commonStyles.js";
import { home_css as styles } from "../styles/homeStyles.js";

export default function HomePage({ navigation }) {
    const { user } = useAuth();
    const { tasks, loading, error, reload } = useUserTasks();

    function openTask(taskId) {
        // Mantém a lista como primeira rota mesmo ao abrir detalhes a partir da Home.
        navigation.navigate("Tasks", { screen: "TaskDetails", params: { taskId }, initial: false });
    }

    const header = (
        <View style={styles.header}>
            <View>
                <Text style={commonStyles.title}>Olá, {user.name}</Text>
                <Text style={commonStyles.subtitle}>Um passo de cada vez. Vamos organizar seu dia?</Text>
            </View>
            <AppButton title="+ Nova tarefa" onPress={() => navigation.navigate("Tasks", { screen: "TaskForm", params: { taskId: undefined }, initial: false })} />
            <Text style={commonStyles.sectionTitle}>Resumo</Text>
            {loading && <ActivityIndicator color="#2563EB" size="large" />}
            {Boolean(error) && <View style={styles.header}><Text style={commonStyles.error}>{error}</Text><AppButton title="Tentar novamente" onPress={reload} /></View>}
            {!loading && !error && (
                <View style={styles.summary}>
                    {STATUS_OPTIONS.map((option) => (
                        <View key={option.value} style={styles.summaryCard}>
                            <Text style={styles.count}>{tasks.filter((task) => task.status === option.value).length}</Text>
                            <Text style={styles.summaryLabel}>{option.label}</Text>
                        </View>
                    ))}
                </View>
            )}
            {!loading && !error && <Text style={commonStyles.sectionTitle}>Tarefas recentes</Text>}
        </View>
    );

    let recentTasks = [];
    let emptyState = null;
    if (!loading && !error) {
        recentTasks = tasks.slice(0, 3);
        emptyState = <EmptyState title="Seu dia começa aqui" message="Crie sua primeira tarefa usando o botão acima." />;
    }

    return (
        <SafeAreaView style={commonStyles.screen} edges={["top", "left", "right"]}>
            <FlatList data={recentTasks} keyExtractor={(item) => String(item.id)} contentContainerStyle={commonStyles.content}
                ListHeaderComponent={header} ListEmptyComponent={emptyState}
                renderItem={({ item }) => <TaskCard task={item} onPress={() => openTask(item.id)} />} />
        </SafeAreaView>
    );
}
