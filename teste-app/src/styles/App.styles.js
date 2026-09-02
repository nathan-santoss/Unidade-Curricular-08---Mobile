import { StyleSheet } from 'react-native';

// Agora eu crio as regras de layout global para a tela de cadastro.
const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    // Nesta parte eu garanto que o formulário tenha espaços adequados nas bordas.
    contentContainer: {
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 30,
        textAlign: 'center',
    },
});

// Depois eu exporto este módulo de estilos para a tela principal.
export default styles;