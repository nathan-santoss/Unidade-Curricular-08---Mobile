import { StyleSheet } from "react-native";

// Reúno os ajustes visuais exclusivos do resumo da Home.
export const home_css = StyleSheet.create({
    header: { gap: 20 },
    // Permito quebrar os cartões para a próxima linha quando faltar espaço horizontal.
    summary: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    // Distribuo o espaço disponível entre os cartões a partir de uma largura inicial.
    summaryCard: { flexGrow: 1, flexBasis: 90, padding: 14, gap: 6, backgroundColor: "#FFFFFF", borderRadius: 12 },
    count: { fontSize: 28, fontWeight: "700", color: "#2563EB" },
    summaryLabel: { color: "#555555", fontSize: 13 },
});
