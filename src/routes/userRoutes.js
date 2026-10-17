const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
router.post('/login', userController.login);

router.get('/api/auth/me', authMiddleware, userController.obterUsuarioAutenticado);

module.exports = router;