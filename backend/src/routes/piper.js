const express = require('express');
const PiperController = require('../controllers/PiperController');

const router = express.Router();

// POST /api/piper/generate - generate audio from text
router.post('/piper/generate', (req, res) => PiperController.generate(req, res));

// GET /api/piper/voices - list available voices
router.get('/piper/voices', (req, res) => PiperController.getVoices(req, res));

// GET /api/piper/audios - list generated audios
router.get('/piper/audios', (req, res) => PiperController.getAudios(req, res));

// GET /api/piper/audio/:filename - get audio file
router.get('/piper/audio/:filename', (req, res) => PiperController.getAudio(req, res));

// DELETE /api/piper/audio/:filename - delete audio file
router.delete('/piper/audio/:filename', (req, res) => PiperController.deleteAudio(req, res));

module.exports = router;

