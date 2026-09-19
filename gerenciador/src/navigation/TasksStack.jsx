import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TasksPage from "../screens/tasks.jsx";
import TaskFormPage from "../screens/taskForm.jsx";

const Stack = createNativeStackNavigator();

export default function TasksStack() {
    return (
        <Stack.Navigator
            // Define a lista de tarefas como a primeira tela deste fluxo.
            initialRouteName="TasksList"
            screenOptions={{
                // Mantém o cabeçalho padrão escondido para usar o layout próprio das telas.
                headerShown: false,
            }}
        >
            {/* Tela principal onde as tarefas serão exibidas. */}
            <Stack.Screen
                name="TasksList"
                component={TasksPage}
            />

            {/* Formulário utilizado para cadastrar uma nova tarefa. */}
            <Stack.Screen
                name="TaskForm"
                component={TaskFormPage}
            />
        </Stack.Navigator>
    );
}