import { StyleSheet } from 'react-native';

// Neste arquivo eu organizo o design visual exclusivo do botão.
const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    // Aqui eu configuro a cor e o tamanho do texto interno do botão.
    text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

// Por fim eu exporto os estilos para que o botão possa utilizá-los.
export default styles;