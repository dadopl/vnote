const PiperService = require('../services/PiperService');
const path = require('path');
const fs = require('fs');

class PiperController {
    async generate(req, res) {
        try {
            const { text, voice } = req.body;

            if (!text || !text.trim()) {
                return res.status(400).json({ error: 'Text is required' });
            }

            const audio = await PiperService.generateTherapyAudio(text, voice);

            res.json({
                success: true,
                audio
            });

        } catch (error) {
            console.error('Piper generate error:', error);
            res.status(500).json({
                error: 'Error generating audio: ' + error.message
            });
        }
    }

    async getVoices(req, res) {
        try {
            const voices = await PiperService.getVoices();
            res.json(voices);
        } catch (error) {
            console.error('Piper voices error:', error);
            res.status(500).json({
                error: 'Error fetching voices: ' + error.message
            });
        }
    }

    async getAudios(req, res) {
        try {
            const audios = await PiperService.getTherapyAudios();
            res.json({ audios });
        } catch (error) {
            console.error('Piper audios error:', error);
            res.status(500).json({
                error: 'Error fetching audios: ' + error.message
            });
        }
    }

    async getAudio(req, res) {
        try {
            const { filename } = req.params;
            const piperDir = path.join(__dirname, '../../../recordings/piper');
            const filepath = path.join(piperDir, filename);

            if (!fs.existsSync(filepath)) {
                return res.status(404).json({ error: 'Audio not found' });
            }

            res.setHeader('Content-Type', 'audio/wav');
            res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            fs.createReadStream(filepath).pipe(res);
        } catch (error) {
            console.error('Piper audio error:', error);
            res.status(500).json({
                error: 'Error fetching audio: ' + error.message
            });
        }
    }

    async deleteAudio(req, res) {
        try {
            const { filename } = req.params;
            const piperDir = path.join(__dirname, '../../../recordings/piper');
            const filepath = path.join(piperDir, filename);

            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }

            res.json({ success: true });
        } catch (error) {
            console.error('Piper delete error:', error);
            res.status(500).json({
                error: 'Error deleting audio: ' + error.message
            });
        }
    }
}

module.exports = new PiperController();

