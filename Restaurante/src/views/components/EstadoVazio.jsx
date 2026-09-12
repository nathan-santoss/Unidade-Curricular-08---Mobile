import { Text, View } from 'react-native';
import { estilos } from '../../styles/componentes.js';

export default function EstadoVazio({ titulo, mensagem }) {
  return (
    <View style={estilos.vazio}>
      <Text style={estilos.marcaVazio} accessibilityElementsHidden>iF</Text>
      <Text style={estilos.tituloVazio}>{titulo}</Text>
      <Text style={estilos.textoVazio}>{mensagem}</Text>
    </View>
  );
}
