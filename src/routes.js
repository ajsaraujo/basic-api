const express = require('express'); 
const Router = express.Router();

const UserController = require('./controllers/UserController');
const auth = require('./middlewares/auth');
const emailInUse = require('./middlewares/emailInUse');

// Test
Router.get('/', (req, res) => res.send('Olá!'));

// User CRUD operations 
Router.post('/users', emailInUse, UserController.create);
Router.put('/users', auth, UserController.update);
Router.delete('/users', auth, UserController.delete);

// Account
Router.post('/account/recover', emailInUse, UserController.recoverPassword);
Router.post('/account/auth', UserController.auth)

module.exports = Router;