const TtsService = require('../services/TtsService');

class TtsVoicesController {
    async getVoices(req, res) {
        try {
            if (!process.env.ELEVEN_LABS_API_KEY) {
                return res.status(500).json({
                    error: 'ELEVEN_LABS_API_KEY nie jest skonfigurowany'
                });
            }

            const voices = await TtsService.getVoices();

            res.json({ voices });

        } catch (error) {
            console.error('TTS voices error:', error);
            res.status(500).json({
                error: 'Błąd pobierania głosów: ' + error.message
            });
        }
    }
}

module.exports = new TtsVoicesController();

