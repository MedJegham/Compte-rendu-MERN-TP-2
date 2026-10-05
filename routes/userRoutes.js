const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Le préfixe '/api/users' est défini dans server.js : '/' représente donc '/api/users'
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
