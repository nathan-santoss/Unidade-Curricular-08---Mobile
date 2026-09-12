import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePreventRemove } from '@react-navigation/native';
import { useApp } from '../../contexts/AppContext.jsx';
import { estilos } from '../../styles/telas.js';
import { cores } from '../../styles/cores.js';
import Botao from './Botao.jsx';

export default function Tela({ children, titulo, subtitulo, navigation, inicio = false }) {
  const { ocupado, limpezaPendente, concluirLimpeza } = useApp();
  usePreventRemove(ocupado, () => Alert.alert('Aguarde um instante', 'Estamos terminando de salvar os dados.'));
  return (
    <SafeAreaView style={estilos.segura}>
      <View style={estilos.cabecalho}>
        <View style={estilos.navegacaoTopo}>
          {inicio && <View style={estilos.flexivel}><Text style={estilos.marca}>iFome</Text><Text style={estilos.assinatura}>FEITO PRA VOCÊ</Text></View>}
          {!inicio && <Botao titulo="‹ Voltar" variante="discreto" aoPressionar={() => navigation.goBack()} desabilitado={ocupado} />}
          {inicio && <Botao titulo="Ajustes" variante="secundario" aoPressionar={() => navigation.navigate('Ajustes')} desabilitado={ocupado} />}
        </View>
        {!inicio && <Text accessibilityRole="header" style={estilos.titulo}>{titulo}</Text>}
        {Boolean(subtitulo) && <Text style={estilos.subtitulo}>{subtitulo}</Text>}
      </View>
      {limpezaPendente && (
        <View style={estilos.avisoGlobal}>
          <Text style={estilos.textoAviso}>Seu pedido já foi registrado. Conclua a limpeza do carrinho para começar outro, sem duplicar o pedido.</Text>
          <Botao titulo="Concluir limpeza do carrinho" aoPressionar={concluirLimpeza} desabilitado={ocupado} />
        </View>
      )}
      <View style={estilos.corpo}>{children}</View>
      {ocupado && <View style={estilos.bloqueio} accessibilityViewIsModal>
        <ActivityIndicator size="large" color={cores.principal} />
        <Text accessibilityLiveRegion="polite" style={estilos.textoForte}>Salvando no aparelho…</Text>
      </View>}
    </SafeAreaView>
  );
}
