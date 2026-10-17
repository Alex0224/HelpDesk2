
const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", function (event) {
    event.preventDefault();
    validarCampos();
});

// Exibe um alerta temporário na tela.
function mostrarToast(mensagem, tipo = "info", duracao = 4000) {
    const container = document.getElementById("toastContainer");

    if (!container) {
        console.error("Contêiner de alertas não encontrado.");
        return;
    }

    const configuracoes = {
        success: {
            titulo: "Sucesso",
            icone: "✓"
        },
        error: {
            titulo: "Erro",
            icone: "!"
        },
        warning: {
            titulo: "Atenção",
            icone: "⚠"
        },
        info: {
            titulo: "Informação",
            icone: "i"
        }
    };

    const configuracao = configuracoes[tipo] || configuracoes.info;

    const toast = document.createElement("div");
    toast.className = `toast toast--${tipo}`;
    toast.setAttribute("role", tipo === "error" ? "alert" : "status");

    const icone = document.createElement("span");
    icone.className = "toast__icon";
    icone.setAttribute("aria-hidden", "true");
    icone.textContent = configuracao.icone;

    const conteudo = document.createElement("div");
    conteudo.className = "toast__content";

    const titulo = document.createElement("p");
    titulo.className = "toast__title";
    titulo.textContent = configuracao.titulo;

    const texto = document.createElement("p");
    texto.className = "toast__message";
    texto.textContent = mensagem;

    const fechar = document.createElement("button");
    fechar.className = "toast__close";
    fechar.type = "button";
    fechar.textContent = "×";
    fechar.setAttribute("aria-label", "Fechar notificação");

    const temporizador = document.createElement("div");
    temporizador.className = "toast__timer";

    conteudo.append(titulo, texto);
    toast.append(icone, conteudo, fechar, temporizador);
    container.appendChild(toast);

    temporizador.style.animationDuration = `${duracao}ms`;

    let timeout;
    let removendo = false;

    function removerToast() {
        if (removendo) return;
        removendo = true;

        clearTimeout(timeout);
        toast.classList.add("toast--saindo");

        toast.addEventListener("animationend", () => {
            toast.remove();
        }, { once: true });

        // Garante a remoção mesmo se as animações estiverem desativadas.
        setTimeout(() => toast.remove(), 250);
    }

    fechar.addEventListener("click", removerToast);

    timeout = setTimeout(removerToast, duracao);
}

// Valida os campos e envia as credenciais ao backend.
async function validarCampos() {
    const txtEmail = document.getElementById("txtEmail").value.trim();
    const txtSenha = document.getElementById("txtSenha").value;

    if (!txtEmail) {
        mostrarToast("Informe seu e-mail.", "warning");
        return;
    }

    if (!txtSenha) {
        mostrarToast("Informe sua senha.", "warning");
        return;
    }

    try {
        const resposta = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: txtEmail,
                senha: txtSenha
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mostrarToast(
                dados.mensagem || "Login realizado com sucesso.",
                "success"
            );

            window.location.href = "/dashboard";
        } else {
            mostrarToast(
                dados.mensagem || dados.erro || "Não foi possível realizar o login.",
                resposta.status === 409 ? "warning" : "error"
            );
        }
    } catch (erro) {
        console.error("Erro ao realizar login:", erro);

        mostrarToast(
            "Não foi possível conectar ao servidor. Tente novamente.",
            "error"
        );
    }
}
