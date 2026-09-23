import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./src/screens/login.jsx";
import RegisterPage from "./src/screens/register.jsx";
import SettingsPage from "./src/screens/settings.jsx";
import MainTabs from "./src/navigation/MainTabs.jsx";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext.jsx";
import { initializeDatabase } from "./src/database/database.js";
import AppButton from "./src/components/AppButton.jsx";
import { commonStyles as styles } from "./src/styles/commonStyles.js";

const Stack = createNativeStackNavigator();

// Escolho entre recuperar a sessão, mostrar um erro ou liberar as telas adequadas à conta.
function AppNavigation() {
    const { user, loadingSession, sessionError, retrySession } = useAuth();
    if (loadingSession) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.subtitle}>Carregando sessão...</Text>
            </View>
        );
    }
    if (sessionError) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{sessionError}</Text>
                <AppButton title="Tentar novamente" onPress={retrySession} />
            </View>
        );
    }

    // Troco o conjunto de rotas conforme a sessão e retiro do histórico as telas anteriores.
    let screens;
    if (user === null) {
        screens = (
            <Stack.Group>
                <Stack.Screen name="Login" component={LoginPage} />
                <Stack.Screen name="Register" component={RegisterPage} />
            </Stack.Group>
        );
    } else {
        screens = (
            <Stack.Group>
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="Settings" component={SettingsPage} />
            </Stack.Group>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>{screens}</Stack.Navigator>
        </NavigationContainer>
    );
}

// Preparo o banco antes de montar a autenticação e a navegação do aplicativo.
export default function App() {
    const [databaseReady, setDatabaseReady] = useState(false);
    const [databaseError, setDatabaseError] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let active = true;
        async function prepararBanco() {
            setDatabaseError(false);
            try {
                await initializeDatabase();
                // Atualizo a tela somente se esta tentativa de preparação ainda estiver ativa.
                if (active) setDatabaseReady(true);
            } catch {
                if (active) setDatabaseError(true);
            }
        }
        prepararBanco();
        return () => { active = false; };
    }, [attempt]);

    // Defino o conteúdo conforme o resultado da preparação, com opção de tentar novamente.
    let content;
    if (databaseError) {
        content = (
            <View style={styles.center}>
                <Text style={styles.error}>Não foi possível preparar o banco de dados.</Text>
                <AppButton title="Tentar novamente" onPress={() => setAttempt((value) => value + 1)} />
            </View>
        );
    } else if (!databaseReady) {
        content = (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.subtitle}>Preparando aplicativo...</Text>
            </View>
        );
    } else {
        content = <AuthProvider><AppNavigation /></AuthProvider>;
    }

    // Forneço às telas as medidas das áreas ocupadas por recortes e barras do aparelho.
    return (
        <SafeAreaProvider>
            <StatusBar style="dark" />
            <View style={styles.screen}>{content}</View>
        </SafeAreaProvider>
    );
}
