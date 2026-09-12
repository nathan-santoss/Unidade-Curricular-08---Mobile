import { criarPedido } from '../models/pedido.js';

// O ID do carrinho liga as duas gravações e permite recuperar uma limpeza interrompida.
export async function registrarPedido(carrinho, ultimoPedido, armazenamento) {
  if (!carrinho) throw new Error('Seu carrinho está vazio.');
  let pedido = ultimoPedido;
  if (!pedido || pedido.carrinhoId !== carrinho.id) {
    pedido = criarPedido(carrinho);
    await armazenamento.salvarUltimoPedido(pedido);
  }
  try {
    await armazenamento.apagarCarrinho();
    return { pedido, limpezaPendente: false };
  } catch {
    // O pedido já existe: a próxima tentativa deve apenas terminar a limpeza.
    return { pedido, limpezaPendente: true };
  }
}
