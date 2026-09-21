import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomePage from "../screens/home.jsx";
import TasksStack from "./TasksStack.jsx";
import ProfilePage from "../screens/profile.jsx";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator
            // Define a Home como a primeira área exibida após o login.
            initialRouteName="Home"
            screenOptions={{
                // Remove o cabeçalho padrão para manter o visual próprio das telas.
                headerShown: false,

                // Esconde a barra inferior enquanto o teclado estiver aberto.
                tabBarHideOnKeyboard: true,

                // Define as cores utilizadas pelas abas ativas e inativas.
                tabBarActiveTintColor: "#2563EB",
                tabBarInactiveTintColor: "#737373",
                tabBarIconStyle: { display: "none" },

                // Configura o visual da barra de navegação inferior.
                tabBarStyle: {
                    paddingTop: 8,
                    backgroundColor: "#FFFFFF",
                    borderTopWidth: 1,
                    borderTopColor: "#E5E5E5",
                },

                // Define o visual dos nomes exibidos nas abas.
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                },
            }}
        >
            {/* Exibe o resumo principal do gerenciador. */}
            <Tab.Screen
                name="Home"
                component={HomePage}
                options={{
                    tabBarLabel: "Início",
                }}
            />

            {/* 
        Usa um Stack próprio para permitir que a área de tarefas
        navegue entre lista, formulário e detalhes.
      */}
            <Tab.Screen
                name="Tasks"
                component={TasksStack}
                options={{
                    tabBarLabel: "Tarefas",
                }}
            />

            {/* Exibe os dados da conta e disponibiliza a ação de logout. */}
            <Tab.Screen
                name="Profile"
                component={ProfilePage}
                options={{
                    tabBarLabel: "Perfil",
                }}
            />
        </Tab.Navigator>
    );
}
