import { Pressable, StyleSheet, Text, View } from "react-native";

// Reutilizado para prioridade, status e filtros, sem acessar regras ou banco.
export default function OptionSelector({ options, value, onChange, disabled = false }) {
    return (
        <View style={styles.options}>
            {options.map((option) => {
                const selected = option.value === value;
                const buttonStyle = [styles.option];
                const textStyle = [styles.text];
                if (selected) {
                    buttonStyle.push(styles.selected);
                    textStyle.push(styles.selectedText);
                }
                if (disabled) buttonStyle.push(styles.disabled);
                return (
                    <Pressable key={option.value} style={buttonStyle} disabled={disabled}
                        accessibilityRole="radio" accessibilityState={{ checked: selected, disabled }}
                        onPress={() => onChange(option.value)}>
                        <Text style={textStyle}>{option.label}</Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    options: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    option: { minHeight: 44, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 10, borderWidth: 1, borderColor: "#D8D8D8", backgroundColor: "#FFFFFF", justifyContent: "center" },
    selected: { borderColor: "#2563EB", backgroundColor: "#EAF0FF" },
    text: { fontSize: 14, color: "#555555" },
    selectedText: { color: "#1D4ED8", fontWeight: "700" },
    disabled: { opacity: 0.6 },
});
