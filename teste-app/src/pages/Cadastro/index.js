import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Primeiro eu carrego os componentes reutilizáveis e os estilos.
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import styles from './styles';

// Aqui eu recebo a função voltarParaInicio via propriedades do componente pai (App.js).
export default function Cadastro({ voltarParaInicio }) {

    // Agora eu crio um objeto simples para guardar os dados sem utilizar estados.
    // Esses são os dados pré-definidos que ficarão prontos para envio.
    let dadosParaEnvio = {
        nome: '',
        telefone: '',
        email: '',
        endereco: '',
        dataNascimento: '',
        cpf: '',
        sexo: '',
        senha: '',
        confirmarSenha: ''
    };

    // Em seguida eu preparo a função que fará a validação e o envio dessas informações.
    function handleCadastro() {
        // Neste ponto eu verifico se as senhas informadas são diferentes.
        if (dadosParaEnvio.senha !== dadosParaEnvio.confirmarSenha) {
            // Se houver erro, eu aviso o usuário sobre o problema.
            Alert.alert('Erro', 'As senhas não coincidem. Por favor, verifique.');
        } else {
            // Aqui o objeto "dadosParaEnvio" já está preenchido e pronto para ser enviado.
            console.log('Dados consolidados e prontos para envio:', dadosParaEnvio);
            // Por fim eu mostro a mensagem de confirmação na tela.
            Alert.alert('Cadastro Enviado', 'O cadastro do usuário foi realizado com sucesso!');
        }
    }

    // Depois eu estruturo a interface visual que será renderizada na página.
    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>

            {/* Aqui eu adiciono o novo botão de navegação para retornar ao menu principal. */}
            <TouchableOpacity style={styles.backButton} onPress={voltarParaInicio}>
                <Text style={styles.backButtonText}>{"< Voltar para o Início"}</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Cadastro de Usuário</Text>

            {/* Nesta parte eu adiciono os campos e atualizo diretamente o objeto ao digitar. */}
            <CustomInput
                label="Nome Completo"
                onChangeText={(text) => { dadosParaEnvio.nome = text; }}
                placeholder="Digite seu nome"
            />
            <CustomInput
                label="Telefone"
                onChangeText={(text) => { dadosParaEnvio.telefone = text; }}
                keyboardType="phone-pad"
                placeholder="Digite seu telefone"
            />

            {/* Agora eu configuro os campos de contato e localização. */}
            <CustomInput
                label="E-mail"
                onChangeText={(text) => { dadosParaEnvio.email = text; }}
                keyboardType="email-address"
                placeholder="Digite seu e-mail"
            />
            <CustomInput
                label="Endereço"
                onChangeText={(text) => { dadosParaEnvio.endereco = text; }}
                placeholder="Digite seu endereço completo"
            />

            {/* Neste ponto eu monto os campos com dados de identificação pessoal. */}
            <CustomInput
                label="Data de Nascimento"
                onChangeText={(text) => { dadosParaEnvio.dataNascimento = text; }}
                placeholder="DD/MM/AAAA"
            />
            <CustomInput
                label="CPF"
                onChangeText={(text) => { dadosParaEnvio.cpf = text; }}
                keyboardType="numeric"
                placeholder="Digite seu CPF"
            />

            {/* Aqui eu preparo a entrada referente ao gênero do usuário. */}
            <CustomInput
                label="Sexo"
                onChangeText={(text) => { dadosParaEnvio.sexo = text; }}
                placeholder="Digite seu sexo"
            />

            {/* Em seguida eu solicito as informações de senha ocultando os caracteres. */}
            <CustomInput
                label="Senha"
                onChangeText={(text) => { dadosParaEnvio.senha = text; }}
                placeholder="Digite sua senha"
                secureTextEntry={true}
            />
            <CustomInput
                label="Confirmar Senha"
                onChangeText={(text) => { dadosParaEnvio.confirmarSenha = text; }}
                placeholder="Confirme sua senha"
                secureTextEntry={true}
            />

            {/* Por fim eu posiciono o botão que aciona a validação dos dados preenchidos. */}
            <CustomButton
                title="Enviar Cadastro"
                onPress={handleCadastro}
            />

            {/* Para evitar problemas com a barra superior eu chamo o StatusBar do Expo. */}
            <StatusBar style="dark" />
        </ScrollView>
    );
}