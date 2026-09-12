import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { categorias, filtrarProdutos } from '../models/cardapio.js';
import { adicionarProduto, ajustarQuantidade, alterarQuantidade, calcularTotais, removerProduto } from '../models/pedido.js';
import * as armazenamento from '../services/armazenamento.js';
import * as clienteSeguro from '../services/clienteSeguro.js';
import { registrarPedido } from './confirmacao.js';

const estadoInicial = {
  pronto: false,
  ocupado: false,
  erroInicial: '',
  carrinho: null,
  preferencias: armazenamento.preferenciasIniciais,
  cliente: null,
  avisoCliente: '',
  ultimoPedido: null,
  pedidoConfirmado: null,
  limpezaPendente: false,
};

export function useAppController() {
  const [estado, definirEstado] = useState(estadoInicial);
  const estadoAtual = useRef(estadoInicial);
  const operacaoEmAndamento = useRef(false);

  function atualizar(alteracoes) {
    const novoEstado = { ...estadoAtual.current, ...alteracoes };
    estadoAtual.current = novoEstado;
    definirEstado(novoEstado);
  }

  // Controller: uma trava imediata impede gravações concorrentes e toques duplicados.
  // Não há autosave em useEffect: a abertura e a limpeza não recriam dados antigos.
  async function executar(acao, mensagemErro) {
    if (operacaoEmAndamento.current) return false;
    operacaoEmAndamento.current = true;
    atualizar({ ocupado: true });
    try {
      await acao();
      return true;
    } catch (erro) {
      Alert.alert(mensagemErro, erro.message || 'Tente novamente.');
      return false;
    } finally {
      operacaoEmAndamento.current = false;
      atualizar({ ocupado: false });
    }
  }

  async function inicializar() {
    return executar(async () => {
      atualizar({ pronto: false, erroInicial: '' });
      try {
        const carrinho = await armazenamento.carregarCarrinho();
        const ultimoPedido = await armazenamento.carregarUltimoPedido();
        const preferencias = await armazenamento.carregarPreferencias();
        let cliente = null;
        let avisoCliente = '';
        try {
          cliente = await clienteSeguro.carregarCliente();
        } catch (erro) {
          avisoCliente = 'Não foi possível restaurar os dados pessoais. ' + erro.message;
        }
        let carrinhoRestaurado = carrinho;
        let pedidoConfirmado = null;
        let limpezaPendente = false;
        if (carrinho && ultimoPedido && carrinho.id === ultimoPedido.carrinhoId) {
          carrinhoRestaurado = null;
          pedidoConfirmado = ultimoPedido;
          limpezaPendente = true;
        }
        atualizar({ pronto: true, carrinho: carrinhoRestaurado, ultimoPedido, preferencias, cliente, avisoCliente, pedidoConfirmado, limpezaPendente });
      } catch (erro) {
        atualizar({ erroInicial: 'Não foi possível carregar os dados. ' + erro.message });
      }
    }, 'Não foi possível abrir o iFome');
  }

  useEffect(() => {
    inicializar();
  }, []);

  function podeAlterar() {
    return estadoAtual.current.pronto && !estadoAtual.current.limpezaPendente;
  }

  async function atualizarCarrinho(transformar) {
    if (!podeAlterar()) return false;
    return executar(async () => {
      const carrinho = transformar(estadoAtual.current.carrinho);
      if (carrinho) {
        await armazenamento.salvarCarrinho(carrinho);
      } else {
        await armazenamento.apagarCarrinho();
      }
      atualizar({ carrinho, pedidoConfirmado: null });
    }, 'Não foi possível salvar o carrinho');
  }

  async function adicionarAoCarrinho(produtoId, quantidade) {
    return atualizarCarrinho((carrinho) => adicionarProduto(carrinho, produtoId, quantidade));
  }

  async function mudarQuantidade(produtoId, variacao) {
    return atualizarCarrinho((carrinho) => {
      if (!carrinho) return null;
      const item = carrinho.itens.find((itemAtual) => itemAtual.id === produtoId);
      if (!item) throw new Error('Este item não está no carrinho.');
      return alterarQuantidade(carrinho, produtoId, ajustarQuantidade(item.quantidade, variacao));
    });
  }

  async function removerItem(produtoId) {
    return atualizarCarrinho((carrinho) => removerProduto(carrinho, produtoId));
  }

  async function esvaziarCarrinho() {
    return atualizarCarrinho(() => null);
  }

  async function mudarPreferencias(alteracoes) {
    if (!podeAlterar()) return false;
    return executar(async () => {
      const preferencias = { ...estadoAtual.current.preferencias, ...alteracoes };
      if (!categorias.includes(preferencias.categoria) || typeof preferencias.mostrarDescricoes !== 'boolean') {
        throw new Error('Preferência inválida.');
      }
      await armazenamento.salvarPreferencias(preferencias);
      atualizar({ preferencias });
    }, 'Não foi possível salvar as preferências');
  }

  async function confirmarPedido() {
    if (!podeAlterar()) return false;
    return executar(async () => {
      const resultado = await registrarPedido(estadoAtual.current.carrinho, estadoAtual.current.ultimoPedido, armazenamento);
      atualizar({
        ultimoPedido: resultado.pedido,
        pedidoConfirmado: resultado.pedido,
        carrinho: null,
        limpezaPendente: resultado.limpezaPendente,
      });
    }, 'Pedido não confirmado. Seu carrinho foi mantido');
  }

  async function concluirLimpeza() {
    return executar(async () => {
      if (!estadoAtual.current.limpezaPendente) return;
      await armazenamento.apagarCarrinho();
      atualizar({ limpezaPendente: false, carrinho: null });
    }, 'O pedido já está registrado. Não foi possível concluir a limpeza');
  }

  async function salvarDadosCliente(dados) {
    if (!estadoAtual.current.pronto) return false;
    return executar(async () => {
      try {
        const cliente = await clienteSeguro.salvarCliente(dados);
        atualizar({ cliente, avisoCliente: '' });
      } catch (erro) {
        atualizar({ avisoCliente: 'Não foi possível salvar os dados pessoais. ' + erro.message });
        throw erro;
      }
    }, 'Não foi possível salvar seus dados');
  }

  async function esquecerCliente() {
    return executar(async () => {
      await clienteSeguro.apagarCliente();
      atualizar({ cliente: null, avisoCliente: '' });
    }, 'Não foi possível apagar seus dados. Tente novamente');
  }

  async function consultarUltimoPedido() {
    if (!estadoAtual.current.pronto) return false;
    return executar(async () => {
      const ultimoPedido = await armazenamento.carregarUltimoPedido();
      atualizar({ ultimoPedido });
    }, 'Não foi possível consultar o último pedido');
  }

  async function limparDados(global = false) {
    return executar(async () => {
      let erroLimpeza = '';
      try {
        if (global) {
          await armazenamento.redefinirAsyncStorage();
        } else {
          await armazenamento.limparDadosIfome();
        }
        atualizar({ carrinho: null, preferencias: { ...armazenamento.preferenciasIniciais }, ultimoPedido: null, pedidoConfirmado: null, limpezaPendente: false });
      } catch (erro) {
        erroLimpeza = 'A limpeza do armazenamento local não foi concluída. ' + erro.message;
      }
      // AsyncStorage e SecureStore são independentes; tentamos apagar os dois.
      try {
        await clienteSeguro.apagarCliente();
        atualizar({ cliente: null, avisoCliente: '' });
      } catch (erro) {
        atualizar({ avisoCliente: 'Os dados pessoais não foram apagados. Use “Esquecer meus dados” para tentar novamente. ' + erro.message });
      }
      if (erroLimpeza) {
        atualizar({ pronto: false, erroInicial: erroLimpeza + ' Recarregue antes de continuar.' });
        throw new Error(erroLimpeza);
      }
      atualizar({ pronto: true, erroInicial: '' });
      let mensagem = 'O carrinho, as preferências e o último pedido foram apagados.';
      if (estadoAtual.current.avisoCliente) {
        mensagem += '\n\n' + estadoAtual.current.avisoCliente;
      } else {
        mensagem += '\nOs dados pessoais também foram apagados.';
      }
      Alert.alert('Limpeza concluída', mensagem);
    }, 'A limpeza não foi concluída');
  }

  let itens = [];
  if (estado.carrinho) itens = estado.carrinho.itens;
  const totais = calcularTotais(itens);
  let resumoUltimoPedido = null;
  if (estado.ultimoPedido) {
    resumoUltimoPedido = { ...estado.ultimoPedido, ...calcularTotais(estado.ultimoPedido.itens) };
  }
  let resumoConfirmado = null;
  if (estado.pedidoConfirmado) {
    resumoConfirmado = { ...estado.pedidoConfirmado, ...calcularTotais(estado.pedidoConfirmado.itens) };
  }

  return {
    ...estado,
    ...totais,
    resumoUltimoPedido,
    resumoConfirmado,
    produtosVisiveis: filtrarProdutos(estado.preferencias.categoria),
    bloqueado: estado.ocupado || estado.limpezaPendente || !estado.pronto,
    ajustarSelecao: ajustarQuantidade,
    inicializar, adicionarAoCarrinho, mudarQuantidade, removerItem, esvaziarCarrinho,
    mudarPreferencias, confirmarPedido, concluirLimpeza, salvarDadosCliente,
    esquecerCliente, consultarUltimoPedido, limparDados,
  };
}
