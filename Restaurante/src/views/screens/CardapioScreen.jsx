import { FlatList, Pressable, Text, View } from 'react-native';
import { useApp } from '../../contexts/AppContext.jsx';
import { categorias } from '../../models/cardapio.js';
import { estilos, estiloFiltro, estiloTextoFiltro } from '../../styles/telas.js';
import { formatarMoeda } from '../../utils/formatacao.js';
import Botao from '../components/Botao.jsx';
import EstadoVazio from '../components/EstadoVazio.jsx';
import ProdutoCard from '../components/ProdutoCard.jsx';
import Tela from '../components/Tela.jsx';

export default function CardapioScreen({ navigation }) {
  const { produtosVisiveis, preferencias, mudarPreferencias, totalUnidades, totalCentavos, bloqueado, ocupado } = useApp();
  return (
    <Tela navigation={navigation} inicio>
      <FlatList
        data={produtosVisiveis}
        keyExtractor={(produto) => produto.id}
        renderItem={({ item }) => <ProdutoCard produto={item} />}
        contentContainerStyle={estilos.lista}
        ListHeaderComponent={
          <View style={estilos.introducao}>
            <View style={estilos.destaque}>
              <Text style={estilos.destaqueEtiqueta}>BATEU AQUELA FOME?</Text>
              <Text accessibilityRole="header" style={estilos.destaqueTitulo}>Seu próximo favorito{ '\n' }está no cardápio.</Text>
              <Text style={estilos.destaqueTexto}>Escolha com calma. A gente guarda seu pedido por aqui.</Text>
            </View>
            <View style={estilos.filtros}>
              {categorias.map((categoria) => {
                const ativa = preferencias.categoria === categoria;
                return (
                  <Pressable key={categoria} accessibilityRole="button" accessibilityState={{ selected: ativa, disabled: bloqueado }}
                    disabled={bloqueado} onPress={() => mudarPreferencias({ categoria })} style={estiloFiltro(ativa)}>
                    <Text style={estiloTextoFiltro(ativa)}>{categoria}</Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={estilos.secaoLinha}>
              <Text style={estilos.tituloSecao}>Cardápio</Text>
              <Text style={estilos.etiqueta}>{produtosVisiveis.length} opções</Text>
            </View>
          </View>
        }
        ListEmptyComponent={<EstadoVazio titulo="Nenhum produto por aqui" mensagem="Escolha outra categoria para ver as opções disponíveis." />}
      />
      <View style={estilos.rodape}>
        <Botao titulo={'Ver carrinho · ' + totalUnidades + ' un. · ' + formatarMoeda(totalCentavos)}
          aoPressionar={() => navigation.navigate('Carrinho')} desabilitado={ocupado} />
      </View>
    </Tela>
  );
}
