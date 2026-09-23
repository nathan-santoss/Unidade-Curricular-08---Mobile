import { Text, TextInput, View } from "react-native";
import { commonStyles as styles } from "../styles/commonStyles.js";

// Agrupo rótulo e campo para manter o mesmo padrão visual nos formulários.
export default function AppInput({ label, style, ...inputProps }) {
    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            {/* Encaminho as opções recebidas e aplico o estilo específico sobre o padrão do campo. */}
            <TextInput accessibilityLabel={label} placeholderTextColor="#777777"
                {...inputProps} style={[styles.input, style]} />
        </View>
    );
}
