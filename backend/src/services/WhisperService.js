
const FormData = require('form-data');
const axios = require('axios');

class WhisperService {
    constructor() {
        this.whisperUrl = process.env.WHISPER_URL || 'http://whisper:9000';
    }

    async transcribe(file) {
        const formData = new FormData();
        formData.append('audio_file', file.buffer, {
            filename: 'audio.webm',
            contentType: file.mimetype
        });

        formData.append('task', 'transcribe');
        formData.append('language', 'pl');
        formData.append('output', 'json');

        const response = await axios.post(
            `${this.whisperUrl}/asr`,
            formData,
            {
                headers: formData.getHeaders(),
                timeout: 120000,
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        return {
            text: response.data.text || '',
            language: response.data.language || 'pl'
        };
    }
}

module.exports = new WhisperService();

