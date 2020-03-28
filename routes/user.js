const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	return res.send({ message: 'Listando todos os usuários!' });
});

router.post('/create', (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).send({ error: 'Requisição com dados insuficientes.'});

	return res.send({ message: `Criando usuário com email ${email} e senha ${password}` });
});

module.exports = router;


