// API Service - zarządza wywołaniami API
export class ApiService {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    async checkHealth() {
        const response = await fetch(`${this.baseUrl}/api/health`, {
            signal: AbortSignal.timeout(2000)
        });
        return response.json();
    }

    async correctText(requestData) {
        const { text, type = 'default', customInstruction = '', conversationHistory = [], language = 'en' } = requestData;

        const response = await fetch(`${this.baseUrl}/api/correct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                type,
                customInstruction,
                conversationHistory,
                language
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }

        return response.json();
    }

    async transcribe(audioBlob) {
        const formData = new FormData();
        formData.append('audio', audioBlob);

        const response = await fetch(`${this.baseUrl}/api/transcribe`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Whisper transcription failed');
        }

        return response.json();
    }

    async saveRecording(audioBlob, name, duration, noteId) {
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('name', name);
        formData.append('duration', duration);
        formData.append('noteId', noteId);

        const response = await fetch(`${this.baseUrl}/api/recordings/save`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Nie udało się zapisać nagrania');
        }

        return response.json();
    }

    async getRecordings() {
        const response = await fetch(`${this.baseUrl}/api/recordings`);
        if (response.ok) {
            return response.json();
        }
        return { recordings: [] };
    }

    async deleteRecording(id) {
        const response = await fetch(`${this.baseUrl}/api/recordings/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Nie udało się usunąć nagrania');
        }

        return response.json();
    }

    async getRecordingBlob(id) {
        const response = await fetch(`${this.baseUrl}/api/recordings/${id}`);
        if (!response.ok) {
            throw new Error('Nie udało się pobrać nagrania');
        }
        return response.blob();
    }

    async sendEmail(recipient, textType, text, subject) {
        const response = await fetch(`${this.baseUrl}/api/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipient,
                textType,
                text,
                subject: subject || undefined
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Błąd wysyłania emaila');
        }

        return response.json();
    }

    // TTS methods
    async getVoices(language = 'en') {
        const response = await fetch(`${this.baseUrl}/api/tts/voices?language=${language}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error fetching voices');
        }
        return response.json();
    }

    async generateAudio(text, voiceId, noteId, voiceSettings = {}, language = 'en') {
        const response = await fetch(`${this.baseUrl}/api/tts/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, voiceId, noteId, voiceSettings, language })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error generating audio');
        }

        return response.json();
    }

    async getDiaryAudios() {
        const response = await fetch(`${this.baseUrl}/api/tts/diary`);
        if (response.ok) {
            return response.json();
        }
        return { audios: [] };
    }

    getDiaryAudioUrl(audioId) {
        return `${this.baseUrl}/api/tts/diary/${audioId}`;
    }

    async deleteDiaryAudio(audioId) {
        const response = await fetch(`${this.baseUrl}/api/tts/diary/${audioId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Nie udało się usunąć audio');
        }

        return response.json();
    }

    // AutoSave method
    async autoSave(rawText, correctedText) {
        const response = await fetch(`${this.baseUrl}/api/notes/autosave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rawText, correctedText })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Błąd autosave');
        }

        return response.json();
    }

    // Save/update note method
    async saveNote(id, rawText, correctedText, type = 'default') {
        const response = await fetch(`${this.baseUrl}/api/notes/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, rawText, correctedText, type })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Błąd zapisu notatki');
        }

        return response.json();
    }

    // Notes list methods
    async getNotes(page = 1, limit = 20) {
        const response = await fetch(`${this.baseUrl}/api/notes?page=${page}&limit=${limit}`);

        if (!response.ok) {
            throw new Error('Nie udało się pobrać listy notatek');
        }

        return response.json();
    }

    async getNote(id) {
        const response = await fetch(`${this.baseUrl}/api/notes/${id}`);

        if (!response.ok) {
            throw new Error('Nie udało się pobrać notatki');
        }

        return response.json();
    }

    async deleteNote(id) {
        const response = await fetch(`${this.baseUrl}/api/notes/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Nie udało się usunąć notatki');
        }

        return response.json();
    }

    // Piper TTS methods (therapy sessions)
    getPiperAudioUrl(filename) {
        return `${this.baseUrl}/api/piper/audio/${filename}`;
    }

    async generatePiperAudio(text, voice) {
        const response = await fetch(`${this.baseUrl}/api/piper/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, voice })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }

        const data = await response.json();
        return data.audio;
    }

    async deletePiperAudio(filename) {
        const response = await fetch(`${this.baseUrl}/api/piper/audio/${filename}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete therapy audio');
        }

        return response.json();
    }

    async getPiperAudios() {
        const response = await fetch(`${this.baseUrl}/api/piper/audios`);

        if (!response.ok) {
            throw new Error('Failed to fetch therapy audios');
        }

        return response.json();
    }
}
