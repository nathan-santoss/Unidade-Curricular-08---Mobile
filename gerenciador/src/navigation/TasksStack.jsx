import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TasksPage from "../screens/tasks.jsx";
import TaskFormPage from "../screens/taskForm.jsx";
import TaskDetailsPage from "../screens/taskDetails.jsx";

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
            {/* Lista das tarefas do usuário autenticado. */}
            <Stack.Screen
                name="TasksList"
                component={TasksPage}
            />

            {/* Formulário compartilhado pelo cadastro e pela edição. */}
            <Stack.Screen
                name="TaskForm"
                component={TaskFormPage}
            />
            <Stack.Screen name="TaskDetails" component={TaskDetailsPage} />
        </Stack.Navigator>
    );
}
