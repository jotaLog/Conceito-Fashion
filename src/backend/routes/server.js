const express = require('express');
const cors = require('cors');
const db = require('../db');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/usuarios', (req, res) => {
    const { user_name, email, cpf, senha } = req.body;

    if (!user_name || !email || !cpf || !senha) {
        return res.status(400).json({ erro: "Preencha todos os campos!" });
    }

    bcrypt.hash(senha, 10, (err, hash) => {
        if (err) return res.status(500).json({ erro: "Erro ao criptografar senha" });

        const sql = `
            INSERT INTO usuarios (user_name, email, cpf, senha)
            VALUES (?, ?, ?, ?)
        `;

        db.query(sql, [user_name, email, cpf, hash], (erro, result) => {
            if (erro) {
                return res.status(500).json({ erro });
            }

            res.json({
                mensagem: "Usuário cadastrado com sucesso!",
                id: result.insertId
            });
        });
    });
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const sql = "SELECT * FROM usuarios WHERE email = ?";

    db.query(sql, [email], (erro, results) => {
        if (erro) return res.status(500).json({ erro });
        if (results.length === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }

        const user = results[0];

        bcrypt.compare(senha, user.senha, (err, match) => {
            if (err) return res.status(500).json({ erro: err });
            if (!match) {
                return res.status(401).json({ mensagem: "Senha incorreta" });
            }

            res.json({
                mensagem: "Login realizado com sucesso!",
                user: {
                    id_user: user.id_user,
                    user_name: user.user_name,
                    email: user.email,
                    cpf: user.cpf
                }
            });
        });
    });
});


app.post('/categorias', (req, res) => {
    const { name_category } = req.body;
    db.query('INSERT INTO categorias (name_category) VALUES (?)', [name_category], (err, result) => {
        if (err) return res.status(500).json({ erro: err });
        res.json({ mensagem: 'Categoria adicionada', id: result.insertId });
    });
});

app.get('/categorias', (req, res) => {
    db.query('SELECT * FROM categorias', (err, results) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(results);
    });
});


app.post('/roupas', (req, res) => {
    const { name_roupa, preco_roupa, estoque, foreign_id_categoria } = req.body;
    db.query(
        'INSERT INTO roupas (name_roupa, preco_roupa, estoque, foreign_id_categoria) VALUES (?, ?, ?, ?)',
        [name_roupa, preco_roupa, estoque, foreign_id_categoria],
        (err, result) => {
            if (err) return res.status(500).json({ erro: err });
            res.json({ mensagem: 'Roupa cadastrada!', id: result.insertId });
        }
    );
});

app.get('/roupas', (req, res) => {
    db.query('SELECT * FROM roupas', (err, results) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(results);
    });
});

app.get('/roupas/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM roupas WHERE id_roupa = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ erro: err });
        if (result.length === 0) return res.status(404).json({ mensagem: 'Roupa não encontrada' });
        res.json(result[0]);
    });
});

app.get('/categorias/:id/roupas', (req, res) => {
    const { id } = req.params;
    db.query(
        'SELECT * FROM roupas WHERE foreign_id_categoria = ?',
        [id],
        (err, results) => {
            if (err) return res.status(500).json({ erro: err });
            res.json(results);
        }
    );
});


app.post('/carrinho/:id_user', (req, res) => {
    const { id_user } = req.params;
    const { id_roupa, qtd } = req.body;

    const sqlCheck = 'SELECT * FROM itens_carrinho WHERE foreign_id_user = ? AND foreign_id_roupa = ?';

    db.query(sqlCheck, [id_user, id_roupa], (err, rows) => {
        if (err) return res.status(500).json({ erro: err });

        if (rows.length > 0) {
            const sqlUpdate = 'UPDATE itens_carrinho SET qtd_itens_carrinho = qtd_itens_carrinho + ? WHERE id_itens_carrinho = ?';
            db.query(sqlUpdate, [qtd, rows[0].id_itens_carrinho], (err2) => {
                if (err2) return res.status(500).json({ erro: err2 });
                res.json({ mensagem: 'Quantidade atualizada no carrinho!' });
            });
        } else {
            const sqlInsert = 'INSERT INTO itens_carrinho (foreign_id_user, foreign_id_roupa, qtd_itens_carrinho) VALUES (?, ?, ?)';
            db.query(sqlInsert, [id_user, id_roupa, qtd], (err3) => {
                if (err3) return res.status(500).json({ erro: err3 });
                res.json({ mensagem: 'Item adicionado ao carrinho!' });
            });
        }
    });
});

app.get('/carrinho/:id_user', (req, res) => {
    const { id_user } = req.params;

    const sql = `
        SELECT ic.id_itens_carrinho, r.name_roupa, r.preco_roupa, ic.qtd_itens_carrinho
        FROM itens_carrinho ic
        JOIN roupas r ON ic.foreign_id_roupa = r.id_roupa
        WHERE ic.foreign_id_user = ?`;

    db.query(sql, [id_user], (err, results) => {
        if (err) return res.status(500).json({ erro: err });
        res.json(results);
    });
});

app.delete('/carrinho/:id_user/:id_roupa', (req, res) => {
    const { id_user, id_roupa } = req.params;

    const sql = 'DELETE FROM itens_carrinho WHERE foreign_id_user = ? AND foreign_id_roupa = ?';

    db.query(sql, [id_user, id_roupa], (err) => {
        if (err) return res.status(500).json({ erro: err });
        res.json({ mensagem: 'Item removido do carrinho!' });
    });
});


app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
