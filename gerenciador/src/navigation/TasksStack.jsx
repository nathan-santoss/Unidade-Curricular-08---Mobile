import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TasksPage from "../screens/tasks.jsx";
import TaskFormPage from "../screens/taskForm.jsx";
import TaskDetailsPage from "../screens/taskDetails.jsx";

const Stack = createNativeStackNavigator();

export default function TasksStack() {
    return (
        <Stack.Navigator
            // Começo pela lista para permitir voltar a ela depois de abrir uma tarefa.
            initialRouteName="TasksList"
            screenOptions={{
                // Deixo cada tela cuidar de seu título e dos botões de navegação.
                headerShown: false,
            }}
        >
            {/* Apresento a lista que consulta as tarefas da conta conectada. */}
            <Stack.Screen
                name="TasksList"
                component={TasksPage}
            />

            {/* Reaproveito o formulário: sem ID crio uma tarefa; com ID edito a existente. */}
            <Stack.Screen
                name="TaskForm"
                component={TaskFormPage}
            />
            {/* Reservo esta rota para consultar e alterar a situação de uma tarefa. */}
            <Stack.Screen name="TaskDetails" component={TaskDetailsPage} />
        </Stack.Navigator>
    );
}
