import { useState } from 'react';
import { Text, View } from 'react-native';
import { useApp } from '../../contexts/AppContext.jsx';
import { estilos } from '../../styles/componentes.js';
import { formatarMoeda } from '../../utils/formatacao.js';
import Botao from './Botao.jsx';
import SeletorQuantidade from './SeletorQuantidade.jsx';

export default function ProdutoCard({ produto }) {
  const { adicionarAoCarrinho, ajustarSelecao, preferencias, bloqueado } = useApp();
  const [quantidade, definirQuantidade] = useState(1);
  const [mensagem, definirMensagem] = useState('');

  function selecionarQuantidade(variacao) {
    definirQuantidade((atual) => ajustarSelecao(atual, variacao));
    definirMensagem('');
  }

  async function adicionar() {
    const sucesso = await adicionarAoCarrinho(produto.id, quantidade);
    if (sucesso) {
      definirMensagem('Adicionado ao carrinho.');
      definirQuantidade(1);
    }
  }

  return (
    <View style={estilos.produto}>
      <View style={estilos.linhaProduto}>
        <View style={estilos.seloProduto} accessibilityElementsHidden>
          <Text style={estilos.numeroProduto}>{produto.id.slice(-2)}</Text>
        </View>
        <View style={estilos.flexivel}>
          <Text style={estilos.categoriaProduto}>{produto.categoria.toUpperCase()}</Text>
          <Text style={estilos.nomeProduto}>{produto.nome}</Text>
        </View>
      </View>
      {preferencias.mostrarDescricoes && <Text style={estilos.descricaoProduto}>{produto.descricao}</Text>}
      <Text style={estilos.preco}>{formatarMoeda(produto.precoCentavos)}</Text>
      <View style={estilos.acoesProduto}>
        <SeletorQuantidade quantidade={quantidade} aoMudar={selecionarQuantidade} nome={produto.nome} desabilitado={bloqueado} />
        <Botao titulo="Adicionar +" rotuloAcessivel={'Adicionar ' + produto.nome + ' ao carrinho'} aoPressionar={adicionar} desabilitado={bloqueado} />
      </View>
      {Boolean(mensagem) && <Text accessibilityLiveRegion="polite" style={estilos.sucesso}>{mensagem}</Text>}
    </View>
  );
}
