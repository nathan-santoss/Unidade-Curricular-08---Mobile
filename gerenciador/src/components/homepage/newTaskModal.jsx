import { View, Text, TouchableOpacity, Modal } from "react-native";
import { modal_css } from "../../styles/homeStyles.js";
import FormTask from "./formTask.jsx";

export default function ModalTask({ visivel, closeWin, addTask }) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visivel}
            onRequestClose={closeWin}
            statusBarTranslucent={true}
        >
            <View style={modal_css.fundoEscuro}>
                <View style={modal_css.cartaoConteudo}>
                    <Text style={modal_css.titulo}>
                        Preencha os dados abaixo
                    </Text>
                    <FormTask/>

                    <View style={modal_css.containerBotoes}>
                        <TouchableOpacity
                            style={modal_css.botaoAdicionar}
                            onPress={addTask}
                        >
                            <Text style={modal_css.textoBotaoAdicionar}>
                                Adicionar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={modal_css.botaoFechar}
                            onPress={closeWin}
                        >
                            <Text style={modal_css.textoBotaoFechar}>
                                Fechar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}