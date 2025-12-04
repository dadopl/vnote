const TtsService = require('../services/TtsService');

class TtsDiaryGetController {
    async get(req, res) {
        try {
            const { audioId } = req.params;
            const audioStream = await TtsService.getDiaryAudio(audioId);

            res.setHeader('Content-Type', 'audio/mpeg');
            audioStream.pipe(res);

        } catch (error) {
            console.error('TTS diary get error:', error);
            res.status(404).json({
                error: 'Audio nie znalezione'
            });
        }
    }
}

module.exports = new TtsDiaryGetController();

