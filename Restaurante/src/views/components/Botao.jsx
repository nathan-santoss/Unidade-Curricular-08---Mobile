import { Pressable, Text } from 'react-native';
import { estiloBotao, estiloTextoBotao } from '../../styles/componentes.js';

export default function Botao({ titulo, aoPressionar, desabilitado = false, variante = 'principal', rotuloAcessivel }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel || titulo}
      accessibilityState={{ disabled: desabilitado }}
      disabled={desabilitado}
      onPress={aoPressionar}
      style={({ pressed }) => estiloBotao(variante, desabilitado, pressed)}
    >
      <Text style={estiloTextoBotao(variante)}>{titulo}</Text>
    </Pressable>
  );
}
