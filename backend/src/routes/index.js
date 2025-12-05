const express = require('express');
const healthRoutes = require('./health');
const correctionRoutes = require('./correction');
const transcriptionRoutes = require('./transcription');
const recordingsRoutes = require('./recordings');
const notesRoutes = require('./notes');
const ttsRoutes = require('./tts');
const emailRoutes = require('./email');

const router = express.Router();

// Mount all routes
router.use('/api', healthRoutes);
router.use('/api', correctionRoutes);
router.use('/api', transcriptionRoutes);
router.use('/api', recordingsRoutes);
router.use('/api', notesRoutes);
router.use('/api', ttsRoutes);
router.use('/api', emailRoutes);

module.exports = router;

