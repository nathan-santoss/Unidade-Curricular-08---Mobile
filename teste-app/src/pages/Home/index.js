import React from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Aqui eu importo o botão genérico que já existe no projeto para manter o padrão visual.
import CustomButton from '../../components/CustomButton';
import styles from './styles';

export default function Home({ irParaCadastro, irParaDashboard }) {
    // Primeiro eu preparo o contêiner principal que ocupará toda a tela inicial.
    return (
        <View style={styles.container}>

            {/* Agora eu exibo a mensagem de boas-vindas ou o título do aplicativo. */}
            <Text style={styles.title}>Menu Principal</Text>

            {/* Nesta parte eu adiciono o botão que aciona a função de ir para o formulário. */}
            <CustomButton
                title="Acessar Cadastro"
                onPress={irParaCadastro}
            />

            {/* Em seguida eu posiciono o atalho para a nova tela de rede social. */}
            <CustomButton
                title="Acessar Dashboard (Feed)"
                onPress={irParaDashboard}
            />

            {/* Por fim eu declaro o estilo da barra de status do aparelho para combinar com o fundo claro. */}
            <StatusBar style="dark" />
        </View>
    );
}