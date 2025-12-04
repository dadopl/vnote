const express = require('express');
const TextCorrectionController = require('../controllers/TextCorrectionController');

const router = express.Router();

router.post('/correct', TextCorrectionController.correct.bind(TextCorrectionController));

module.exports = router;

