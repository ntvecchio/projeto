const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public'))); 

async function login(email, senha) {
    try {
        const usuario = await prisma.usuario.findUnique({
            where: { email }
        });

        if (!usuario) {
            return { success: false, message: 'Usuário não encontrado.' };
        }

        const senhaCorrespondente = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorrespondente) {
            return { success: false, message: 'Credenciais inválidas.' };
        }

        return { success: true, message: 'Login bem-sucedido.', usuario: usuario };
    } catch (error) {
        console.error('Erro no login:', error);
        return { success: false, message: 'Erro no login.', error: error.message };
    }
}

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    const result = await login(email, senha);

    if (result.success) {
        // Definir o cookie 'username' com o nome completo do usuário
        res.cookie('username', result.usuario.nome_completo, { httpOnly: false, path: '/' });
        res.json({
            message: 'Login bem-sucedido!',
            redirect: 'pag1.html',
            usuario: {
                nome_completo: result.usuario.nome_completo,
                email: result.usuario.email
            }
        });
    } else {
        res.status(401).json({ message: result.message });
    }
});




app.post('/registro', async (req, res) => {
    const { nome, usuario, email, senha, confirmaSenha, telefone, nascimento, sexo } = req.body;

    if (senha !== confirmaSenha) {
        return res.status(400).json({ success: false, message: 'As senhas não coincidem.' });
    }

    const validSexos = ['masculino', 'feminino', 'outro'];
    if (!validSexos.includes(sexo)) {
        return res.status(400).json({ success: false, message: 'Sexo inválido.' });
    }

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await prisma.usuario.create({
            data: {
                nome_completo: nome,
                usuario,
                email: email,
                senha: senhaCriptografada,
                telefone: telefone,
                nascimento: nascimento ? new Date(nascimento) : null,
                sexo: sexo
            }
        });
        res.json({ success: true, message: 'Registro realizado com sucesso!', usuario: novoUsuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro no registro.', error: error.message });
    }
});

app.get('/user', async (req, res) => {
    try {
        const users = await prisma.usuario.findMany();
        res.json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
});

app.post('/user', async (req, res) => {
    const { nome_completo, email, telefone, senha = "senha_padrao" } = req.body;

    if (!nome_completo || !email || !telefone || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUser = await prisma.usuario.create({
            data: { nome_completo, email, telefone, senha: senhaCriptografada }
        });
        res.json(novoUser);
    } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
        res.status(500).json({ error: 'Erro ao adicionar usuário.' });
    }
});

app.delete('/user/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const user = await prisma.usuario.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        await prisma.usuario.delete({ where: { id } });
        res.status(204).end();
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({ error: 'Erro interno ao excluir usuário.' });
    }
});

app.get('/user/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = await prisma.usuario.findUnique({ where: { id: userId } });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: `Usuário com ID ${userId} não encontrado.` });
        }
    } catch (error) {
        res.status(500).json({ error: `Erro ao buscar usuário com ID ${userId}` });
    }
});

app.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { nome_completo, email, telefone } = req.body;
    try {
        const updatedUser = await prisma.usuario.update({
            where: { id: parseInt(id) },
            data: { nome_completo, email, telefone }
        });
        res.json(updatedUser);
    } catch (error) {
        console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
        res.status(500).json({ error: `Erro ao atualizar usuário com ID ${id}` });
    }
});


app.get('/administrador', async (req, res) => {
    try {
        const admins = await prisma.administrador.findMany();
        res.json(admins);
    } catch (error) {
        console.error('Erro ao buscar administradores:', error);
        res.status(500).json({ error: 'Erro ao buscar administradores.' });
    }
});

app.post('/administrador', async (req, res) => {
    const { nome_completo, email, telefone } = req.body;

    try {
        const novoAdmin = await prisma.administrador.create({
            data: { nome_completo, email, telefone }
        });
        res.json(novoAdmin);
    } catch (error) {
        console.error('Erro ao adicionar administrador:', error);
        res.status(500).json({ error: 'Erro ao adicionar administrador.' });
    }
});

app.delete('/administrador/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const admin = await prisma.administrador.findUnique({ where: { id } });
        if (!admin) {
            return res.status(404).json({ error: 'Administrador não encontrado.' });
        }

        await prisma.administrador.delete({ where: { id } });
        res.status(204).end();
    } catch (error) {
        console.error('Erro ao excluir administrador:', error);
        res.status(500).json({ error: 'Erro interno ao excluir administrador.' });
    }
});

app.put('/administrador/:id', async (req, res) => {
    const { id } = req.params;
    const { nome_completo, email, telefone } = req.body;
    try {
        const updatedAdmin = await prisma.administrador.update({
            where: { id: parseInt(id) },
            data: { nome_completo, email, telefone }
        });
        res.json(updatedAdmin);
    } catch (error) {
        console.error(`Erro ao atualizar administrador com ID ${id}:`, error);
        res.status(500).json({ error: `Erro ao atualizar administrador com ID ${id}` });
    }
});


// Servir arquivos estáticos (como seu HTML)
app.use(express.static('public'));


const PORT = 3001; // Certifique-se de que esta porta está correta
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


