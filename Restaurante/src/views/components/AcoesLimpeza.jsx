import { Alert, View } from 'react-native';
import { useApp } from '../../contexts/AppContext.jsx';
import { estilos } from '../../styles/componentes.js';
import Botao from './Botao.jsx';

export default function AcoesLimpeza() {
  const { limparDados, ocupado } = useApp();

  function confirmarLimpezaIfome() {
    Alert.alert('Limpar dados do iFome?', 'Isso apaga o carrinho, as preferências, o último pedido e seus dados pessoais deste aplicativo.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar dados', style: 'destructive', onPress: () => limparDados() },
    ]);
  }

  function confirmarRedefinicaoGlobal() {
    Alert.alert('Redefinir armazenamento global?', 'Esta ação de desenvolvimento apaga TODO o AsyncStorage acessível à aplicação, inclusive chaves de bibliotecas. Também apaga separadamente seus dados pessoais do SecureStore. Não é possível desfazer.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar tudo', style: 'destructive', onPress: () => limparDados(true) },
    ]);
  }

  return (
    <View style={estilos.limpeza}>
      <Botao titulo="Limpar dados do iFome" variante="secundario" aoPressionar={confirmarLimpezaIfome} desabilitado={ocupado} />
      {__DEV__ && <Botao titulo="Redefinição global (desenvolvimento)" variante="secundario" aoPressionar={confirmarRedefinicaoGlobal} desabilitado={ocupado} />}
    </View>
  );
}
