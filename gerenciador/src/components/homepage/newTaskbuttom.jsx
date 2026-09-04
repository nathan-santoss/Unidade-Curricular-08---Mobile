import { View, Text, TouchableOpacity } from "react-native";
import { button_css } from "../../styles/homeStyles.js";

export default function ButtonNewTask({ onCreatTask }) {
    const criarTask = () => {
        onCreatTask();
        console.log('Usuário encaminhado para tela de criação de "novo compromisso"');
    };

    return (
        <View>
            <TouchableOpacity
                style={button_css.botaoNovoCompromisso}
                onPress={criarTask}
            >
                <Text style={button_css.textoBotaoNovoCompromisso}>
                    Novo compromisso
                </Text>
            </TouchableOpacity>
        </View>
    );
}