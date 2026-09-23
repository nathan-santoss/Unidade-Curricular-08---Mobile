import { StyleSheet, Text, View } from "react-native";

// Reaproveito uma mensagem com título e orientação quando não há itens para exibir.
export default function EmptyState({ title, message }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { paddingVertical: 36, paddingHorizontal: 16, gap: 8, alignItems: "center" },
    title: { fontSize: 18, fontWeight: "600", color: "#333333", textAlign: "center" },
    message: { fontSize: 15, lineHeight: 22, color: "#6B6B6B", textAlign: "center" },
});
