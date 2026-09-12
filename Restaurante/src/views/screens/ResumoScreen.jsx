import { ScrollView, Text, View } from 'react-native';
import { useApp } from '../../contexts/AppContext.jsx';
import { estilos } from '../../styles/telas.js';
import { formatarData } from '../../utils/formatacao.js';
import Botao from '../components/Botao.jsx';
import EstadoVazio from '../components/EstadoVazio.jsx';
import ItensPedido from '../components/ItensPedido.jsx';
import Tela from '../components/Tela.jsx';
import TotalPedido from '../components/TotalPedido.jsx';

export default function ResumoScreen({ navigation }) {
  const { itens, totalCentavos, totalUnidades, cliente, confirmarPedido, resumoConfirmado, bloqueado } = useApp();

  if (resumoConfirmado) {
    return (
      <Tela navigation={navigation} titulo="Tudo certo!" subtitulo="Seu pedido ficou salvo por aqui.">
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <View style={estilos.confirmado}>
            <Text style={estilos.tituloConfirmado}>Pedido registrado</Text>
            <Text style={estilos.textoForte}>Salvo neste aparelho.</Text>
            <Text style={estilos.texto}>Este é um registro local. O pedido não foi enviado a um restaurante.</Text>
            <Text selectable style={estilos.identificador}>{resumoConfirmado.id}</Text>
            <Text style={estilos.texto}>{formatarData(resumoConfirmado.data)}</Text>
          </View>
          <ItensPedido itens={resumoConfirmado.itens} />
          <TotalPedido totalCentavos={resumoConfirmado.totalCentavos} totalUnidades={resumoConfirmado.totalUnidades} />
          <Botao titulo="Começar outro pedido" aoPressionar={() => navigation.popToTop()} desabilitado={bloqueado} />
        </ScrollView>
      </Tela>
    );
  }

  return (
    <Tela navigation={navigation} titulo="Resumo do pedido" subtitulo="Confira os detalhes antes de confirmar.">
      <ScrollView contentContainerStyle={estilos.conteudo}>
        {itens.length === 0 && <EstadoVazio titulo="Nenhum item para revisar" mensagem="Volte ao cardápio para montar seu pedido." />}
        <ItensPedido itens={itens} />
        {cliente && Boolean(cliente.nome || cliente.telefone) && <View style={estilos.cartao}>
          <Text style={estilos.tituloSecao}>Seus dados</Text>
          {Boolean(cliente.nome) && <Text style={estilos.textoForte}>{cliente.nome}</Text>}
          {Boolean(cliente.telefone) && <Text style={estilos.texto}>{cliente.telefone}</Text>}
          <Text style={estilos.etiqueta}>Guardados separadamente no armazenamento seguro.</Text>
        </View>}
        <Botao titulo="Voltar ao carrinho e corrigir" variante="secundario" aoPressionar={() => navigation.goBack()} desabilitado={bloqueado} />
        <Text style={estilos.texto}>Ao confirmar, o pedido será registrado somente neste aparelho. Nenhum pagamento será realizado.</Text>
      </ScrollView>
      <View style={estilos.rodape}>
        <TotalPedido totalCentavos={totalCentavos} totalUnidades={totalUnidades} />
        <Botao titulo="Confirmar pedido" aoPressionar={confirmarPedido} desabilitado={bloqueado || itens.length === 0} />
      </View>
    </Tela>
  );
}
