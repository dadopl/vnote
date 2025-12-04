const RecordingService = require('../services/RecordingService');

class RecordingListController {
    async list(req, res) {
        try {
            const recordings = await RecordingService.getRecordings();

            res.json({
                recordings
            });

        } catch (error) {
            console.error('Recording list error:', error);
            res.status(500).json({
                error: 'Błąd pobierania nagrań: ' + error.message
            });
        }
    }
}

module.exports = new RecordingListController();

