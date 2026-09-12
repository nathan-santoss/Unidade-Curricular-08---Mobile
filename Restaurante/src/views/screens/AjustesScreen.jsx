import { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { useApp } from '../../contexts/AppContext.jsx';
import { estilos } from '../../styles/telas.js';
import { cores, coresInterruptor } from '../../styles/cores.js';
import { formatarData } from '../../utils/formatacao.js';
import AcoesLimpeza from '../components/AcoesLimpeza.jsx';
import Botao from '../components/Botao.jsx';
import ItensPedido from '../components/ItensPedido.jsx';
import Tela from '../components/Tela.jsx';
import TotalPedido from '../components/TotalPedido.jsx';

export default function AjustesScreen({ navigation }) {
  const { cliente, avisoCliente, preferencias, mudarPreferencias, salvarDadosCliente, esquecerCliente,
    consultarUltimoPedido, resumoUltimoPedido, bloqueado, ocupado } = useApp();
  const [nome, definirNome] = useState('');
  const [telefone, definirTelefone] = useState('');
  const [mostrarPedido, definirMostrarPedido] = useState(false);
  const [mensagem, definirMensagem] = useState('');
  const campoTelefone = useRef(null);

  useEffect(() => {
    if (cliente) {
      definirNome(cliente.nome);
      definirTelefone(cliente.telefone);
    } else {
      definirNome('');
      definirTelefone('');
    }
  }, [cliente]);

  async function salvar() {
    Keyboard.dismiss();
    const sucesso = await salvarDadosCliente({ nome, telefone });
    if (sucesso) definirMensagem('Seus dados foram salvos no aparelho.');
  }

  function confirmarEsquecimento() {
    Alert.alert('Esquecer meus dados?', 'Seu nome e telefone serão apagados do armazenamento seguro.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Esquecer', style: 'destructive', onPress: async () => {
        const sucesso = await esquecerCliente();
        if (sucesso) {
          definirNome('');
          definirTelefone('');
          definirMensagem('Seus dados foram apagados.');
        }
      } },
    ]);
  }

  async function consultarPedido() {
    const sucesso = await consultarUltimoPedido();
    if (sucesso) definirMostrarPedido(true);
  }

  return (
    <Tela navigation={navigation} titulo="Do seu jeito" subtitulo="Seus dados e suas preferências, por aqui.">
      <KeyboardAvoidingView style={estilos.corpo} behavior="padding">
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          <View style={estilos.cartao}>
            <Text style={estilos.tituloSecao}>Seus dados</Text>
            <Text style={estilos.texto}>Nome e telefone são opcionais. Você pode fazer pedidos sem preencher.</Text>
            {Boolean(avisoCliente) && <View style={estilos.aviso}><Text style={estilos.textoAviso}>{avisoCliente}</Text></View>}
            <View style={estilos.campo}>
              <Text style={estilos.rotulo}>Nome (opcional)</Text>
              <TextInput accessibilityLabel="Nome (opcional)" style={estilos.entrada} value={nome} onChangeText={definirNome}
                placeholder="Como podemos chamar você?" placeholderTextColor={cores.secundario} maxLength={80}
                autoCapitalize="words" autoComplete="name" textContentType="name" returnKeyType="next"
                onSubmitEditing={() => campoTelefone.current?.focus()} editable={!ocupado} />
            </View>
            <View style={estilos.campo}>
              <Text style={estilos.rotulo}>Telefone (opcional)</Text>
              <TextInput ref={campoTelefone} accessibilityLabel="Telefone (opcional)" style={estilos.entrada} value={telefone} onChangeText={definirTelefone}
                placeholder="(11) 99999-9999" placeholderTextColor={cores.secundario} maxLength={25}
                keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" editable={!ocupado} />
            </View>
            <Botao titulo="Salvar meus dados" aoPressionar={salvar} desabilitado={ocupado} />
            <Botao titulo="Esquecer meus dados" variante="secundario" aoPressionar={confirmarEsquecimento} desabilitado={ocupado} />
            {Boolean(mensagem) && <Text accessibilityLiveRegion="polite" style={estilos.texto}>{mensagem}</Text>}
          </View>
          <View style={estilos.cartao}>
            <Text style={estilos.tituloSecao}>Cardápio</Text>
            <View style={estilos.opcao}>
              <View style={estilos.flexivel}>
                <Text style={estilos.textoForte}>Mostrar descrições</Text>
                <Text style={estilos.texto}>Veja os ingredientes de cada opção.</Text>
              </View>
              <Switch accessibilityLabel="Mostrar descrições dos produtos" value={preferencias.mostrarDescricoes}
                onValueChange={(mostrarDescricoes) => mudarPreferencias({ mostrarDescricoes })} disabled={bloqueado}
                trackColor={coresInterruptor} thumbColor={cores.superficie} />
            </View>
          </View>
          <View style={estilos.cartao}>
            <Text style={estilos.tituloSecao}>Último pedido</Text>
            <Text style={estilos.texto}>Só o pedido mais recente fica salvo neste aparelho.</Text>
            <Botao titulo="Consultar último pedido" variante="secundario" aoPressionar={consultarPedido} desabilitado={ocupado} />
            {mostrarPedido && !resumoUltimoPedido && <Text style={estilos.texto}>Você ainda não tem um pedido salvo.</Text>}
            {mostrarPedido && resumoUltimoPedido && <>
              <Text selectable style={estilos.identificador}>{resumoUltimoPedido.id}</Text>
              <Text style={estilos.texto}>{formatarData(resumoUltimoPedido.data)}</Text>
              <ItensPedido itens={resumoUltimoPedido.itens} />
              <TotalPedido totalCentavos={resumoUltimoPedido.totalCentavos} totalUnidades={resumoUltimoPedido.totalUnidades} />
              <Text style={estilos.etiqueta}>Registrado localmente. Não enviado a um restaurante.</Text>
              <Botao titulo="Fechar consulta" variante="discreto" aoPressionar={() => definirMostrarPedido(false)} />
            </>}
          </View>
          <View style={estilos.cartao}>
            <Text style={estilos.tituloSecao}>Limpar dados</Text>
            <Text style={estilos.texto}>As ações abaixo pedem confirmação antes de apagar.</Text>
            <AcoesLimpeza />
          </View>
          <Text style={estilos.etiqueta}>iFome · Projeto acadêmico · Feito para aprender</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Tela>
  );
}
