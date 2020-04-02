const express = require('express');
const router = express.Router();

router.get('/', UserController.list); 
router.post('/', UserController.create); 
router.put('/', UserController.update); 
router.delete('/', UserController.delete); 

module.exports = router;


