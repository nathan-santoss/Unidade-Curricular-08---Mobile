import assert from 'node:assert/strict';
import { beforeEach, mock, test } from 'node:test';

let disponivel = true;
let salvo = null;
let falhar = false;
const chamadas = [];
mock.module('expo-secure-store', { namedExports: {
  async isAvailableAsync() { chamadas.push('isAvailableAsync'); return disponivel; },
  async getItemAsync(chave) { chamadas.push(['getItemAsync', chave]); return salvo; },
  async setItemAsync(chave, valor) {
    chamadas.push(['setItemAsync', chave]);
    if (falhar) throw new Error('Acesso recusado');
    salvo = valor;
  },
  async deleteItemAsync(chave) {
    chamadas.push(['deleteItemAsync', chave]);
    if (falhar) throw new Error('Acesso recusado');
    salvo = null;
  },
} });
const servico = await import('../src/services/clienteSeguro.js');

beforeEach(() => { disponivel = true; salvo = null; falhar = false; chamadas.length = 0; });

test('cliente opcional é salvo, restaurado e apagado somente no SecureStore', async () => {
  assert.equal(await servico.carregarCliente(), null);
  const cliente = { nome: 'Ana', telefone: '(11) 99999-9999' };
  await servico.salvarCliente(cliente);
  assert.deepEqual(await servico.carregarCliente(), cliente);
  assert.equal(servico.chaveCliente, 'ifome_cliente');
  await servico.apagarCliente();
  assert.equal(await servico.carregarCliente(), null);
  for (const metodo of ['getItemAsync', 'setItemAsync', 'deleteItemAsync']) {
    assert(chamadas.some((chamada) => chamada[0] === metodo && chamada[1] === 'ifome_cliente'));
  }
});

test('indisponibilidade e falha são informadas; não existe fallback inseguro', async () => {
  disponivel = false;
  await assert.rejects(servico.carregarCliente(), /não está disponível/);
  await assert.rejects(servico.salvarCliente({ nome: '', telefone: '' }), /não está disponível/);
  assert.equal(salvo, null);
  disponivel = true;
  falhar = true;
  await assert.rejects(servico.salvarCliente({ nome: 'Ana', telefone: '' }), /recusado/);
});

test('dados pessoais malformados são rejeitados', async () => {
  for (const texto of ['{', 'null', '{}', '{"nome":1,"telefone":2}']) {
    salvo = texto;
    await assert.rejects(servico.carregarCliente());
  }
  assert.throws(() => servico.validarCliente({ nome: 'A'.repeat(81), telefone: '' }));
});

test('falha ao esquecer não declara dados apagados', async () => {
  await servico.salvarCliente({ nome: 'Ana', telefone: '' });
  falhar = true;
  await assert.rejects(servico.apagarCliente(), /recusado/);
  assert.equal(JSON.parse(salvo).nome, 'Ana');
});
