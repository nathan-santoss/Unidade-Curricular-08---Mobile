import { StyleSheet, Dimensions } from 'react-native';

// Primeiro eu capturo a largura total da tela para calcular as medidas fluidas do feed.
const windowWidth = Dimensions.get('window').width;

// Agora eu inicio a atualização das regras de estilização para comportar a nova navegação.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 45,
    },

    // Aqui eu adiciono a barra superior isolada para sustentar o botão de voltar com margem segura.
    topNavigation: {
        paddingHorizontal: 15,
        paddingBottom: 10,
    },

    // Em seguida configuro a área de toque garantindo que o usuário não erre o botão.
    backButton: {
        paddingVertical: 5,
    },
    backButtonText: {
        color: '#007BFF',
        fontSize: 16,
        fontWeight: '600',
    },

    // Neste ponto organizo a foto e os números no mesmo alinhamento horizontal.
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginTop: 5,
    },

    // Depois defino o contorno e as dimensões da foto de perfil.
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#DDDDDD',
    },

    // Nesta parte distribuo o espaço restante igualmente entre os contadores.
    statsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginLeft: 15,
    },
    statBox: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
    },
    statLabel: {
        fontSize: 13,
        color: '#666666',
    },

    // Aqui eu estabeleço as margens laterais para os blocos de texto da descrição.
    bioContainer: {
        paddingHorizontal: 15,
        marginTop: 15,
    },
    userName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 3,
    },
    userBio: {
        fontSize: 14,
        color: '#333333',
        lineHeight: 20,
    },

    // Agora estilizo o botão principal de edição com bordas e cor de fundo leve.
    buttonContainer: {
        paddingHorizontal: 15,
        marginTop: 15,
    },
    profileButton: {
        backgroundColor: '#F2F2F2',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    profileButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },

    // Em seguida traço a linha horizontal dividindo as áreas da página.
    divider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginTop: 20,
    },

    // Por fim, forço a quebra de linha das imagens e calculo a terça parte exata da tela.
    feedContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    feedImage: {
        width: windowWidth / 3,
        height: windowWidth / 3,
        borderWidth: 0.5,
        borderColor: '#FFFFFF',
    },
});

// Exporto o conjunto pronto para consumo.
export default styles;