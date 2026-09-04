import { View, Text, TextInput } from "react-native"
import { form_css } from "../../styles/homeStyles.js"

export default function FormTask() {


    return(
        <View>
            <Text style={form_css.label}>Título</Text>
            <TextInput
                style={form_css.input}
                placeholder="Digite o título"
            />
        </View>
    )
}