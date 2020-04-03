const UserController = require('../controllers/UserController');
const express = require('express');
const router = express.Router();

// Operações CRUD 
router.post('/', UserController.create); 
router.put('/', UserController.update); 
router.delete('/', UserController.delete); 

// Autenticação
router.post('/auth', UserController.auth); 

module.exports = router;


