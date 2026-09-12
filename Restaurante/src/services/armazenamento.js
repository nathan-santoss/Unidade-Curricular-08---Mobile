import AsyncStorage from '@react-native-async-storage/async-storage';
import { categorias } from '../models/cardapio.js';
import { restaurarCarrinho, restaurarPedido } from '../models/pedido.js';

export const prefixo = '@ifome:';
export const chaves = {
  carrinho: prefixo + 'carrinho',
  ultimoPedido: prefixo + 'ultimoPedido',
  categoria: prefixo + 'categoria',
  descricoes: prefixo + 'descricoes',
};
export const preferenciasIniciais = { categoria: 'Todos', mostrarDescricoes: true };

export function interpretarJson(texto, nome) {
  if (texto === null) return null;
  try {
    const dados = JSON.parse(texto);
    if (dados === null) throw new Error('Conteúdo nulo.');
    return dados;
  } catch {
    throw new Error('Não foi possível interpretar ' + nome + '. Os dados salvos foram preservados.');
  }
}

// Services: chamadas reais da API 2.x. Erros sobem para o Controller tratar.
export async function carregarCarrinho() {
  const texto = await AsyncStorage.getItem(chaves.carrinho);
  return restaurarCarrinho(interpretarJson(texto, 'o carrinho'));
}

export async function salvarCarrinho(carrinho) {
  await AsyncStorage.setItem(chaves.carrinho, JSON.stringify(carrinho));
}

export async function apagarCarrinho() {
  await AsyncStorage.removeItem(chaves.carrinho);
}

export async function carregarUltimoPedido() {
  const texto = await AsyncStorage.getItem(chaves.ultimoPedido);
  return restaurarPedido(interpretarJson(texto, 'o último pedido'));
}

export async function salvarUltimoPedido(pedido) {
  await AsyncStorage.setItem(chaves.ultimoPedido, JSON.stringify(pedido));
}

export async function carregarPreferencias() {
  const pares = await AsyncStorage.multiGet([chaves.categoria, chaves.descricoes]);
  const valores = Object.fromEntries(pares);
  const preferencias = { ...preferenciasIniciais };
  if (valores[chaves.categoria] !== null) {
    preferencias.categoria = interpretarJson(valores[chaves.categoria], 'a categoria');
  }
  if (valores[chaves.descricoes] !== null) {
    preferencias.mostrarDescricoes = interpretarJson(valores[chaves.descricoes], 'as preferências');
  }
  if (!categorias.includes(preferencias.categoria) || typeof preferencias.mostrarDescricoes !== 'boolean') {
    throw new Error('As preferências salvas têm formato inválido.');
  }
  return preferencias;
}

export async function salvarPreferencias(preferencias) {
  await AsyncStorage.multiSet([
    [chaves.categoria, JSON.stringify(preferencias.categoria)],
    [chaves.descricoes, JSON.stringify(preferencias.mostrarDescricoes)],
  ]);
}

export async function limparDadosIfome() {
  const existentes = await AsyncStorage.getAllKeys();
  const chavesIfome = existentes.filter((chave) => chave.startsWith(prefixo));
  await AsyncStorage.multiRemove(chavesIfome);
}

export async function redefinirAsyncStorage() {
  if (!__DEV__) throw new Error('Esta ação só está disponível em desenvolvimento.');
  await AsyncStorage.getAllKeys();
  await AsyncStorage.clear();
}
