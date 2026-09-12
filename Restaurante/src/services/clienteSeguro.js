import * as SecureStore from 'expo-secure-store';

export const chaveCliente = 'ifome_cliente';

export function validarCliente(dados) {
  if (!dados || typeof dados.nome !== 'string' || typeof dados.telefone !== 'string'
    || dados.nome.length > 80 || dados.telefone.length > 25) {
    throw new Error('Informe um nome de até 80 caracteres e um telefone de até 25 caracteres.');
  }
  return { nome: dados.nome.trim(), telefone: dados.telefone.trim() };
}

export async function verificarDisponibilidade() {
  const disponivel = await SecureStore.isAvailableAsync();
  if (!disponivel) throw new Error('O armazenamento seguro não está disponível neste aparelho. Você pode continuar fazendo pedidos.');
}

export async function carregarCliente() {
  await verificarDisponibilidade();
  const texto = await SecureStore.getItemAsync(chaveCliente);
  if (texto === null) return null;
  let dados;
  try {
    dados = JSON.parse(texto);
  } catch {
    throw new Error('Os dados do cliente não puderam ser lidos. Você pode apagá-los nos Ajustes.');
  }
  return validarCliente(dados);
}

export async function salvarCliente(dados) {
  const cliente = validarCliente(dados);
  await verificarDisponibilidade();
  // Dados pessoais ficam somente no SecureStore, sem biometria ou cópia no AsyncStorage.
  await SecureStore.setItemAsync(chaveCliente, JSON.stringify(cliente));
  return cliente;
}

export async function apagarCliente() {
  await verificarDisponibilidade();
  await SecureStore.deleteItemAsync(chaveCliente);
}
