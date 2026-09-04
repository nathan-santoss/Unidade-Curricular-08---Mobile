import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity } from "react-native";
import ButtonNewTask from "../components/homepage/newTaskbuttom.jsx";
import ModalTask from "../components/homepage/newTaskModal.jsx";
import { home_css } from "../styles/homeStyles.js";

export default function HomePage({ onLogout }) {
    const fazerLogout = () => {
        console.log('Usuário fez o logout');
        onLogout();
    };

    const [modalVisivel, setModal] = useState(false)

    const abrirModal = () => {setModal(true)}
    const fecharModal = () => {setModal(false)}
    const adicionarTask = () => {console.log('Task adicionada')}

    return (
        <SafeAreaView style={home_css.container}>
            <Text style={home_css.titulo}>
                Bem vindo!
            </Text>

            <ButtonNewTask onCreatTask={abrirModal} />

            <ModalTask
                visivel={modalVisivel}
                closeWin={fecharModal}
                addTask={adicionarTask}
            />

            <TouchableOpacity
                style={home_css.botaoSair}
                onPress={fazerLogout}
            >
                <Text style={home_css.textoBotaoSair}>
                    Sair
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

