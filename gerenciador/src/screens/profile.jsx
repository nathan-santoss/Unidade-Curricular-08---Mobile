import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage({ onLogout }) {
    // Executa o encerramento da sessão quando o usuário tocar em sair.
    const fazerLogout = () => {
        onLogout();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Cabeçalho principal da tela de perfil. */}
            <View style={styles.header}>
                <Text style={styles.title}>Perfil</Text>

                <Text style={styles.subtitle}>
                    Consulte suas informações e preferências.
                </Text>
            </View>

            {/* Exibe temporariamente os dados básicos do usuário. */}
            <View style={styles.content}>
                <View style={styles.infoCard}>
                    <Text style={styles.label}>Nome</Text>
                    <Text style={styles.value}>Usuário</Text>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.label}>E-mail</Text>
                    <Text style={styles.value}>usuario@email.com</Text>
                </View>
            </View>

            {/* Mantém a ação de logout dentro da área relacionada à conta. */}
            <View style={styles.footer}>
                <Pressable
                    style={styles.logoutButton}
                    onPress={fazerLogout}
                >
                    <Text style={styles.logoutText}>
                        Sair da conta
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

// Define apenas os estilos específicos desta tela.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F7F7",
        paddingHorizontal: 20,
    },

    header: {
        marginTop: 24,
        marginBottom: 24,
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

    content: {
        gap: 12,
    },

    infoCard: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 12,
    },

    label: {
        fontSize: 13,
        color: "#777777",
        marginBottom: 4,
    },

    value: {
        fontSize: 16,
        fontWeight: "500",
        color: "#222222",
    },

    footer: {
        marginTop: "auto",
        paddingBottom: 24,
    },

    logoutButton: {
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#DC2626",
        justifyContent: "center",
        alignItems: "center",
    },

    logoutText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#DC2626",
    },
});