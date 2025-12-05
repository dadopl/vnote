const TtsService = require('../services/TtsService');
const i18n = require('../config/i18n');

class TtsGenerateController {
    async generate(req, res) {
        try {
            const { text, voiceId, noteId, voiceSettings = {}, language = 'en' } = req.body;
            const lang = i18n.getLanguage(language);

            if (!text || !voiceId) {
                return res.status(400).json({
                    error: i18n.getErrorMessage('noTextOrVoice', lang)
                });
            }

            if (!noteId) {
                return res.status(400).json({
                    error: i18n.getErrorMessage('noteIdRequired', lang)
                });
            }

            if (text.length > 2000) {
                return res.status(400).json({
                    error: i18n.getErrorMessage('textTooLong', lang, text.length)
                });
            }

            const audio = await TtsService.generateAudio(text, voiceId, noteId, voiceSettings, lang);

            res.json({
                success: true,
                audio
            });

        } catch (error) {
            console.error('TTS generate error:', error);
            const lang = i18n.getLanguage(req.body?.language);
            res.status(500).json({
                error: i18n.getErrorMessage('generateError', lang) + error.message
            });
        }
    }
}

module.exports = new TtsGenerateController();

