import { StyleSheet } from 'react-native';

// Aqui eu crio o conjunto de estilos para a estrutura da tela inicial.
export const home_css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Nesta parte eu configuro a tipografia para o texto de boas-vindas.
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 30,
    textAlign: 'center',
  },
  // Aqui eu defino o formato e o espaçamento do botão de sair.
  botaoSair: {
    backgroundColor: '#d9534f',
    width: '100%',
    maxWidth: 200,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Por fim eu configuro a cor e o peso da fonte do texto do botão.
  textoBotaoSair: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});