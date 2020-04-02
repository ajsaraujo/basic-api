const UserController = require('../controllers/UserController');
const express = require('express');
const router = express.Router();

router.post('/', UserController.create); 
//router.put('/', UserController.update); 
//router.delete('/', UserController.delete); 

module.exports = router;


