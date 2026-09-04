import { StyleSheet } from 'react-native';

// Aqui eu crio o conjunto de estilos principais para a tela Home.
export const home_css = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Nesta parte eu configuro a tipografia para o texto de boas-vindas.
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 30,
    textAlign: 'center',
  },
  // Aqui eu defino o formato e o espaçamento do botão de sair da aplicação.
  botaoSair: {
    backgroundColor: '#d9534f',
    width: '100%',
    maxWidth: 200,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Por fim eu configuro a cor e o peso da fonte do texto do botão de sair.
  textoBotaoSair: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Agora eu crio os estilos exclusivos para o botão de adicionar novo compromisso.
export const button_css = StyleSheet.create({
  // Aqui eu defino as dimensões, cor de destaque e alinhamento do botão.
  botaoNovoCompromisso: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  // Nesta parte eu configuro o texto em negrito e com contraste legível.
  textoBotaoNovoCompromisso: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Por fim eu crio o módulo de estilos para a janela modal e suas ações internas.
export const modal_css = StyleSheet.create({
  // Aqui eu uso posicionamento absoluto para forçar o fundo escuro a cobrir toda a tela.
  fundoEscuro: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Nesta parte eu desenho o cartão branco flutuante ocupando 85% da largura da tela.
  cartaoConteudo: {
    backgroundColor: '#ffffff',
    width: '85%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  // Aqui eu defino a formatação do título da janela modal.
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  // Agora eu organizo o container em linha para abrigar os dois botões lado a lado.
  containerBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  // Nesta seção eu estilizo o botão verde de confirmação/adição.
  botaoAdicionar: {
    backgroundColor: '#28a745',
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  // Aqui eu formato o texto interno do botão de adicionar.
  textoBotaoAdicionar: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  // Agora eu configuro o botão cinza neutro para fechar ou cancelar o modal.
  botaoFechar: {
    backgroundColor: '#6c757d',
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  // Por fim eu defino a cor e espessura da fonte do botão fechar.
  textoBotaoFechar: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

// Aqui eu crio o conjunto de estilos dedicado ao formulário de criação de compromisso.
export const form_css = StyleSheet.create({
  // Neste container eu garanto que todos os campos ocupem a largura do cartão do modal.
  container: {
    width: '100%',
    marginBottom: 10,
  },
  // Aqui eu configuro o estilo dos títulos/etiquetas acima de cada campo.
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  // Nesta parte eu padronizo as caixas de texto com altura de 50 para seguir o padrão do aplicativo.
  input: {
    backgroundColor: '#f9f9f9',
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#cccccc',
    fontSize: 14,
    color: '#333333',
  },
  // Por fim eu mantenho uma caixa maior para permitir anotações com mais espaço na observação.
  inputObservacao: {
    backgroundColor: '#f9f9f9',
    width: '100%',
    height: 90,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#cccccc',
    fontSize: 14,
    color: '#333333',
    textAlignVertical: 'top',
  },
});