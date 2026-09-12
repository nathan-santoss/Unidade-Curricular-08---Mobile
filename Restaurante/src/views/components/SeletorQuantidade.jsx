import { Pressable, Text, View } from 'react-native';
import { quantidadeMaxima } from '../../models/pedido.js';
import { estilos, estiloQuantidade } from '../../styles/componentes.js';

export default function SeletorQuantidade({ quantidade, aoMudar, desabilitado = false, nome }) {
  const diminuirDesabilitado = desabilitado || quantidade <= 1;
  const aumentarDesabilitado = desabilitado || quantidade >= quantidadeMaxima;
  return (
    <View style={estilos.grupoQuantidade}>
      <Pressable accessibilityRole="button" accessibilityLabel={'Diminuir quantidade de ' + nome}
        accessibilityState={{ disabled: diminuirDesabilitado }} disabled={diminuirDesabilitado}
        onPress={() => aoMudar(-1)} style={estiloQuantidade(diminuirDesabilitado)}>
        <Text style={estilos.sinalQuantidade}>−</Text>
      </Pressable>
      <Text accessibilityLabel={quantidade + ' unidades de ' + nome} style={estilos.quantidade}>{quantidade}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={'Aumentar quantidade de ' + nome}
        accessibilityState={{ disabled: aumentarDesabilitado }} disabled={aumentarDesabilitado}
        onPress={() => aoMudar(1)} style={estiloQuantidade(aumentarDesabilitado)}>
        <Text style={estilos.sinalQuantidade}>+</Text>
      </Pressable>
    </View>
  );
}
