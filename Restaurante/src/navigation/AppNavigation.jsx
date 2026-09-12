import { ActivityIndicator, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../contexts/AppContext.jsx';
import { cores } from '../styles/cores.js';
import { estilos, opcoesNavegacao } from '../styles/telas.js';
import AcoesLimpeza from '../views/components/AcoesLimpeza.jsx';
import Botao from '../views/components/Botao.jsx';
import AjustesScreen from '../views/screens/AjustesScreen.jsx';
import CardapioScreen from '../views/screens/CardapioScreen.jsx';
import CarrinhoScreen from '../views/screens/CarrinhoScreen.jsx';
import ResumoScreen from '../views/screens/ResumoScreen.jsx';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const { pronto, ocupado, erroInicial, inicializar } = useApp();
  if (!pronto) {
    return (
      <SafeAreaView style={estilos.segura}>
        <ScrollView contentContainerStyle={estilos.centralizado}>
          <Text style={estilos.marca}>iFome</Text>
          {ocupado && <ActivityIndicator size="large" color={cores.principal} />}
          {!erroInicial && <Text style={estilos.texto}>Preparando seu cardápio e restaurando seus dados…</Text>}
          {Boolean(erroInicial) && <>
            <Text style={estilos.tituloSecao}>Vamos tentar de novo?</Text>
            <Text style={estilos.texto}>{erroInicial}</Text>
            <Text style={estilos.texto}>As alterações ficam bloqueadas para proteger os dados salvos. Tente recarregar. Se os dados estiverem inválidos, você pode apagá-los abaixo.</Text>
            <Botao titulo="Tentar carregar novamente" aoPressionar={inicializar} desabilitado={ocupado} />
            <AcoesLimpeza />
          </>}
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={opcoesNavegacao}>
        <Stack.Screen name="Cardapio" component={CardapioScreen} />
        <Stack.Screen name="Carrinho" component={CarrinhoScreen} />
        <Stack.Screen name="Resumo" component={ResumoScreen} />
        <Stack.Screen name="Ajustes" component={AjustesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
