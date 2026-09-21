import { StyleSheet } from 'react-native';

export const login_css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', // Centraliza o formulário no meio da tela verticalmente
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
