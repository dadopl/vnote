const express = require('express');
const multer = require('multer');
const RecordingSaveController = require('../controllers/RecordingSaveController');
const RecordingListController = require('../controllers/RecordingListController');
const RecordingGetController = require('../controllers/RecordingGetController');
const RecordingDeleteController = require('../controllers/RecordingDeleteController');

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }
});

router.post('/recordings/save', upload.single('audio'), RecordingSaveController.save.bind(RecordingSaveController));
router.get('/recordings', RecordingListController.list.bind(RecordingListController));
router.get('/recordings/:id', RecordingGetController.get.bind(RecordingGetController));
router.delete('/recordings/:id', RecordingDeleteController.delete.bind(RecordingDeleteController));

module.exports = router;

