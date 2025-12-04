const express = require('express');
const multer = require('multer');
const TranscriptionController = require('../controllers/TranscriptionController');

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }
});

router.post('/transcribe', upload.single('audio'), TranscriptionController.transcribe.bind(TranscriptionController));

module.exports = router;

