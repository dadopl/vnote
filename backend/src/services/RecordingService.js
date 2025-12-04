const fs = require('fs');
const path = require('path');
const db = require('../models');

class RecordingService {
    constructor() {
        this.recordingsDir = path.join(__dirname, '../../../recordings');
        this.ensureDirectoryExists();
    }

    ensureDirectoryExists() {
        if (!fs.existsSync(this.recordingsDir)) {
            fs.mkdirSync(this.recordingsDir, { recursive: true });
        }
    }

    async saveRecording(file, name, duration, noteId) {
        if (!noteId) {
            throw new Error('noteId jest wymagany');
        }

        const timestamp = Date.now();
        const filename = `recording_${timestamp}.webm`;
        const filepath = path.join(this.recordingsDir, filename);

        // Save file to disk
        fs.writeFileSync(filepath, file.buffer);

        // Save metadata to database with provided noteId
        const recording = await db.Recording.create({
            noteId: noteId,
            originalAudioPath: filepath,
            name: name || `Nagranie ${new Date().toLocaleString('pl-PL')}`,
            duration: parseFloat(duration) || 0
        });

        // Save metadata JSON
        const metadataPath = `${filepath}.json`;
        fs.writeFileSync(metadataPath, JSON.stringify({
            id: recording.id,
            noteId: noteId,
            filename: filename,
            name: recording.name,
            duration: recording.duration,
            path: recording.originalAudioPath,
            timestamp: timestamp,
            date: new Date().toISOString()
        }, null, 2));

        return recording;
    }

    async getRecordings() {
        const recordings = await db.Recording.findAll({
            order: [['createdAt', 'DESC']]
        });

        return recordings.map(r => ({
            id: r.id,
            filename: path.basename(r.originalAudioPath),
            name: r.name,
            duration: r.duration,
            date: r.createdAt
        }));
    }

    async getRecording(id) {
        const recording = await db.Recording.findByPk(id);

        if (!recording) {
            throw new Error('Nagranie nie znalezione');
        }

        const filepath = recording.originalAudioPath;

        if (!fs.existsSync(filepath)) {
            throw new Error('Plik nagrania nie istnieje');
        }

        return fs.createReadStream(filepath);
    }

    async deleteRecording(id) {
        const recording = await db.Recording.findByPk(id);

        if (!recording) {
            throw new Error('Nagranie nie znalezione');
        }

        const filepath = recording.originalAudioPath;
        const metadataPath = `${filepath}.json`;

        // Delete files
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
        if (fs.existsSync(metadataPath)) {
            fs.unlinkSync(metadataPath);
        }

        // Delete from database
        await recording.destroy();
    }
}

module.exports = new RecordingService();

