import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginPage from "./src/screens/login.jsx";
import MainTabs from "./src/navigation/MainTabs.jsx";

const Stack = createNativeStackNavigator();

// Faz a ligação entre a tela de login e a navegação principal do aplicativo.
function LoginScreen({ navigation }) {
  // Substitui o login pela área principal após a autenticação.
  const irParaAplicativo = () => {
    navigation.replace("Main");
  };

  return <LoginPage onLoginSucess={irParaAplicativo} />;
}

// Controla o acesso às abas principais e também o retorno ao login.
function MainScreen({ navigation }) {
  // Remove a área principal da pilha quando o usuário sair da conta.
  const logoutSys = () => {
    navigation.replace("Login");
  };

  return <MainTabs onLogout={logoutSys} />;
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        // Define o login como primeira tela ao abrir o aplicativo.
        initialRouteName="Login"
        screenOptions={{
          // Esconde o cabeçalho padrão para manter o layout personalizado.
          headerShown: false,
        }}
      >
        {/* Tela de entrada do aplicativo. */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        {/* Área principal que contém as abas Início, Tarefas e Perfil. */}
        <Stack.Screen
          name="Main"
          component={MainScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}