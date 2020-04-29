const express = require('express'); 
const swaggerUi = require('swagger-ui-express');
const Router = express.Router();

// Documentation
const swaggerDocument = require('./swagger.json');

// Controllers
const UserController = require('./controllers/UserController');
const AccountController = require('./controllers/AccountController');

// Middlewares
const auth = require('./middlewares/auth');
const emailInUse = require('./middlewares/emailInUse');

// Documentation UI
Router.use('/', swaggerUi.serve);
Router.get('/', swaggerUi.setup(swaggerDocument));

// User CRUD operations 
Router.post('/users', emailInUse, UserController.createUser);
Router.get('/users/:userId', auth, UserController.getUserData);
Router.put('/users/:userId', auth, UserController.updateUser);
Router.delete('/users/:userId', auth, UserController.deleteUser);

// Account
Router.post('/account/recover', AccountController.recoverPassword);
Router.post('/account/auth', AccountController.auth)

module.exports = Router;