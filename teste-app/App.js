import React, { useState } from 'react';

// Primeiro eu importo todas as telas que farão parte do fluxo do aplicativo.
import Home from './src/pages/Home';
import Cadastro from './src/pages/Cadastro';
import Dashboard from './src/pages/Dashboard';

export default function App() {
    // Aqui eu crio o estado que vai controlar qual tela o usuário está vendo no momento.
    // O aplicativo sempre iniciará exibindo a tela 'Home'.
    const [telaAtual, setTelaAtual] = useState('Home');

    // Agora eu preparo a função responsável por levar o usuário para a página de formulário.
    function navegarParaCadastro() {
        setTelaAtual('Cadastro');
    }

    // Em seguida eu crio a função que direciona o usuário para a visão do feed/perfil.
    function navegarParaDashboard() {
        setTelaAtual('Dashboard');
    }

    // Neste ponto eu defino a ação de retorno, que sempre enviará o usuário de volta ao início.
    function voltarParaInicio() {
        setTelaAtual('Home');
    }

    // Aqui eu utilizo a estrutura condicional simples para decidir qual interface renderizar.
    // Verifico se o usuário solicitou acessar a área de cadastro.
    if (telaAtual === 'Cadastro') {
        // Por segurança eu passo a função de voltar como propriedade para que a tela consiga acioná-la.
        return <Cadastro voltarParaInicio={voltarParaInicio} />;
    }

    // Depois eu verifico se o destino atual desejado é o dashboard simulando o Instagram.
    if (telaAtual === 'Dashboard') {
        // Novamente eu injeto a função de retorno para permitir a navegação de volta.
        return <Dashboard voltarParaInicio={voltarParaInicio} />;
    }

    // Por fim, caso nenhuma das condições acima seja atendida, eu renderizo o menu principal.
    // Injeto as funções de ida para que os botões da Home consigam alterar o estado central.
    return (
        <Home
            irParaCadastro={navegarParaCadastro}
            irParaDashboard={navegarParaDashboard}
        />
    );
}