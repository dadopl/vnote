const TtsService = require('../services/TtsService');

class TtsDiaryListController {
    async list(req, res) {
        try {
            const audios = await TtsService.getDiaryAudios();

            res.json({ audios });

        } catch (error) {
            console.error('TTS diary list error:', error);
            res.status(500).json({
                error: 'Błąd pobierania audio: ' + error.message
            });
        }
    }
}

module.exports = new TtsDiaryListController();

