import { StyleSheet } from 'react-native';

// Aqui eu defino as regras visuais apenas para o campo de texto.
const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 5,
        fontWeight: '600',
    },
    // Nesta parte eu configuro a aparência da caixa de entrada.
    input: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#F9F9F9',
    },
});

// Com isso eu garanto que os estilos fiquem separados da estrutura lógica.
export default styles;