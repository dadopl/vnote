const express = require('express');
const EmailController = require('../controllers/EmailController');

const router = express.Router();

// POST /api/send-email - send email with text
router.post('/send-email', (req, res) => EmailController.send(req, res));

module.exports = router;

