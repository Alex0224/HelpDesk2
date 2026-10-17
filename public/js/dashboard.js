async function carregarComponenteDashboard(id, caminho) {
    const componente = document.getElementById(id);
    const resposta = await fetch(caminho);
    const html = await resposta.text();
    
    componente.innerHTML = html;
}

async function carregarDadosUsuario() {

    let resposta;

    try{

        resposta = await fetch('/api/auth/me');

    } catch(erro){
        console.log("Erro inesperado no servidor.");
        console.log(erro.message);
        return;
    }

    const dados = await resposta.json();

    if(resposta.status === 401){
        window.location.href = "/";
        return;
    } else if(!resposta.ok){
        console.log("Erro interno no servidor.");
        console.log(dados.mensagem);
        return;
    }
    
    const usuario = dados.usuario;

    const txtNomeUsuario = document.getElementById("nomeUsuario");
    const txtRoleUsuario = document.getElementById("roleUsuario");

    txtNomeUsuario.innerText = usuario.nome;
    txtRoleUsuario.innerText = usuario.role;
}

async function inicializarDashboard() {
    await carregarComponenteDashboard("sidebar", "/components/sidebar.html");
    await carregarComponenteDashboard("header", "/components/header.html");
    await carregarDadosUsuario();
}

inicializarDashboard();