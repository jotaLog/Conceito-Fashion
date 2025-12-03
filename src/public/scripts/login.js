document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.mensagem || "Erro no login");
            return;
        }

        // 🔥 SALVAR ID DO USUÁRIO LOGADO
        localStorage.setItem("id_user", data.user.id_user);

        alert("Login OK!");

        // 🔥 REDIRECIONAR PARA INDEX
        window.location.href = "index.html";

    } catch (err) {
        console.error("Erro:", err);
        alert("Erro ao realizar login.");
    }
});