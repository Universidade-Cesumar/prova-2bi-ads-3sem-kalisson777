// Arquivo para código javascriptconst API_URL = "https://6a28b1914e1e783349a5e67b.mockapi.io/materiais";
const API_URL = "https://6a28b1914e1e783349a5e67b.mockapi.io/materiais";

const inputNome = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const btnCadastrar = document.getElementById("btn-cadastrar");
const listaMateriais = document.getElementById("lista-materiais");

async function carregarMateriais() {
    listaMateriais.innerHTML = "";

    const resposta = await fetch(API_URL);
    const materiais = await resposta.json();

    materiais.forEach(material => {
        listaMateriais.innerHTML += `
            <tr>
                <td>${material.nome}</td>
                <td>${material.quantidade}</td>
            </tr>
        `;
    });
}

btnCadastrar.addEventListener("click", async () => {
    const nome = inputNome.value;
    const quantidade = inputQuantidade.value;

    if (nome === "" || quantidade === "") {
        alert("Preencha todos os campos");
        return;
    }

    const novoMaterial = {
        nome: nome,
        quantidade: Number(quantidade)
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

carregarMateriais();