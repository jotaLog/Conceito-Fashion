document.addEventListener("DOMContentLoaded", () => {
    carregarCarrinho();
});

async function carregarCarrinho() {
    const id_user = localStorage.getItem("id_user");

    if (!id_user) {
        alert("Você precisa estar logado!");
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/carrinho/${id_user}`);
        const itens = await res.json();

        const containerItens = document.querySelector(".carrinho-lateral .item");
        const titulo = document.querySelector(".carrinho-lateral h2");
        const botaoFinalizar = document.querySelector(".finalizar");

        containerItens.innerHTML = ""; // limpa lista

        let subtotal = 0;

        itens.forEach(item => {
            subtotal += parseFloat(item.preco_roupa) * item.qtd_itens_carrinho;

            containerItens.innerHTML += `
                <div class="cart-produto">
                    <div>
                        <strong>${item.name_roupa}</strong><br>
                        <span style="opacity:.7">qt: ${item.qtd_itens_carrinho}</span>
                    </div>

                    <div style="text-align:right;">
                        R$ ${(parseFloat(item.preco_roupa)).toFixed(2)} <br>
                    </div>
                </div>
            `;
        });

        // atualizar título
        titulo.textContent = `Carrinho (${itens.length})`;

        // atualizar subtotal do botão
        botaoFinalizar.textContent = `Finalizar Pedido — R$`;

    } catch (err) {
        console.error("Erro ao carregar carrinho:", err);
    }
}
