import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/contexts/AppContext.jsx';
import AppNavigation from './src/navigation/AppNavigation.jsx';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <AppNavigation />
      </AppProvider>
    </SafeAreaProvider>
  );
}
