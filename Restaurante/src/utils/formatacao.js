export function formatarMoeda(centavos) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatarData(data) {
  return new Date(data).toLocaleString('pt-BR');
}
