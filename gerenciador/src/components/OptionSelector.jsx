import { Pressable, StyleSheet, Text, View } from "react-native";

// Reutilizo este seletor em prioridades, status e filtros; deixo a ação com a tela que o chamou.
export default function OptionSelector({ options, value, onChange, disabled = false }) {
    return (
        <View style={styles.options}>
            {options.map((option) => {
                // Comparo os valores para destacar somente a opção escolhida.
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
                        // Devolvo o valor da opção para a tela atualizar seu estado ou salvar a mudança.
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
