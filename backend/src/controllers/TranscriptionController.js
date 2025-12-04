const WhisperService = require('../services/WhisperService');

class TranscriptionController {
    async transcribe(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Brak pliku audio' });
            }

            const transcription = await WhisperService.transcribe(req.file);

            res.json({
                text: transcription.text,
                language: transcription.language
            });

        } catch (error) {
            console.error('Transcription error:', error);
            res.status(500).json({
                error: 'Błąd transkrypcji: ' + error.message
            });
        }
    }
}

module.exports = new TranscriptionController();

