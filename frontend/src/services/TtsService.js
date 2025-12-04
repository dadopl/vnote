// TTS Service - wrapper around ApiService for TTS operations
// This service uses the apiService instance from App.vue

const TtsService = {
    apiService: null,

    init(apiService) {
        this.apiService = apiService;
    },

    /**
     * Get available voices from ElevenLabs
     */
    async getVoices() {
        if (!this.apiService) throw new Error('ApiService not initialized');
        try {
            const response = await this.apiService.getVoices();
            return response.voices || [];
        } catch (error) {
            console.error('Error fetching voices:', error);
            throw error;
        }
    },

    /**
     * Generate audio from text
     */
    async generateAudio(text, voiceId) {
        if (!this.apiService) throw new Error('ApiService not initialized');

        if (!text || !text.trim()) {
            throw new Error('Brak tekstu do wygenerowania');
        }

        if (text.length > 2000) {
            throw new Error(`Tekst jest za długi (${text.length}/2000 znaków). Skróć tekst.`);
        }

        if (!voiceId) {
            throw new Error('Nie wybrano głosu');
        }

        try {
            return await this.apiService.generateAudio(text, voiceId);
        } catch (error) {
            console.error('Error generating audio:', error);
            throw error;
        }
    },

    /**
     * Get all generated audio files from diary
     */
    async getDiaryAudios() {
        if (!this.apiService) throw new Error('ApiService not initialized');
        try {
            const response = await this.apiService.getDiaryAudios();
            return response.audios || [];
        } catch (error) {
            console.error('Error fetching diary audios:', error);
            throw error;
        }
    },

    /**
     * Get audio stream URL
     */
    getAudioUrl(audioId) {
        if (!this.apiService) throw new Error('ApiService not initialized');
        return this.apiService.getDiaryAudioUrl(audioId);
    },

    /**
     * Download audio file
     */
    downloadAudio(audio) {
        const url = this.getAudioUrl(audio.id);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tts_${audio.id}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Delete audio file
     */
    async deleteAudio(audioId) {
        if (!this.apiService) throw new Error('ApiService not initialized');
        try {
            return await this.apiService.deleteDiaryAudio(audioId);
        } catch (error) {
            console.error('Error deleting audio:', error);
            throw error;
        }
    }
};

export default TtsService;
