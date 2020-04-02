const express = require('express');
const router = express.Router();
const {MongoClient} = require('mongodb'); 

router.get('/', (req, res) => {
	return res.send({ message: 'Listando todos os usuários!' });
});

router.post('/create', (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).send({ error: 'Requisição com dados insuficientes.'});
	}

	return res.send({ message: `Criando usuário com email ${email} e senha ${password}` });
});

router.post('/auth', (req, res) => {
	const { email, password } = req.body; 

	if (!email || !password) {
		return res.status(400).send({ error: 'Requisição com dados insuficientes.'});
	}

	return res.send({ message: 'Usuário autenticado.'}); 
});

module.exports = router;


