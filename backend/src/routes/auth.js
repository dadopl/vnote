const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

router.post('/login', (req, res) => AuthController.login(req, res));
router.post('/logout', (req, res) => AuthController.logout(req, res));
router.get('/session', (req, res) => AuthController.getSession(req, res));

module.exports = router;

