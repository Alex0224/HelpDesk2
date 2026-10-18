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

    if(usuario.role === "attendant"){
        txtRoleUsuario.innerText = "Atendente";
    } else if( usuario.role === "admin"){
        txtRoleUsuario.innerText = "Admin";
    } else {
        txtRoleUsuario.innerText = "Requester";
    }

    txtNomeUsuario.innerText = usuario.nome;
    
    await configurarMenuPorUsuario(usuario.role)
}

async function inicializarDashboard() {
    await carregarComponenteDashboard("sidebar", "/components/sidebar.html");
    await carregarComponenteDashboard("header", "/components/header.html");
    await carregarDadosUsuario();
    lucide.createIcons();
    configurarNavegacao();
    configurarLogout();
}

function configurarNavegacao(){
    const links = document.querySelectorAll(".menuLateral a[data-page]");

    links.forEach(link =>{
        link.addEventListener("click", async(event) =>{
            event.preventDefault();

            links.forEach(link =>{
                link.classList.remove("ativo");
            });

            link.classList.add("ativo");
            carregarPagina(link.dataset.page);
        })
    });
}

async function carregarPagina(pagina) {
    const caminho = `/pages/${pagina}/${pagina}.html`;

    await carregarComponenteDashboard("conteudoPrincipal", caminho);
}

async function configurarMenuPorUsuario(role) {
    const links = document.querySelectorAll(".menuLateral a[data-page]");

    links.forEach(link =>{
        const perfisPermitido = link.dataset.roles.split(",").map(perfil => perfil.trim());

        link.hidden = !perfisPermitido.includes(role);
    });

    const primeiroLinkVisivel = [...links].find(link => !link.hidden);

    if (primeiroLinkVisivel) {
    primeiroLinkVisivel.classList.add("ativo");
    await carregarPagina(primeiroLinkVisivel.dataset.page);
    }
}

function configurarLogout() {
    const btnLogout = document.getElementById("btnLogout");

    btnLogout.addEventListener("click", async () => {
        try {
            const resposta = await fetch('/api/me/logout', {
                method: 'POST'
            });

            if (!resposta.ok) {
                console.log("Erro ao finalizar sessão. Tente novamente.");
                return;
            }

            window.location.href = "/";
        } catch (erro) {
            console.error("Erro ao realizar logout:", erro);
        }
    });
}

inicializarDashboard();