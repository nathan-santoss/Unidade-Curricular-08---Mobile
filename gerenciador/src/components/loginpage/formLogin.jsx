import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native"
import { login_css } from "../../styles/loginStyles.js"
import { useState } from "react"

// inicio do componente
export default function FormLogin() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const fazerLogin = () => {
        if(email.trim() === ""){
            Alert.alert("Atenção!", "Por favor, digite o seu e-mail.")
        }else if(senha.trim() === ""){
            Alert.alert("Atenção!", "Por favor, digite sua senha.")
        }else{
            const dadosDoUsuario = {
                email: email,
                senha: senha
            }
            console.log(`Tentativa de login efetuada com sucesso, dados do usuário: ${dadosDoUsuario}`);

        }
    }
    return (
        <View style={login_css.formContainer}>
            <Text style={login_css.titulo}>Realize Login</Text>

            <TextInput
                style={login_css.input}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={login_css.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#888"
                secureTextEntry={true}
                value={senha}
                onChangeText={setSenha}
            />

            <TouchableOpacity style={login_css.botao} onPress={fazerLogin}>
                <Text style={login_css.textoBotao}>
                    Entrar
                </Text>
            </TouchableOpacity>

        </View>
    )

}