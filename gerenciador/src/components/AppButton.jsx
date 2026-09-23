import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

// Compartilho aparência, carregamento e bloqueio dos botões usados nas telas.
export default function AppButton({ title, onPress, loading = false, disabled = false, variant = "primary" }) {
    // Começo pelo visual padrão e acrescento as diferenças de cada variante.
    const buttonStyles = [styles.button];
    const textStyles = [styles.text];
    let indicatorColor = "#FFFFFF";
    if (variant === "secondary") {
        buttonStyles.push(styles.secondary);
        textStyles.push(styles.secondaryText);
        indicatorColor = "#2563EB";
    } else if (variant === "text") {
        buttonStyles.push(styles.textButton);
        textStyles.push(styles.secondaryText);
        indicatorColor = "#2563EB";
    } else if (variant === "danger") {
        buttonStyles.push(styles.danger);
        textStyles.push(styles.dangerText);
        indicatorColor = "#B91C1C";
    }
    // Reduzo a opacidade para indicar que o botão está temporariamente indisponível.
    if (disabled || loading) buttonStyles.push(styles.disabled);

    // Informo também aos leitores de tela se o botão está ocupado ou desabilitado.
    return (
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: disabled || loading, busy: loading }}
            style={buttonStyles} onPress={onPress} disabled={disabled || loading}>
            {loading && <ActivityIndicator color={indicatorColor} />}
            <Text style={textStyles}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: { minHeight: 50, padding: 12, borderRadius: 10, backgroundColor: "#2563EB", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
    text: { fontSize: 16, fontWeight: "600", color: "#FFFFFF", textAlign: "center" },
    secondary: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CAD5EE" },
    secondaryText: { color: "#2563EB" },
    textButton: { backgroundColor: "transparent" },
    danger: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DC2626" },
    dangerText: { color: "#B91C1C" },
    disabled: { opacity: 0.6 },
});
