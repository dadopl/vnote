const RecordingService = require('../services/RecordingService');

class RecordingDeleteController {
    async delete(req, res) {
        try {
            const { id } = req.params;
            await RecordingService.deleteRecording(id);

            res.json({
                success: true,
                message: 'Nagranie usunięte'
            });

        } catch (error) {
            console.error('Recording delete error:', error);
            res.status(500).json({
                error: 'Błąd usuwania nagrania: ' + error.message
            });
        }
    }
}

module.exports = new RecordingDeleteController();

