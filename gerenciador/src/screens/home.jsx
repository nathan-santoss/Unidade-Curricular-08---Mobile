import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity } from "react-native";
import { home_css } from "../styles/homeStyles.js";    

export default function HomePage({onLogout}) {
    const fazerLogout = () => {
        console.log('Usuário fez o logout');
        onLogout()
    }

    
    return(
    <SafeAreaView style = {home_css.container}>
        <Text style = {home_css.titulo}> Bem vindo!
        </Text>
            <TouchableOpacity 
                style = {home_css.botaoSair}
                onPress={fazerLogout}
            >
                <Text style = {home_css.textoBotaoSair}>
                    Sair
                </Text>
            </TouchableOpacity>
    </SafeAreaView>
    )
}