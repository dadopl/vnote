const RecordingService = require('../services/RecordingService');

class RecordingSaveController {
    async save(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Brak pliku audio' });
            }

            const { name, duration, noteId } = req.body;

            if (!noteId) {
                return res.status(400).json({ error: 'noteId jest wymagany' });
            }

            const recording = await RecordingService.saveRecording(req.file, name, duration, noteId);

            res.json({
                success: true,
                recording
            });

        } catch (error) {
            console.error('Recording save error:', error);
            res.status(500).json({
                error: 'Błąd zapisu nagrania: ' + error.message
            });
        }
    }
}

module.exports = new RecordingSaveController();

