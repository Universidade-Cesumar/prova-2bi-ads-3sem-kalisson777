const API_URL = "https://6a28b1914e1e783349a5e67b.mockapi.io/materiais";

const inputNome = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const inputRetirada = document.getElementById("input-retirada");
const inputBusca = document.getElementById("input-busca");
const totalItens = document.getElementById("total-itens");
const btnCadastrar = document.getElementById("btn-cadastrar");
const listaMateriais = document.getElementById("lista-materiais");

let materiais = [];

function validarRetirada(estoqueAtual, quantidadeRetirada) {
    if (quantidadeRetirada <= 0) {
        return false;
    }

    if (quantidadeRetirada > estoqueAtual) {
        return false;
    }

    return true;
}

function atualizarDashboard(lista) {
    totalItens.textContent = lista.length;
}

function exibirMateriais(lista) {
    listaMateriais.innerHTML = "";

    lista.forEach(material => {
        const classeEstoque = material.quantidade < 10 ? "estoque-critico" : "";

        listaMateriais.innerHTML += `
            <tr class="${classeEstoque}">
                <td>${material.nome}</td>
                <td>${material.quantidade}</td>
                <td>
                    <button
                        class="btn-baixar"
                        onclick="baixarMaterial(${material.id}, ${material.quantidade})">
                        Baixar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirMaterial(${material.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });

    atualizarDashboard(lista);
}

function filtrarMateriais() {
    const termoBusca = inputBusca.value.toLowerCase();

    const materiaisFiltrados = materiais.filter(material =>
        material.nome.toLowerCase().includes(termoBusca)
    );

    exibirMateriais(materiaisFiltrados);
}

async function carregarMateriais() {
    try {
        listaMateriais.innerHTML = "";

        const resposta = await fetch(API_URL);
        materiais = await resposta.json();

        exibirMateriais(materiais);
    } catch (erro) {
        alert("Erro ao carregar materiais. Verifique sua conexão com a internet.");
        console.error("Erro ao carregar materiais:", erro);
    }
}

btnCadastrar.addEventListener("click", async () => {
    const nome = inputNome.value;
    const quantidade = Number(inputQuantidade.value);

    if (nome === "" || quantidade <= 0) {
        alert("Preencha corretamente os campos.");
        return;
    }

    const novoMaterial = {
        nome: nome,
        quantidade: quantidade
    };

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoMaterial)
        });

        inputNome.value = "";
        inputQuantidade.value = "";

        carregarMateriais();
    } catch (erro) {
        alert("Erro ao cadastrar material. Verifique sua conexão com a internet.");
        console.error("Erro ao cadastrar material:", erro);
    }
});

async function baixarMaterial(id, estoqueAtual) {
    const quantidadeRetirada = Number(inputRetirada.value);

    if (!validarRetirada(estoqueAtual, quantidadeRetirada)) {
        alert("Quantidade inválida. Verifique o estoque disponível.");
        return;
    }

    const novaQuantidade = estoqueAtual - quantidadeRetirada;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quantidade: novaQuantidade
            })
        });

        inputRetirada.value = "";

        carregarMateriais();
    } catch (erro) {
        alert("Erro ao baixar material. Verifique sua conexão com a internet.");
        console.error("Erro ao baixar material:", erro);
    }
}

async function excluirMaterial(id) {
    const confirmar = confirm("Deseja realmente excluir este material?");

    if (!confirmar) {
        return;
    }

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        carregarMateriais();
    } catch (erro) {
        alert("Erro ao excluir material. Verifique sua conexão com a internet.");
        console.error("Erro ao excluir material:", erro);
    }
}

inputBusca.addEventListener("input", filtrarMateriais);

carregarMateriais();