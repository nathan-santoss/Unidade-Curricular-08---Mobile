import assert from 'node:assert/strict';
import test from 'node:test';
import { produtos, filtrarProdutos } from '../src/models/cardapio.js';
import { adicionarProduto, ajustarQuantidade, alterarQuantidade, calcularTotais, criarPedido, removerProduto, restaurarCarrinho, restaurarPedido } from '../src/models/pedido.js';
import { registrarPedido } from '../src/controllers/confirmacao.js';

function montarCarrinho() {
  let carrinho = adicionarProduto(null, 'comida-01', 2);
  carrinho = adicionarProduto(carrinho, 'bebida-04', 3);
  return carrinho;
}

test('cardápio possui IDs únicos, seis comidas e quatro bebidas disponíveis', () => {
  assert.equal(new Set(produtos.map((produto) => produto.id)).size, produtos.length);
  assert.equal(filtrarProdutos('Comidas').length, 6);
  assert.equal(filtrarProdutos('Bebidas').length, 4);
  assert.equal(filtrarProdutos('Todos').length, 10);
});

test('calcula unidades, subtotais e total usando inteiros em centavos', () => {
  const resumo = calcularTotais(montarCarrinho().itens);
  assert.equal(resumo.totalUnidades, 5);
  assert.equal(resumo.itens[0].subtotalCentavos, 5780);
  assert.equal(resumo.itens[1].subtotalCentavos, 1470);
  assert.equal(resumo.totalCentavos, 7250);
  assert.deepEqual(calcularTotais([]), { itens: [], totalCentavos: 0, totalUnidades: 0 });
});

test('adicionar o mesmo produto soma sem duplicar e sem alterar o estado anterior', () => {
  const original = montarCarrinho();
  const novo = adicionarProduto(original, 'comida-01', 2);
  assert.equal(novo.itens.length, 2);
  assert.equal(novo.itens[0].quantidade, 4);
  assert.equal(original.itens[0].quantidade, 2);
  assert.equal(novo.id, original.id);
});

test('quantidade mínima permanece em um; remover é uma ação separada', () => {
  assert.equal(ajustarQuantidade(1, -1), 1);
  assert.equal(ajustarQuantidade(99, 1), 99);
  const carrinho = adicionarProduto(null, 'comida-01', 1);
  const alterado = alterarQuantidade(carrinho, 'comida-01', 3);
  assert.equal(carrinho.itens[0].quantidade, 1);
  assert.equal(alterado.itens[0].quantidade, 3);
  assert.equal(removerProduto(alterado, 'comida-01'), null);
});

test('rejeita quantidade negativa, fracionada, zero, excessiva e IDs desconhecidos', () => {
  for (const quantidade of [0, -1, 1.5, 100, NaN, '2']) {
    assert.throws(() => adicionarProduto(null, 'comida-01', quantidade));
  }
  assert.throws(() => adicionarProduto(null, 'nao-existe', 1));
  assert.throws(() => adicionarProduto(adicionarProduto(null, 'comida-01', 99), 'comida-01', 1));
});

test('restaura uma cópia validada e trata ausência de carrinho', () => {
  const carrinho = montarCarrinho();
  const restaurado = restaurarCarrinho(JSON.parse(JSON.stringify(carrinho)));
  assert.deepEqual(restaurado, carrinho);
  assert.notEqual(restaurado.itens[0], carrinho.itens[0]);
  assert.equal(restaurarCarrinho(null), null);
});

test('restauração rejeita dados incorretos, duplicatas, preços e quantidades inválidos', () => {
  const carrinho = montarCarrinho();
  for (const dados of [{}, [], { id: 'x', itens: [] }, { ...carrinho, itens: [carrinho.itens[0], carrinho.itens[0]] }]) {
    assert.throws(() => restaurarCarrinho(dados));
  }
  for (const alteracao of [{ id: 'desconhecido' }, { quantidade: 0 }, { quantidade: 1.2 }, { precoCentavos: -1 }, { precoCentavos: 1 }, { nome: 'Nome adulterado' }]) {
    assert.throws(() => restaurarCarrinho({ ...carrinho, itens: [{ ...carrinho.itens[0], ...alteracao }] }));
  }
});

test('pedido guarda cópia dos preços, data e ID, sem dados pessoais', () => {
  const carrinho = montarCarrinho();
  carrinho.cliente = { nome: 'Teste', telefone: '123' };
  const pedido = criarPedido(carrinho, new Date('2026-09-11T12:00:00.000Z'));
  assert.equal(pedido.totalCentavos, 7250);
  assert.equal(pedido.data, '2026-09-11T12:00:00.000Z');
  assert.equal(pedido.id, 'IF-' + carrinho.id);
  assert.equal('cliente' in pedido, false);
  carrinho.itens[0].precoCentavos = 9999;
  assert.equal(pedido.itens[0].precoCentavos, 2890);
  assert.deepEqual(restaurarPedido(pedido), pedido);
  assert.throws(() => restaurarPedido({ ...pedido, totalCentavos: 10 }));
  assert.throws(() => restaurarPedido({ ...pedido, data: 'data inválida' }));
});

test('falha ao salvar pedido permite tentar de novo, sem apagar ou modificar carrinho', async () => {
  const carrinho = montarCarrinho();
  const antes = structuredClone(carrinho);
  let apagamentos = 0;
  const armazenamento = {
    async salvarUltimoPedido() { throw new Error('Sem espaço'); },
    async apagarCarrinho() { apagamentos += 1; },
  };
  await assert.rejects(registrarPedido(carrinho, null, armazenamento), /Sem espaço/);
  assert.equal(apagamentos, 0);
  assert.deepEqual(carrinho, antes);
  let salvo = null;
  armazenamento.salvarUltimoPedido = async (pedido) => { salvo = pedido; };
  const resultado = await registrarPedido(carrinho, null, armazenamento);
  assert.equal(resultado.limpezaPendente, false);
  assert.equal(apagamentos, 1);
  assert.equal(salvo.totalCentavos, 7250);
});

test('falha na limpeza preserva pedido e retoma sem gravar outro, inclusive após reabertura', async () => {
  const carrinho = montarCarrinho();
  let gravacoes = 0;
  let salvo = null;
  const armazenamento = {
    async salvarUltimoPedido(pedido) { gravacoes += 1; salvo = structuredClone(pedido); },
    async apagarCarrinho() { throw new Error('Falha de limpeza'); },
  };
  const primeira = await registrarPedido(carrinho, null, armazenamento);
  assert.equal(primeira.limpezaPendente, true);
  const pedidoRestaurado = restaurarPedido(JSON.parse(JSON.stringify(salvo)));
  const carrinhoRestaurado = restaurarCarrinho(JSON.parse(JSON.stringify(carrinho)));
  let limpo = false;
  armazenamento.apagarCarrinho = async () => { limpo = true; };
  const segunda = await registrarPedido(carrinhoRestaurado, pedidoRestaurado, armazenamento);
  assert.equal(segunda.limpezaPendente, false);
  assert.equal(segunda.pedido.id, primeira.pedido.id);
  assert.equal(segunda.pedido.data, primeira.pedido.data);
  assert.equal(gravacoes, 1);
  assert.equal(limpo, true);
});
