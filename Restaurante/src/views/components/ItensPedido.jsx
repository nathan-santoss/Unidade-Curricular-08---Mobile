import { Text, View } from 'react-native';
import { useApp } from '../../contexts/AppContext.jsx';
import { estilos } from '../../styles/componentes.js';
import { formatarMoeda } from '../../utils/formatacao.js';
import Botao from './Botao.jsx';
import SeletorQuantidade from './SeletorQuantidade.jsx';

export default function ItensPedido({ itens, editavel = false }) {
  const { mudarQuantidade, removerItem, bloqueado } = useApp();
  return (
    <View>
      {itens.map((item) => (
        <View key={item.id} style={estilos.itemPedido}>
          <View style={estilos.linha}>
            <Text style={estilos.nomeItem}>{item.nome}</Text>
            <Text style={estilos.subtotal}>{formatarMoeda(item.subtotalCentavos)}</Text>
          </View>
          <Text style={estilos.detalhe}>{item.quantidade} un. × {formatarMoeda(item.precoCentavos)} cada</Text>
          {editavel && (
            <View style={estilos.acoesProduto}>
              <SeletorQuantidade quantidade={item.quantidade} nome={item.nome} desabilitado={bloqueado} aoMudar={(variacao) => mudarQuantidade(item.id, variacao)} />
              <Botao titulo="Remover" rotuloAcessivel={'Remover ' + item.nome} variante="discreto" aoPressionar={() => removerItem(item.id)} desabilitado={bloqueado} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
