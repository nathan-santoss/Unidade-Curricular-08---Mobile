import { Text, TextInput, View } from "react-native";
import { commonStyles as styles } from "../styles/commonStyles.js";

// Agrupa rótulo, campo e estilo, preservando as opções nativas do TextInput.
export default function AppInput({ label, style, ...inputProps }) {
    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <TextInput accessibilityLabel={label} placeholderTextColor="#777777"
                {...inputProps} style={[styles.input, style]} />
        </View>
    );
}
