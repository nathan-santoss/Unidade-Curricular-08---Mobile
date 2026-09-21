import { StyleSheet } from "react-native";

// Elementos visuais compartilhados pelas telas, mantendo a identidade existente.
export const commonStyles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F7F7F7" },
    content: { flexGrow: 1, padding: 20, gap: 20 },
    title: { fontSize: 28, fontWeight: "700", color: "#1F1F1F" },
    subtitle: { fontSize: 15, lineHeight: 22, color: "#6B6B6B", marginTop: 6 },
    sectionTitle: { fontSize: 20, fontWeight: "700", color: "#1F1F1F" },
    card: { padding: 18, backgroundColor: "#FFFFFF", borderRadius: 12, gap: 8 },
    label: { fontSize: 14, fontWeight: "600", color: "#444444" },
    value: { fontSize: 16, lineHeight: 24, color: "#1F1F1F" },
    field: { gap: 8 },
    input: {
        minHeight: 50, borderWidth: 1, borderColor: "#D8D8D8", borderRadius: 10,
        paddingHorizontal: 14, paddingVertical: 12, backgroundColor: "#FFFFFF",
        fontSize: 16, color: "#1F1F1F",
    },
    descriptionInput: { minHeight: 130, textAlignVertical: "top" },
    actions: { gap: 12, marginTop: 8 },
    error: { color: "#B91C1C", fontSize: 15, lineHeight: 22 },
    center: { flex: 1, padding: 24, justifyContent: "center", gap: 16 },
});
