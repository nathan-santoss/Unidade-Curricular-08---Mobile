import { StyleSheet } from 'react-native';

// Concentro a aparência da entrada para reutilizá-la na tela e no formulário de login.
export const login_css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', // Mantenho o formulário centralizado na direção vertical.
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  // Delimito cada campo com borda e espaço inferior para separar e-mail e senha.
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
