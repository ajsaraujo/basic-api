const UserController = require('../controllers/UserController');
const express = require('express');
const router = express.Router();

// Operações CRUD 
router.post('/', UserController.create); 
router.put('/', UserController.update); 
router.delete('/', UserController.delete); 

// Autenticação
router.post('/auth', UserController.auth);
router.post('/recover_password', UserController.recoverPassword);  

module.exports = router;


