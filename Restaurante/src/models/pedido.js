import { buscarProduto, produtos } from './cardapio.js';

export const quantidadeMaxima = 99;

export function validarQuantidade(quantidade) {
  if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > quantidadeMaxima) {
    throw new Error('Escolha uma quantidade inteira entre 1 e 99 por produto.');
  }
  return quantidade;
}

export function ajustarQuantidade(quantidade, variacao) {
  validarQuantidade(quantidade);
  return Math.max(1, Math.min(quantidadeMaxima, quantidade + variacao));
}

export function gerarIdentificador() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

// Model: regras e cálculos puros. Os valores continuam em centavos até a View.
export function calcularTotais(itens) {
  let totalCentavos = 0;
  let totalUnidades = 0;
  const itensCalculados = itens.map((item) => {
    const subtotalCentavos = item.precoCentavos * item.quantidade;
    totalCentavos += subtotalCentavos;
    totalUnidades += item.quantidade;
    return { ...item, subtotalCentavos };
  });
  return { itens: itensCalculados, totalCentavos, totalUnidades };
}

export function adicionarProduto(carrinho, produtoId, quantidade) {
  validarQuantidade(quantidade);
  const produto = buscarProduto(produtoId);
  if (!produto) throw new Error('Este produto não está disponível.');
  let atual = carrinho;
  if (!atual) atual = { id: gerarIdentificador(), itens: [] };
  const existente = atual.itens.find((item) => item.id === produtoId);
  if (existente) {
    validarQuantidade(existente.quantidade + quantidade);
    return alterarQuantidade(atual, produtoId, existente.quantidade + quantidade);
  }
  const item = { id: produto.id, nome: produto.nome, precoCentavos: produto.precoCentavos, quantidade };
  return { ...atual, itens: [...atual.itens, item] };
}

export function alterarQuantidade(carrinho, produtoId, quantidade) {
  validarQuantidade(quantidade);
  if (!carrinho) return null;
  return {
    ...carrinho,
    itens: carrinho.itens.map((item) => {
      if (item.id === produtoId) return { ...item, quantidade };
      return item;
    }),
  };
}

export function removerProduto(carrinho, produtoId) {
  if (!carrinho) return null;
  const itens = carrinho.itens.filter((item) => item.id !== produtoId);
  if (itens.length === 0) return null;
  return { ...carrinho, itens };
}

function validarId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9-]{1,80}$/.test(id);
}

function validarItens(itens) {
  if (!Array.isArray(itens) || itens.length === 0 || itens.length > 100) {
    throw new Error('A lista de itens salva tem formato inválido.');
  }
  const ids = new Set();
  return itens.map((item) => {
    if (!item || !validarId(item.id) || ids.has(item.id)
      || typeof item.nome !== 'string' || !item.nome.trim() || item.nome.length > 120
      || !Number.isSafeInteger(item.precoCentavos) || item.precoCentavos <= 0
      || item.precoCentavos > 1000000) {
      throw new Error('Um item salvo tem ID, nome ou preço inválido.');
    }
    validarQuantidade(item.quantidade);
    ids.add(item.id);
    return { id: item.id, nome: item.nome, precoCentavos: item.precoCentavos, quantidade: item.quantidade };
  });
}

export function restaurarCarrinho(dados) {
  if (dados === null) return null;
  if (!dados || !validarId(dados.id)) throw new Error('O carrinho salvo tem formato inválido.');
  const itens = validarItens(dados.itens);
  if (itens.length > produtos.length) throw new Error('O carrinho possui itens desconhecidos.');
  for (const item of itens) {
    const produto = buscarProduto(item.id);
    if (!produto || produto.precoCentavos !== item.precoCentavos || produto.nome !== item.nome) {
      throw new Error('O carrinho salvo contém um produto que mudou ou não está disponível.');
    }
  }
  return { id: dados.id, itens };
}

export function criarPedido(carrinho, data = new Date()) {
  if (!carrinho || carrinho.itens.length === 0) throw new Error('Adicione itens antes de confirmar.');
  const itens = validarItens(carrinho.itens);
  return {
    id: 'IF-' + carrinho.id,
    carrinhoId: carrinho.id,
    data: data.toISOString(),
    itens,
    totalCentavos: calcularTotais(itens).totalCentavos,
  };
}

export function restaurarPedido(dados) {
  if (dados === null) return null;
  if (!dados || !validarId(dados.carrinhoId) || dados.id !== 'IF-' + dados.carrinhoId
    || typeof dados.data !== 'string' || !Number.isFinite(Date.parse(dados.data))) {
    throw new Error('O último pedido salvo tem formato inválido.');
  }
  const itens = validarItens(dados.itens);
  if (dados.totalCentavos !== calcularTotais(itens).totalCentavos) {
    throw new Error('O total do pedido salvo é inválido.');
  }
  // Só os campos do pedido são restaurados; dados pessoais não fazem parte dele.
  return { id: dados.id, carrinhoId: dados.carrinhoId, data: dados.data, itens, totalCentavos: dados.totalCentavos };
}
