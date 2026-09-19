import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TasksPage({ navigation }) {
    // Abre o formulário responsável pelo cadastro de uma nova tarefa.
    const abrirFormulario = () => {
        navigation.navigate("TaskForm");
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Organiza o título e a ação principal da tela. */}
            <View style={styles.header}>
                <View style={styles.headerText}>
                    <Text style={styles.title}>
                        Minhas tarefas
                    </Text>

                    <Text style={styles.subtitle}>
                        Organize e acompanhe suas atividades.
                    </Text>
                </View>

                {/* Leva o usuário para o formulário de cadastro. */}
                <Pressable
                    style={styles.addButton}
                    onPress={abrirFormulario}
                >
                    <Text style={styles.addButtonText}>
                        + Nova tarefa
                    </Text>
                </Pressable>
            </View>

            {/*
        Estado exibido enquanto ainda não existem tarefas cadastradas.
        Depois esta área será substituída pela lista carregada do SQLite.
      */}
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>
                    Nenhuma tarefa cadastrada
                </Text>

                <Text style={styles.emptyText}>
                    Adicione uma tarefa para começar a organizar suas atividades.
                </Text>
            </View>
        </SafeAreaView>
    );
}

// Mantém os estilos específicos desta tela no mesmo arquivo.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F7F7",
        paddingHorizontal: 20,
    },

    header: {
        paddingTop: 24,
        gap: 20,
    },

    headerText: {
        gap: 6,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1F1F1F",
    },

    subtitle: {
        fontSize: 15,
        color: "#6B6B6B",
    },

    addButton: {
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "#2563EB",
    },

    addButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333333",
        textAlign: "center",
    },

    emptyText: {
        marginTop: 8,
        fontSize: 14,
        color: "#777777",
        textAlign: "center",
        lineHeight: 20,
    },
});