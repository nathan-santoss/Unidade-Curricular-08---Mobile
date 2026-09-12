import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from '@babel/parser';

const ignorados = new Set(['node_modules', '.git', '.expo', 'dist', '.claude']);
const arquivos = [];

async function listar(pasta) {
  for (const entrada of await readdir(pasta, { withFileTypes: true })) {
    if (ignorados.has(entrada.name)) continue;
    const arquivo = path.join(pasta, entrada.name);
    if (entrada.isDirectory()) {
      await listar(arquivo);
    } else {
      assert(!/\.(ts|tsx)$/.test(arquivo) && entrada.name !== 'tsconfig.json', 'TypeScript próprio: ' + arquivo);
      if (/\.(js|jsx)$/.test(arquivo)) arquivos.push(arquivo);
    }
  }
}

function verificarNo(no, arquivo) {
  if (!no || typeof no !== 'object') return;
  assert(no.type !== 'ConditionalExpression', 'Operador ternário: ' + arquivo + ':' + no.loc?.start.line);
  if (no.type === 'JSXElement' || no.type === 'JSXFragment') {
    assert(arquivo.endsWith('.jsx'), 'JSX fora de arquivo .jsx: ' + arquivo);
  }
  if (no.type === 'JSXAttribute' && ['style', 'contentContainerStyle'].includes(no.name.name)) {
    assert(no.value?.expression?.type !== 'ObjectExpression', 'Estilo inline: ' + arquivo);
  }
  for (const valor of Object.values(no)) {
    if (Array.isArray(valor)) {
      for (const filho of valor) verificarNo(filho, arquivo);
    } else if (valor && typeof valor === 'object') {
      verificarNo(valor, arquivo);
    }
  }
}

await listar('.');
for (const arquivo of arquivos) {
  const codigo = await readFile(arquivo, 'utf8');
  verificarNo(parse(codigo, { sourceType: 'module', plugins: ['jsx'] }), arquivo);
  if (arquivo.includes(path.join('src', 'views'))) {
    assert(!codigo.includes("from '@react-native-async-storage") && !codigo.includes("from 'expo-secure-store"), 'View acessa armazenamento: ' + arquivo);
  }
}
console.log(arquivos.length + ' arquivos JavaScript/JSX válidos; sem ternários, TypeScript próprio ou objetos de estilo inline.');
