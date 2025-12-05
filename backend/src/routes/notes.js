const express = require('express');
const NoteAutoSaveController = require('../controllers/NoteAutoSaveController');
const NoteSaveController = require('../controllers/NoteSaveController');
const NoteListController = require('../controllers/NoteListController');

const router = express.Router();

router.post('/notes/save', NoteSaveController.save.bind(NoteSaveController));
router.post('/notes/autosave', NoteAutoSaveController.autoSave.bind(NoteAutoSaveController));
router.get('/notes', NoteListController.getList.bind(NoteListController));
router.get('/notes/:id', NoteListController.getOne.bind(NoteListController));
router.delete('/notes/:id', NoteListController.delete.bind(NoteListController));

module.exports = router;

