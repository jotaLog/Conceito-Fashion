document.getElementById("formProduto").addEventListener("submit", (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/roupas", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name_roupa: document.getElementById("name_roupa").value,
            preco_roupa: document.getElementById("preco_roupa").value,
            estoque: document.getElementById("estoque").value,
            foreign_id_categoria: document.getElementById("categoria").value
        })
    })
    .then(res => res.json())
    .then(data => alert(JSON.stringify(data)));
});
