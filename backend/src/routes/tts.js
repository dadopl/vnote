const express = require('express');
const TtsVoicesController = require('../controllers/TtsVoicesController');
const TtsGenerateController = require('../controllers/TtsGenerateController');
const TtsDiaryListController = require('../controllers/TtsDiaryListController');
const TtsDiaryGetController = require('../controllers/TtsDiaryGetController');
const TtsDiaryDeleteController = require('../controllers/TtsDiaryDeleteController');

const router = express.Router();

router.get('/tts/voices', TtsVoicesController.getVoices.bind(TtsVoicesController));
router.post('/tts/generate', TtsGenerateController.generate.bind(TtsGenerateController));
router.get('/tts/diary', TtsDiaryListController.list.bind(TtsDiaryListController));
router.get('/tts/diary/:audioId', TtsDiaryGetController.get.bind(TtsDiaryGetController));
router.delete('/tts/diary/:audioId', TtsDiaryDeleteController.delete.bind(TtsDiaryDeleteController));

module.exports = router;

