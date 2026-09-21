import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./src/screens/login.jsx";
import RegisterPage from "./src/screens/register.jsx";
import MainTabs from "./src/navigation/MainTabs.jsx";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext.jsx";
import { initializeDatabase } from "./src/database/database.js";
import AppButton from "./src/components/AppButton.jsx";
import { commonStyles as styles } from "./src/styles/commonStyles.js";

const Stack = createNativeStackNavigator();

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

    // A mudança do Context desmonta as rotas antigas, inclusive o histórico de login.
    let screens;
    if (user === null) {
        screens = (
            <Stack.Group>
                <Stack.Screen name="Login" component={LoginPage} />
                <Stack.Screen name="Register" component={RegisterPage} />
            </Stack.Group>
        );
    } else {
        screens = <Stack.Screen name="Main" component={MainTabs} />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>{screens}</Stack.Navigator>
        </NavigationContainer>
    );
}

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
                if (active) setDatabaseReady(true);
            } catch {
                if (active) setDatabaseError(true);
            }
        }
        prepararBanco();
        return () => { active = false; };
    }, [attempt]);

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

    return (
        <SafeAreaProvider>
            <StatusBar style="dark" />
            <View style={styles.screen}>{content}</View>
        </SafeAreaProvider>
    );
}
