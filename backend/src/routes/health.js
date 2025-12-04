const express = require('express');
const HealthController = require('../controllers/HealthController');

const router = express.Router();

router.get('/health', HealthController.check.bind(HealthController));

module.exports = router;
