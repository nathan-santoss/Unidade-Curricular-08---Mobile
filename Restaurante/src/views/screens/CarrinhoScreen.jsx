import { Alert, ScrollView, Text, View } from 'react-native';
import { useApp } from '../../contexts/AppContext.jsx';
import { estilos } from '../../styles/telas.js';
import Botao from '../components/Botao.jsx';
import EstadoVazio from '../components/EstadoVazio.jsx';
import ItensPedido from '../components/ItensPedido.jsx';
import Tela from '../components/Tela.jsx';
import TotalPedido from '../components/TotalPedido.jsx';

export default function CarrinhoScreen({ navigation }) {
  const { itens, totalCentavos, totalUnidades, esvaziarCarrinho, bloqueado } = useApp();
  const vazio = itens.length === 0;

  function confirmarEsvaziamento() {
    Alert.alert('Esvaziar carrinho?', 'Todos os itens serão removidos. O último pedido confirmado será mantido.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Esvaziar', style: 'destructive', onPress: esvaziarCarrinho },
    ]);
  }

  return (
    <Tela navigation={navigation} titulo="Seu carrinho" subtitulo="Uma boa escolha em cada item.">
      <ScrollView contentContainerStyle={estilos.conteudo}>
        {vazio && <EstadoVazio titulo="A fome está só começando" mensagem="Seu carrinho está vazio. Explore o cardápio e adicione algo gostoso." />}
        {!vazio && <>
          <View style={estilos.secaoLinha}>
            <Text style={estilos.tituloSecao}>Seus itens</Text>
            <Text style={estilos.etiqueta}>{totalUnidades} unidades</Text>
          </View>
          <ItensPedido itens={itens} editavel />
          <Botao titulo="Esvaziar carrinho" variante="secundario" aoPressionar={confirmarEsvaziamento} desabilitado={bloqueado} />
        </>}
        <Botao titulo="Continuar escolhendo" variante="secundario" aoPressionar={() => navigation.popToTop()} desabilitado={bloqueado} />
      </ScrollView>
      <View style={estilos.rodape}>
        <TotalPedido totalCentavos={totalCentavos} totalUnidades={totalUnidades} />
        <Botao titulo="Finalizar · Revisar pedido" aoPressionar={() => navigation.navigate('Resumo')} desabilitado={vazio || bloqueado} />
      </View>
    </Tela>
  );
}
