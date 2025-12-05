const { ElevenLabsClient } = require('elevenlabs');
const fs = require('fs');
const path = require('path');
const db = require('../models');
const i18n = require('../config/i18n');

class TtsService {
    constructor() {
        this.client = new ElevenLabsClient({
            apiKey: process.env.ELEVEN_LABS_API_KEY
        });
        this.diaryDir = path.join(__dirname, '../../../recordings/diary');
        this.voicesCache = { en: null, pl: null };
        this.voicesCacheTime = { en: 0, pl: 0 };
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes

        this.ensureDirectoryExists();
    }

    ensureDirectoryExists() {
        if (!fs.existsSync(this.diaryDir)) {
            fs.mkdirSync(this.diaryDir, { recursive: true });
        }
    }

    async getVoices(language = 'en') {
        const lang = i18n.getLanguage(language);

        // Return cached voices if available
        if (this.voicesCache[lang] && (Date.now() - this.voicesCacheTime[lang] < this.cacheTimeout)) {
            return this.voicesCache[lang];
        }

        // Fetch voices from ElevenLabs filtered by language
        const voicesResponse = await this.client.voices.getShared({
            language: lang,
            page_size: 100
        });

        const allVoices = voicesResponse.voices || [];

        // Filter and map voices
        const mappedVoices = allVoices
            .map(voice => ({
                voice_id: voice.voice_id,
                name: voice.name,
                labels: voice.labels,
                preview_url: voice.preview_url
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        // Update cache for this language
        this.voicesCache[lang] = mappedVoices;
        this.voicesCacheTime[lang] = Date.now();

        return mappedVoices;
    }

    async generateAudio(text, voiceId, noteId, voiceSettings = {}, language = 'en') {
        const lang = i18n.getLanguage(language);

        if (!noteId) {
            throw new Error(i18n.getErrorMessage('noteIdRequired', lang));
        }

        if (text.length > 2000) {
            throw new Error(i18n.getErrorMessage('textTooLong', lang, text.length));
        }

        const timestamp = Date.now();
        const filename = `tts_${timestamp}.mp3`;
        const filepath = path.join(this.diaryDir, filename);

        // Generate audio using ElevenLabs SDK with dynamic language code
        const audioStream = await this.client.textToSpeech.convert(voiceId, {
            text: text,
            model_id: 'eleven_flash_v2_5',
            output_format: 'mp3_44100_128',
            language_code: i18n.getElevenLabsLanguageCode(lang),
            voice_settings: {
                stability: voiceSettings.stability !== undefined ? voiceSettings.stability : 0,
                similarity_boost: voiceSettings.similarity_boost !== undefined ? voiceSettings.similarity_boost : 0.75,
                style: voiceSettings.style !== undefined ? voiceSettings.style : 0.5,
                use_speaker_boost: true
            }
        });

        // Save to file - audioStream is already a Node.js readable stream
        const writeStream = fs.createWriteStream(filepath);
        await new Promise((resolve, reject) => {
            audioStream.pipe(writeStream);
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        const fileSize = fs.statSync(filepath).size;

        // Get voice name - pass language to getVoices
        const voices = await this.getVoices(lang);
        const voice = voices.find(v => v.voice_id === voiceId);
        const voiceName = voice ? voice.name : 'Unknown';

        // Save to database with provided noteId
        const ttsGeneration = await db.TtsGeneration.create({
            noteId: noteId,
            audioPath: filepath,
            voiceId: voiceId,
            voiceName: voiceName,
            modelId: 'eleven_flash_v2_5',
            textLength: text.length
        });

        // Save metadata JSON
        const metadataPath = `${filepath}.json`;
        fs.writeFileSync(metadataPath, JSON.stringify({
            id: ttsGeneration.id,
            filename: filename,
            text: text,
            voice_id: voiceId,
            voice_name: voiceName,
            size: fileSize,
            timestamp: timestamp,
            date: new Date().toISOString()
        }, null, 2));

        return {
            id: ttsGeneration.id,
            filename: filename,
            voice_name: voiceName,
            size: fileSize,
            date: ttsGeneration.createdAt
        };
    }

    async getDiaryAudios() {
        const audios = await db.TtsGeneration.findAll({
            include: [{
                model: db.Note,
                as: 'note',
                attributes: ['rawText']
            }],
            order: [['createdAt', 'DESC']]
        });

        return audios.map(a => {
            const filename = path.basename(a.audioPath);
            const text = a.note ? a.note.rawText : '';
            const textPreview = text.length > 100 ? text.substring(0, 100) + '...' : text;

            return {
                id: a.id,
                filename: filename,
                text: textPreview,
                voice_name: a.voiceName,
                textLength: a.textLength,
                date: a.createdAt
            };
        });
    }

    async getDiaryAudio(audioId, language = 'en') {
        const lang = i18n.getLanguage(language);
        const audio = await db.TtsGeneration.findByPk(audioId);

        if (!audio) {
            throw new Error(i18n.getErrorMessage('audioNotFound', lang));
        }

        const filepath = audio.audioPath;

        if (!fs.existsSync(filepath)) {
            throw new Error(i18n.getErrorMessage('fileNotFound', lang));
        }

        return fs.createReadStream(filepath);
    }

    async deleteDiaryAudio(audioId, language = 'en') {
        const lang = i18n.getLanguage(language);
        const audio = await db.TtsGeneration.findByPk(audioId);

        if (!audio) {
            throw new Error(i18n.getErrorMessage('audioNotFound', lang));
        }

        const filepath = audio.audioPath;
        const metadataPath = `${filepath}.json`;

        // Delete files
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
        if (fs.existsSync(metadataPath)) {
            fs.unlinkSync(metadataPath);
        }

        // Delete from database
        await audio.destroy();
    }
}

module.exports = new TtsService();

