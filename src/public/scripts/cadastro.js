document.querySelector("#formCadastro").addEventListener("submit", e => {
    e.preventDefault();

    fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_name: document.querySelector("#name").value,
            email: document.querySelector("#email").value,
            cpf: document.querySelector("#cpf").value,
            senha: document.querySelector("#senha").value
        })
    })
    .then(r => r.json())
    .then(data => {
        alert("Cadastro feito!");
        window.location.href = "../pages/login.html";
    });
});
