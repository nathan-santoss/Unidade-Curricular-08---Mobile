import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomePage from "../screens/home.jsx";
import TasksStack from "./TasksStack.jsx";
import ProfilePage from "../screens/profile.jsx";
import { useTaskNotifications } from "../hooks/useTaskNotifications.js";

const Tab = createBottomTabNavigator();

export default function MainTabs({ navigation }) {
    // Habilito a abertura de tarefas por notificação enquanto a conta estiver conectada.
    useTaskNotifications(navigation);
    return (
        <Tab.Navigator
            // Escolho a Home como primeira aba depois do login.
            initialRouteName="Home"
            screenOptions={{
                // Oculto o cabeçalho padrão para usar os títulos definidos em cada tela.
                headerShown: false,

                // Recolho as abas enquanto o teclado ocupa a parte inferior da tela.
                tabBarHideOnKeyboard: true,

                // Diferencio pelas cores a aba selecionada das demais.
                tabBarActiveTintColor: "#2563EB",
                tabBarInactiveTintColor: "#737373",
                tabBarIconStyle: { display: "none" },

                // Ajusto espaçamento, fundo e borda da barra inferior.
                tabBarStyle: {
                    paddingTop: 8,
                    backgroundColor: "#FFFFFF",
                    borderTopWidth: 1,
                    borderTopColor: "#E5E5E5",
                },

                // Padronizo o tamanho e o peso dos nomes das abas.
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                },
            }}
        >
            {/* Apresento o resumo e o acesso às tarefas recentes na Home. */}
            <Tab.Screen
                name="Home"
                component={HomePage}
                options={{
                    tabBarLabel: "Início",
                }}
            />

            {/* Separo o histórico de tarefas para navegar entre lista, formulário e detalhes. */}
            <Tab.Screen
                name="Tasks"
                component={TasksStack}
                options={{
                    tabBarLabel: "Tarefas",
                }}
            />

            {/* Reúno os dados da conta, as preferências e a opção de sair no Perfil. */}
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
