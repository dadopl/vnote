const express = require('express');
const authMiddleware = require('../middleware/auth');
const authRoutes = require('./auth');
const healthRoutes = require('./health');
const correctionRoutes = require('./correction');
const recordingsRoutes = require('./recordings');
const notesRoutes = require('./notes');
const ttsRoutes = require('./tts');
const emailRoutes = require('./email');

const router = express.Router();

// Public routes (no auth required)
router.use('/api', authRoutes);
router.use('/api', healthRoutes);

// Protected routes (auth required)
router.use('/api', authMiddleware, correctionRoutes);
router.use('/api', authMiddleware, recordingsRoutes);
router.use('/api', authMiddleware, notesRoutes);
router.use('/api', authMiddleware, ttsRoutes);
router.use('/api', authMiddleware, emailRoutes);

module.exports = router;

