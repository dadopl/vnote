const TtsService = require('../services/TtsService');
const i18n = require('../config/i18n');

class TtsVoicesController {
    async getVoices(req, res) {
        try {
            const language = req.query.language || 'en';
            const lang = i18n.getLanguage(language);

            if (!process.env.ELEVEN_LABS_API_KEY) {
                return res.status(500).json({
                    error: i18n.getErrorMessage('elevenLabsNotConfigured', lang)
                });
            }

            const voices = await TtsService.getVoices(lang);

            res.json({ voices });

        } catch (error) {
            console.error('TTS voices error:', error);
            const lang = i18n.getLanguage(req.query?.language);
            res.status(500).json({
                error: i18n.getErrorMessage('voicesError', lang) + error.message
            });
        }
    }
}

module.exports = new TtsVoicesController();

