import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styles from './styles';

// Primeiro eu importo as imagens diretamente da pasta assets.
import fotoPerfil from '../../../assets/perfil.jpg';
import fotoFeed1 from '../../../assets/feed-1.jpg';
import fotoFeed2 from '../../../assets/feed-2.jpg';

// Aqui eu recebo a função que possibilita o retorno para a tela Home do nosso aplicativo.
export default function Dashboard({ voltarParaInicio }) {

    // Agora eu preparo a estrutura da página principal simulando um painel de perfil.
    return (
        <View style={styles.container}>

            {/* Neste ponto eu adiciono o botão de retorno no topo, fora da área de rolagem para sempre ficar visível, ou dentro, dependendo do design. Optei por deixar fixo no topo. */}
            <View style={styles.topNavigation}>
                <TouchableOpacity onPress={voltarParaInicio} style={styles.backButton}>
                    <Text style={styles.backButtonText}>{"< Voltar"}</Text>
                </TouchableOpacity>
            </View>

            {/* Em seguida eu crio a área rolável para que o feed de fotos possa crescer infinitamente. */}
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Aqui eu monto o cabeçalho contendo a foto de perfil e os números principais. */}
                <View style={styles.header}>
                    <Image source={fotoPerfil} style={styles.profileImage} />

                    {/* Depois eu adiciono as estatísticas formando o bloco à direita da foto. */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>2</Text>
                            <Text style={styles.statLabel}>Posts</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>1.5k</Text>
                            <Text style={styles.statLabel}>Seguidores</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>300</Text>
                            <Text style={styles.statLabel}>Seguindo</Text>
                        </View>
                    </View>
                </View>

                {/* Nesta parte eu insiro as informações de texto descritivo do usuário. */}
                <View style={styles.bioContainer}>
                    <Text style={styles.userName}>Usuário Exemplo</Text>
                    <Text style={styles.userBio}>Esta é a minha bio estática. Bem-vindo ao meu perfil no aplicativo!</Text>
                </View>

                {/* Aqui eu incluo o botão de ação simulando a edição de perfil. */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.profileButton}>
                        <Text style={styles.profileButtonText}>Editar Perfil</Text>
                    </TouchableOpacity>
                </View>

                {/* Depois eu crio uma divisória simples para separar visualmente a bio da grade de fotos. */}
                <View style={styles.divider} />

                {/* Por fim eu estruturo a área do feed de imagens utilizando o padrão de grid. */}
                <View style={styles.feedContainer}>
                    <Image source={fotoFeed1} style={styles.feedImage} />
                    <Image source={fotoFeed2} style={styles.feedImage} />
                </View>

            </ScrollView>

            {/* Para garantir a visibilidade dos ícones de bateria e rede eu ajusto a barra de status. */}
            <StatusBar style="dark" />
        </View>
    );
}