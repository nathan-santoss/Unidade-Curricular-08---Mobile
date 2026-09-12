import { Text, View } from 'react-native';
import { estilos } from '../../styles/componentes.js';
import { formatarMoeda } from '../../utils/formatacao.js';

export default function TotalPedido({ totalCentavos, totalUnidades }) {
  return (
    <View style={estilos.total}>
      <Text style={estilos.rotuloTotal}>Total do pedido</Text>
      <Text style={estilos.valorTotal}>{formatarMoeda(totalCentavos)}</Text>
      <Text style={estilos.detalhe}>{totalUnidades} unidades · Sem taxas adicionais</Text>
    </View>
  );
}
