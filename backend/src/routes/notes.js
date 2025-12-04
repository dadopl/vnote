const express = require('express');
const NoteAutoSaveController = require('../controllers/NoteAutoSaveController');
const NoteSaveController = require('../controllers/NoteSaveController');

const router = express.Router();

router.post('/notes/save', NoteSaveController.save.bind(NoteSaveController));
router.post('/notes/autosave', NoteAutoSaveController.autoSave.bind(NoteAutoSaveController));

module.exports = router;

