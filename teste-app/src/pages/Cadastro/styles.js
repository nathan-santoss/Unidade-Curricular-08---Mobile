import { StyleSheet } from 'react-native';

// Aqui eu crio as regras de layout para acomodar os novos elementos da tela de cadastro.
const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    // Nesta parte eu garanto que o formulário tenha espaços adequados nas bordas do aparelho.
    contentContainer: {
        paddingTop: 50,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },

    // Agora eu estruturo a área clicável do botão de voltar para ficar amigável ao toque.
    backButton: {
        marginBottom: 20,
        paddingVertical: 5,
    },

    // Em seguida eu aplico a cor azul indicando que é um elemento de ação interativa.
    backButtonText: {
        color: '#007BFF',
        fontSize: 16,
        fontWeight: '600',
    },

    // Por fim eu mantenho a formatação original do título da página.
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 30,
        textAlign: 'center',
    },
});

// Depois eu exporto este módulo de estilos atualizado para ser usado na tela.
export default styles;