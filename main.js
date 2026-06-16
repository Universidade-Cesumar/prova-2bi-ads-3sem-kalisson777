const API_URL = "https://6a28b1914e1e783349a5e67b.mockapi.io/materiais";

const inputNome = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const inputRetirada = document.getElementById("input-retirada");
const btnCadastrar = document.getElementById("btn-cadastrar");
const listaMateriais = document.getElementById("lista-materiais");

function validarRetirada(estoqueAtual, quantidadeRetirada) {
    if (quantidadeRetirada <= 0) {
        return false;
    }

    if (quantidadeRetirada > estoqueAtual) {
        return false;
    }

    return true;
}

async function carregarMateriais() {
    listaMateriais.innerHTML = "";

    const resposta = await fetch(API_URL);
    const materiais = await resposta.json();

    materiais.forEach(material => {
        listaMateriais.innerHTML += `
            <tr>
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
});

async function baixarMaterial(id, estoqueAtual) {
    const quantidadeRetirada = Number(inputRetirada.value);

    if (!validarRetirada(estoqueAtual, quantidadeRetirada)) {
        alert("Quantidade inválida. Verifique o estoque disponível.");
        return;
    }

    const novaQuantidade = estoqueAtual - quantidadeRetirada;

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
}

async function excluirMaterial(id) {
    const confirmar = confirm("Deseja realmente excluir este material?");

    if (!confirmar) {
        return;
    }

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    carregarMateriais();
}

carregarMateriais();