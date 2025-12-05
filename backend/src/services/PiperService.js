const fs = require('fs');
const path = require('path');
const axios = require('axios');

class PiperService {
    constructor() {
        this.piperUrl = process.env.PIPER_URL || 'http://piper:5000';
        this.outputDir = path.join(__dirname, '../../../recordings/piper');
        this.ensureDirectoryExists();
    }

    ensureDirectoryExists() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    async generateTherapyAudio(text, voice = 'pl_PL-gosia-medium') {
        if (!text || !text.trim()) {
            throw new Error('Text is required');
        }

        const response = await axios.post(`${this.piperUrl}/synthesize`, {
            text: text,
            voice: voice
        }, {
            timeout: 60000
        });

        if (!response.data.success) {
            throw new Error(response.data.error || 'Piper synthesis failed');
        }

        return response.data.audio;
    }

    async getVoices() {
        const response = await axios.get(`${this.piperUrl}/voices`, {
            timeout: 5000
        });
        return response.data;
    }

    async getTherapyAudios() {
        const response = await axios.get(`${this.piperUrl}/audios`, {
            timeout: 5000
        });
        return response.data.audios || [];
    }

    getAudioUrl(filename) {
        return `${this.piperUrl}/audio/${filename}`;
    }

    async deleteTherapyAudio(filename) {
        const response = await axios.delete(`${this.piperUrl}/audio/${filename}`, {
            timeout: 5000
        });
        return response.data;
    }
}

module.exports = new PiperService();

