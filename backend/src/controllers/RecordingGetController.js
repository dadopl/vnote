const RecordingService = require('../services/RecordingService');

class RecordingGetController {
    async get(req, res) {
        try {
            const { id } = req.params;
            const audioStream = await RecordingService.getRecording(id);

            res.setHeader('Content-Type', 'audio/webm');
            audioStream.pipe(res);

        } catch (error) {
            console.error('Recording get error:', error);
            res.status(404).json({
                error: 'Nagranie nie znalezione'
            });
        }
    }
}

module.exports = new RecordingGetController();

