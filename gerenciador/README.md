# Gerenciador de tarefas

Aplicativo acadêmico em React Native/Expo e JavaScript, com contas e tarefas locais. Não utiliza servidor, API ou banco online.

## Executar

O estado recebido já utiliza **Expo SDK 57**, React 19.2.3 e React Native 0.86.3. Essas versões foram preservadas. AsyncStorage 2.2.0 foi a única dependência de aplicação adicionada.

```sh
npm install
npm start
```

Abra no iPhone com um cliente Expo compatível com o SDK 57 e leia o QR code. Computador e aparelho devem conseguir se comunicar pela rede. Depois de carregar o aplicativo, contas e tarefas não dependem de serviços online. O link do repositório abre uma página externa.

O comando `npm run ios` requer macOS e simulador configurado. No Windows, use o iPhone físico. A versão web não faz parte desta entrega: SecureStore é nativo e o SQLite web exige configuração própria.

## Funcionalidades

- Cadastro, login, restauração de sessão e logout.
- Criação, listagem, detalhes, edição e exclusão de tarefas com confirmação.
- Status pendente, em andamento e concluída; é possível reabrir tarefas.
- Prioridade baixa, média (padrão) e alta.
- Título obrigatório, descrição e prazo opcionais.
- Filtros por status e preferência persistente para exibir concluídas.
- Home com nome real, contagem por status e três tarefas mais recentes.
- Perfil com nome/e-mail reais, preferência e link do repositório.
- Carregamento, erros e ações para tentar novamente nas consultas.

## Organização para apresentação

```text
Screens / Components → Controllers → Services → Repositories → SQLite
                              Context API: autenticação em execução
                              SecureStore: credenciais e sessão local
                              AsyncStorage: preferências de cada conta
```

| Pasta | Responsabilidade |
| --- | --- |
| `src/screens` | Interface, campos, eventos e estados de carregamento |
| `src/components` | Formulário de login, campo com rótulo, botão, seletor de opções, cartão e estado vazio reutilizáveis |
| `src/controllers` | Chamar serviços e devolver `{ success, message, ... }` à interface |
| `src/services` | Validar dados, coordenar operações e acessar os armazenamentos de sessão/preferências |
| `src/repositories` | Executar SQL parametrizado |
| `src/database` | Abrir a conexão, ativar chaves estrangeiras e criar tabelas |
| `src/contexts` | Disponibilizar usuário, login, cadastro, logout e recuperação de sessão |
| `src/hooks` | Compartilhar a consulta de tarefas ao receber foco entre Home e lista |
| `src/navigation` | Bottom Tabs e Stack de tarefas |
| `src/constants` | Valores internos e rótulos de status/prioridades |
| `src/utils` | Validar e formatar datas sem deslocamento de fuso horário |
| `src/styles` | Estilos compartilhados e estilos específicos existentes |

`App.js` prepara primeiro o SQLite. Depois, `AuthProvider` recupera a sessão e busca o usuário. A navegação só disponibiliza Login/Register quando não há autenticação; quando há, disponibiliza Main. Atualizar o Context troca esse conjunto de rotas e remove o histórico anterior.

O Stack de tarefas contém `TasksList`, `TaskDetails` e `TaskForm`. Detalhes/edição recebem somente `taskId`. O formulário usa a ausência desse ID para criar e sua presença para editar. `useFocusEffect` recarrega lista, detalhes e Home após voltar de outra tela.

### Reutilização de código

- `executeController`: centraliza o `try/catch` e a resposta de sucesso/erro. Cada controller mantém explícito qual serviço chama e quais dados devolve.
- `completeAuthentication`: compartilha o salvamento da sessão entre login e cadastro, preservando suas mensagens específicas de falha.
- `normalizeOptionalText`: converte campos opcionais vazios em `NULL` no cadastro e na edição de tarefas.
- `AppInput`: compartilha rótulo e campo entre os formulários de cadastro e tarefa, aceitando as propriedades nativas do `TextInput`.
- `AppButton`: também é reutilizado no login e cadastro, com variante de texto para as ações secundárias.

Essas extrações mantêm os nomes públicos das funções, a separação de responsabilidades e o uso de `if` em vez de ternários. Não foram adicionadas dependências.

## Persistência

O arquivo `gerenciador.db` mantém as tabelas originais `users` e `tasks`, com relação **1:N** por `tasks.user_id`. O schema mantém PRIMARY KEY, AUTOINCREMENT, NOT NULL, UNIQUE, DEFAULT, CHECK e FOREIGN KEY com exclusão em cascata. A inicialização é idempotente e não apaga os registros existentes.

Todas as consultas, atualizações e exclusões de tarefas incluem `user_id`. O serviço confirma também a propriedade antes de editar, mudar status ou excluir. Entradas do usuário são parâmetros, nunca partes concatenadas do SQL.

As senhas continuam na implementação local existente do SecureStore, separadas da tabela `users`. A sessão salva apenas o ID do usuário, e não um token de servidor. Falhas ao salvar sessão retornam mensagens; falhas temporárias de restauração permitem tentar novamente. Se o cadastro já tiver sido concluído e só o salvamento da sessão falhar, a mensagem orienta entrar pela tela de login.

A preferência `preferences.showCompletedTasks.<userId>` fica no AsyncStorage. O Switch só confirma a mudança após salvá-la. Quando desligado, concluídas ficam ocultas em todos os filtros da lista; selecionar “Concluída” pode, portanto, mostrar um estado vazio. A lista informa isso e orienta alterar a preferência no Perfil. O resumo da Home continua contando todas as tarefas.

Datas são digitadas como `DD/MM/AAAA`, validadas pelo calendário e salvas como `AAAA-MM-DD`. Valores opcionais vazios ficam como `NULL` no SQLite. Status e prioridade são gravados com os valores exigidos pelo schema, como `EM_ANDAMENTO` e `MEDIA`.

## Auditoria do estado recebido

A revisão foi feita antes das alterações, considerando todos os arquivos de `src`, `App.js`, configuração, dependências instaladas, imports e referências.

| Área | Estado encontrado e trabalho realizado |
| --- | --- |
| SQLite e repositories | Existentes; preservados schema e SQL parametrizado. Abertura compartilhada e ordenação determinística aprimoradas |
| Controllers e services de tarefas | CRUD já existente; preservado e completado com validação de identificadores/datas e constantes comuns |
| TaskForm | Só validava título e imprimia dados; conectado ao cadastro e reutilizado na edição |
| Lista e detalhes | Lista era apenas um estado vazio; adicionados FlatList, cartões, detalhes, status, confirmação de exclusão e filtros |
| Autenticação | Cadastro/login já existiam; corrigidos tratamento de sessão, e-mail e navegação condicionada ao Context |
| Home e Perfil | Substituídos conteúdos fixos por dados do usuário e tarefas reais |
| Preferências | Adicionados AsyncStorage, serviço e Switch por conta |
| Linking | Utilizado o endereço real de `git remote origin` |
| Código abandonado | Removidos `createAdmin.js`, `checarAdmin.js`, `updateUser` sem uso e estilos antigos da Home |
| Interface | Mantidos azul, fundo claro, cartões e navegação existentes; ajustados teclado, áreas seguras e estados assíncronos |

A documentação [Expo 54](https://docs.expo.dev/versions/v54.0.0/) foi consultada conforme `AGENTS.md`, junto à referência [SQLite do Expo 57](https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/) e às APIs efetivamente instaladas. A navegação segue os fluxos documentados de [autenticação](https://reactnavigation.org/docs/auth-flow/) e [useFocusEffect](https://reactnavigation.org/docs/use-focus-effect/).

## Verificações automatizadas

Com Node.js 24:

```sh
npm test
npx expo install --check
npx expo export --platform ios --output-dir dist/ios --no-bytecode
```

Os 13 testes exercitam os controllers, services, repositories e schema de verdade. O SQL roda no SQLite nativo do Node; as pontes de SecureStore, AsyncStorage e expo-sqlite são substituídas no ambiente de teste. Nenhuma dependência de teste adicional foi instalada: a transformação JavaScript utiliza o Babel já presente nas dependências do Expo.

Cobertura: inicialização repetida, restrições SQL, cadastro/login, e-mail duplicado, senha incorreta, rollback quando a credencial falha, CRUD, status, campos opcionais, datas inválidas, IDs inválidos, tarefa inexistente, isolamento entre contas, entradas com aspas/SQL, erros assíncronos, sessão e preferências. A persistência do SQLite é verificada fechando e reabrindo um arquivo temporário. A restauração das pontes de armazenamento é simulada; não equivale a testar o Keychain ou AsyncStorage no iPhone.

Resultados nesta entrega: 13 testes aprovados; conferência local das dependências compatível; imports/sintaxe revisados; exportação JavaScript iOS aprovada. A exportação não é uma compilação nativa nem substitui o teste no aparelho.

## Roteiro manual no iPhone — pendente de execução

Este ambiente Windows não dispõe de simulador iOS ou iPhone conectado. Conferir no aparelho antes da apresentação:

- [ ] Abrir sem sessão: preparação do banco e tela Login; abrir Cadastro e voltar.
- [ ] Enviar cadastro vazio, e-mail inválido, senhas diferentes e senha curta; conferir mensagens.
- [ ] Cadastrar conta A; conferir entrada automática, nome/e-mail no Perfil e Home vazia.
- [ ] Sair e tentar e-mail duplicado, senha errada e conta inexistente; depois entrar corretamente.
- [ ] Fechar completamente e reabrir; conferir restauração da sessão.
- [ ] Criar uma tarefa só com título; conferir prioridade média e campos opcionais vazios.
- [ ] Criar tarefas com descrição, prazo e cada prioridade; testar título vazio e data impossível.
- [ ] Abrir detalhes, editar todos os campos, apagar descrição/prazo e voltar; conferir atualização da lista e Home.
- [ ] Alternar os três status e reabrir uma concluída; conferir filtros e contagens.
- [ ] Cancelar a exclusão, depois confirmar; conferir remoção da tarefa e atualização do resumo.
- [ ] Desligar “Mostrar tarefas concluídas”; conferir lista/filtros, fechar e reabrir e conferir persistência. Reativar.
- [ ] Criar conta B e confirmar que nenhuma tarefa da A aparece e que a preferência é independente.
- [ ] Fazer logout; confirmar que voltar não reabre telas autenticadas. Entrar na A e conferir seus registros.
- [ ] Abrir o repositório; conferir teclado, rolagem, texto ampliado e área do indicador inferior do iPhone.
- [ ] Abrir uma tarefa inexistente em teste de desenvolvimento e conferir erro/voltar. Os controllers já cobrem esse caso automaticamente.

Para a apresentação: demonstre primeiro o CRUD; depois explique a relação entre as tabelas, o caminho View → Controller → Service → Repository e a finalidade diferente de cada armazenamento.
