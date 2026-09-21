import { StyleSheet } from "react-native";

export const home_css = StyleSheet.create({
    header: { gap: 20 },
    summary: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    summaryCard: { flexGrow: 1, flexBasis: 90, padding: 14, gap: 6, backgroundColor: "#FFFFFF", borderRadius: 12 },
    count: { fontSize: 28, fontWeight: "700", color: "#2563EB" },
    summaryLabel: { color: "#555555", fontSize: 13 },
});
