const express = require('express'); 
const Router = express.Router();

// Controllers
const UserController = require('./controllers/UserController');
const AccountController = require('./controllers/AccountController');

// Middlewares
const auth = require('./middlewares/auth');
const emailInUse = require('./middlewares/emailInUse');

// Test
Router.get('/', (req, res) => res.send('Olá!'));

// User CRUD operations 
Router.post('/users', emailInUse, UserController.createUser);
Router.put('/users/:userId', auth, UserController.updateUser);
Router.delete('/users/:userId', auth, UserController.deleteUser);

// Account
Router.post('/account/recover', emailInUse, AccountController.recoverPassword);
Router.post('/account/auth', AccountController.auth)

module.exports = Router;