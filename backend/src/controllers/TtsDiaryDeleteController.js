const TtsService = require('../services/TtsService');

class TtsDiaryDeleteController {
    async delete(req, res) {
        try {
            const { audioId } = req.params;
            await TtsService.deleteDiaryAudio(audioId);

            res.json({
                success: true,
                message: 'Audio usunięte'
            });

        } catch (error) {
            console.error('TTS diary delete error:', error);
            res.status(500).json({
                error: 'Błąd usuwania audio: ' + error.message
            });
        }
    }
}

module.exports = new TtsDiaryDeleteController();

