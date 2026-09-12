import assert from 'node:assert/strict';
import { beforeEach, mock, test } from 'node:test';
import { adicionarProduto, criarPedido } from '../src/models/pedido.js';

const memoria = new Map();
const chamadas = [];
let falharLeitura = false;
let falharGravacao = false;
const armazenamentoNativo = {
  async getItem(chave) {
    chamadas.push('getItem');
    if (falharLeitura) throw new Error('Falha de leitura');
    if (!memoria.has(chave)) return null;
    return memoria.get(chave);
  },
  async setItem(chave, valor) {
    chamadas.push('setItem');
    if (falharGravacao) throw new Error('Falha de gravação');
    memoria.set(chave, valor);
  },
  async removeItem(chave) { chamadas.push('removeItem'); memoria.delete(chave); },
  async multiGet(chaves) {
    chamadas.push('multiGet');
    return Promise.all(chaves.map(async (chave) => [chave, await armazenamentoNativo.getItem(chave)]));
  },
  async multiSet(pares) { chamadas.push('multiSet'); for (const [chave, valor] of pares) memoria.set(chave, valor); },
  async getAllKeys() { chamadas.push('getAllKeys'); return [...memoria.keys()]; },
  async multiRemove(chaves) { chamadas.push('multiRemove'); for (const chave of chaves) memoria.delete(chave); },
  async clear() { chamadas.push('clear'); memoria.clear(); },
};

// Apenas os módulos nativos são substituídos nos testes de Node; o Service real é exercitado.
mock.module('@react-native-async-storage/async-storage', { defaultExport: armazenamentoNativo });
const servico = await import('../src/services/armazenamento.js');

beforeEach(() => {
  memoria.clear();
  chamadas.length = 0;
  falharLeitura = false;
  falharGravacao = false;
  globalThis.__DEV__ = true;
});

test('ausência de dados é diferente de erro de leitura e não provoca gravação inicial', async () => {
  assert.equal(await servico.carregarCarrinho(), null);
  assert.equal(await servico.carregarUltimoPedido(), null);
  assert.deepEqual(await servico.carregarPreferencias(), servico.preferenciasIniciais);
  assert.equal(chamadas.includes('setItem'), false);
  falharLeitura = true;
  await assert.rejects(servico.carregarCarrinho(), /Falha de leitura/);
});

test('carrinho e pedido usam JSON e as chamadas setItem/getItem/removeItem', async () => {
  const carrinho = adicionarProduto(null, 'bebida-01', 2);
  const pedido = criarPedido(carrinho);
  await servico.salvarCarrinho(carrinho);
  await servico.salvarUltimoPedido(pedido);
  assert.equal(typeof memoria.get(servico.chaves.carrinho), 'string');
  assert.deepEqual(await servico.carregarCarrinho(), carrinho);
  assert.deepEqual(await servico.carregarUltimoPedido(), pedido);
  await servico.apagarCarrinho();
  assert.equal(await servico.carregarCarrinho(), null);
  assert.deepEqual(await servico.carregarUltimoPedido(), pedido);
  assert(chamadas.includes('removeItem'));
});

test('JSON inválido ou formato incorreto não é confundido com carrinho vazio', async () => {
  for (const texto of ['{inválido', '{}', '[]', 'null', 'false']) {
    memoria.set(servico.chaves.carrinho, texto);
    await assert.rejects(servico.carregarCarrinho());
    assert.equal(memoria.get(servico.chaves.carrinho), texto);
  }
});

test('preferências usam multiSet e multiGet e rejeitam valores inválidos', async () => {
  const preferencias = { categoria: 'Bebidas', mostrarDescricoes: false };
  await servico.salvarPreferencias(preferencias);
  assert.deepEqual(await servico.carregarPreferencias(), preferencias);
  assert(chamadas.includes('multiSet'));
  assert(chamadas.includes('multiGet'));
  memoria.set(servico.chaves.descricoes, '"sim"');
  await assert.rejects(servico.carregarPreferencias(), /formato inválido/);
});

test('limpeza do iFome consulta chaves e usa multiRemove preservando chaves externas', async () => {
  memoria.set(servico.chaves.carrinho, '{}');
  memoria.set('@ifome:chave-antiga', 'valor');
  memoria.set('@biblioteca:exemplo', 'preservado');
  await servico.limparDadosIfome();
  assert.deepEqual([...memoria], [['@biblioteca:exemplo', 'preservado']]);
  assert.deepEqual(chamadas, ['getAllKeys', 'multiRemove']);
});

test('clear global só executa em desenvolvimento', async () => {
  memoria.set('@biblioteca:exemplo', 'valor');
  globalThis.__DEV__ = false;
  await assert.rejects(servico.redefinirAsyncStorage(), /desenvolvimento/);
  assert.equal(memoria.size, 1);
  globalThis.__DEV__ = true;
  await servico.redefinirAsyncStorage();
  assert.equal(memoria.size, 0);
  assert.deepEqual(chamadas, ['getAllKeys', 'clear']);
});

test('uma gravação recusada mantém a versão persistida anterior', async () => {
  const carrinho = adicionarProduto(null, 'comida-01', 1);
  await servico.salvarCarrinho(carrinho);
  falharGravacao = true;
  await assert.rejects(servico.salvarCarrinho(adicionarProduto(carrinho, 'comida-01', 1)), /gravação/);
  assert.deepEqual(await servico.carregarCarrinho(), carrinho);
});
