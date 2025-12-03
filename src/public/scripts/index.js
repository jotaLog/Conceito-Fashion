document.addEventListener("DOMContentLoaded", () => {
    carregarRoupas();
});

async function carregarRoupas() {
    try {
        const res = await fetch("http://localhost:3000/roupas");
        const roupas = await res.json();

        const lista = document.getElementById("listaRoupas");

        lista.innerHTML = ""; 

        const grid = document.createElement("div");
        grid.classList.add("prod-grid");

        roupas.forEach(r => {
            const card = document.createElement("div");
            card.classList.add("prod-card");

            card.innerHTML = `
                <div class="prod-thumb"></div>
                <h3 class="prod-title">${r.name_roupa}</h3>
                <p class="price">R$ ${r.preco_roupa}</p>
                <button class="btn-add" onclick="addCarrinho('${r.id_roupa}')">
                    Adicionar ao Carrinho
                </button>
            `;

            grid.appendChild(card);
        });

        lista.appendChild(grid);

    } catch (err) {
        console.error("Erro ao carregar roupas:", err);
    }
}

async function addCarrinho(id_roupa) {
    const id_user = localStorage.getItem("id_user");

    if (!id_user) {
        alert("Você precisa estar logado!");
        window.location.href = "../../pages/login.html";
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/carrinho/${id_user}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_roupa: id_roupa,
                qtd: 1
            })
        });

        const data = await res.json();

        alert(data.mensagem);

        window.location.href = "../pages/carrinho.html";

    } catch (err) {
        console.error("Erro ao adicionar ao carrinho:", err);
        alert("Erro ao adicionar item.");
    }
}
