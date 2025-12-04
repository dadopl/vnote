const TtsService = require('../services/TtsService');

class TtsGenerateController {
    async generate(req, res) {
        try {
            const { text, voiceId, noteId, voiceSettings = {} } = req.body;

            if (!text || !voiceId) {
                return res.status(400).json({
                    error: 'Brak tekstu lub ID głosu'
                });
            }

            if (!noteId) {
                return res.status(400).json({
                    error: 'noteId jest wymagany'
                });
            }

            if (text.length > 2000) {
                return res.status(400).json({
                    error: `Tekst za długi (${text.length}/2000 znaków)`
                });
            }

            const audio = await TtsService.generateAudio(text, voiceId, noteId, voiceSettings);

            res.json({
                success: true,
                audio
            });

        } catch (error) {
            console.error('TTS generate error:', error);
            res.status(500).json({
                error: 'Błąd generowania audio: ' + error.message
            });
        }
    }
}

module.exports = new TtsGenerateController();

