const express = require('express'); 
const Router = express.Router();

const UserController = require('./controllers/UserController');

// Test
Router.get('/', (req, res) => res.send('Olá!'));

// User CRUD operations 
Router.post('/users', UserController.create);
Router.put('/users', UserController.update);
Router.delete('/users', UserController.delete);

// Account
Router.post('/account/recover', UserController.recoverPassword);
Router.post('/account/auth', UserController.auth)

module.exports = Router;