const UserController = require('../controllers/UserController');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth'); 

// Operações CRUD 
router.post('/', UserController.create); 
router.put('/', authMiddleware, UserController.update); 
router.delete('/', authMiddleware, UserController.delete); 

// Autenticação
router.post('/auth', UserController.auth);
router.post('/recover_password', authMiddleware, UserController.recoverPassword);  

module.exports = router;


