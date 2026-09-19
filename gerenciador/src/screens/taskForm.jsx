import { useState } from "react";
import {
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TaskFormPage({ navigation }) {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");

    // Retorna para a tela anterior sem salvar alterações.
    const cancelarCadastro = () => {
        navigation.goBack();
    };

    // Por enquanto apenas valida o formulário.
    // O salvamento será conectado ao SQLite em uma etapa posterior.
    const salvarTarefa = () => {
        if (titulo.trim() === "") {
            return;
        }

        console.log("Tarefa pronta para ser salva:", {
            titulo: titulo,
            descricao: descricao,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Evita que o teclado cubra os campos durante o preenchimento. */}
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior="padding"
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Cabeçalho do formulário. */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Nova tarefa</Text>

                        <Text style={styles.subtitle}>
                            Preencha as informações da atividade.
                        </Text>
                    </View>

                    {/* Campo obrigatório utilizado como nome principal da tarefa. */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Título</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Digite o título da tarefa"
                            placeholderTextColor="#8A8A8A"
                            value={titulo}
                            onChangeText={setTitulo}
                        />
                    </View>

                    {/* Campo opcional para adicionar informações complementares. */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Descrição</Text>

                        <TextInput
                            style={[styles.input, styles.descriptionInput]}
                            placeholder="Digite uma descrição"
                            placeholderTextColor="#8A8A8A"
                            value={descricao}
                            onChangeText={setDescricao}
                            multiline={true}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Agrupa as ações principais do formulário. */}
                    <View style={styles.actions}>
                        <Pressable
                            style={styles.cancelButton}
                            onPress={cancelarCadastro}
                        >
                            <Text style={styles.cancelButtonText}>
                                Cancelar
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.saveButton}
                            onPress={salvarTarefa}
                        >
                            <Text style={styles.saveButtonText}>
                                Salvar tarefa
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// Mantém os estilos específicos do formulário concentrados nesta tela.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F7F7",
    },

    keyboardContainer: {
        flex: 1,
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 32,
    },

    header: {
        marginBottom: 28,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1F1F1F",
    },

    subtitle: {
        marginTop: 6,
        fontSize: 15,
        color: "#6B6B6B",
    },

    field: {
        marginBottom: 20,
    },

    label: {
        marginBottom: 8,
        fontSize: 14,
        fontWeight: "600",
        color: "#333333",
    },

    input: {
        minHeight: 50,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: "#D8D8D8",
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        fontSize: 16,
        color: "#1F1F1F",
    },

    descriptionInput: {
        minHeight: 130,
        paddingTop: 14,
        paddingBottom: 14,
    },

    actions: {
        marginTop: "auto",
        gap: 12,
    },

    cancelButton: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#CFCFCF",
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
    },

    cancelButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#444444",
    },

    saveButton: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "#2563EB",
    },

    saveButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
    },
});