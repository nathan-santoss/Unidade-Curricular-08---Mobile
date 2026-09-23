import { Pressable, StyleSheet, Text, View } from "react-native";
import { getPriorityLabel, getStatusLabel, TASK_PRIORITY, TASK_STATUS } from "../constants/taskConstants.js";
import { formatTaskDeadline } from "../utils/dateUtils.js";

// Apresento um resumo da tarefa e recebo da tela a ação que devo executar ao tocar.
export default function TaskCard({ task, onPress }) {
    // Combino os estilos básicos com cores que ajudam a reconhecer prioridade e conclusão.
    const priorityStyle = [styles.badge];
    if (task.priority === TASK_PRIORITY.HIGH) priorityStyle.push(styles.high);
    if (task.priority === TASK_PRIORITY.LOW) priorityStyle.push(styles.low);
    const statusStyle = [styles.status];
    if (task.status === TASK_STATUS.COMPLETED) statusStyle.push(styles.completed);

    // Descrevo título, status e prioridade para quem utiliza um leitor de tela.
    return (
        <Pressable style={styles.card} onPress={onPress} accessibilityRole="button"
            accessibilityLabel={`${task.title}, ${getStatusLabel(task.status)}, prioridade ${getPriorityLabel(task.priority)}`}>
            <Text style={styles.title} numberOfLines={2}>{task.title}</Text>
            <View style={styles.metadata}>
                <Text style={priorityStyle}>{getPriorityLabel(task.priority)}</Text>
                <Text style={statusStyle}>{getStatusLabel(task.status)}</Text>
            </View>
            {Boolean(task.due_date) && <Text style={styles.date}>Prazo: {formatTaskDeadline(task)}</Text>}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: { padding: 18, backgroundColor: "#FFFFFF", borderRadius: 12, gap: 12, borderWidth: 1, borderColor: "#EBEBEB" },
    title: { fontSize: 17, fontWeight: "600", color: "#1F1F1F" },
    metadata: { flexDirection: "row", alignItems: "center", gap: 12, flexWrap: "wrap" },
    badge: { overflow: "hidden", borderRadius: 6, backgroundColor: "#FEF3C7", color: "#854D0E", paddingHorizontal: 9, paddingVertical: 4, fontSize: 13, fontWeight: "600" },
    high: { backgroundColor: "#FEE2E2", color: "#B91C1C" },
    low: { backgroundColor: "#EAF0FF", color: "#1D4ED8" },
    status: { fontSize: 14, color: "#555555" },
    completed: { color: "#15803D" },
    date: { fontSize: 14, color: "#6B6B6B" },
});
