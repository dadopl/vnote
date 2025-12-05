const db = require('../models');

class NoteListController {
    async getList(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const offset = (page - 1) * limit;

            const { count, rows: notes } = await db.Note.findAndCountAll({
                order: [['createdAt', 'DESC']],
                limit: limit,
                offset: offset,
                attributes: ['id', 'rawText', 'transformedText', 'type', 'createdAt', 'updatedAt']
            });

            const totalPages = Math.ceil(count / limit);

            res.json({
                notes: notes.map(note => ({
                    id: note.id,
                    rawText: note.rawText ? note.rawText.substring(0, 200) + (note.rawText.length > 200 ? '...' : '') : '',
                    transformedText: note.transformedText ? note.transformedText.substring(0, 200) + (note.transformedText.length > 200 ? '...' : '') : '',
                    type: note.type,
                    wordCount: note.rawText ? note.rawText.trim().split(/\s+/).filter(w => w.length > 0).length : 0,
                    createdAt: note.createdAt,
                    updatedAt: note.updatedAt
                })),
                pagination: {
                    page: page,
                    limit: limit,
                    total: count,
                    totalPages: totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });

        } catch (error) {
            console.error('Note list error:', error);
            res.status(500).json({
                error: 'Błąd pobierania listy notatek: ' + error.message
            });
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;

            const note = await db.Note.findByPk(id);

            if (!note) {
                return res.status(404).json({ error: 'Notatka nie znaleziona' });
            }

            res.json({
                note: {
                    id: note.id,
                    rawText: note.rawText,
                    transformedText: note.transformedText,
                    type: note.type,
                    customInstruction: note.customInstruction,
                    createdAt: note.createdAt,
                    updatedAt: note.updatedAt
                }
            });

        } catch (error) {
            console.error('Note get error:', error);
            res.status(500).json({
                error: 'Błąd pobierania notatki: ' + error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const fs = require('fs');

            const note = await db.Note.findByPk(id, {
                include: [
                    { model: db.Recording, as: 'recordings' },
                    { model: db.TtsGeneration, as: 'ttsGenerations' }
                ]
            });

            if (!note) {
                return res.status(404).json({ error: 'Notatka nie znaleziona' });
            }

            // Usuń fizyczne pliki audio nagrań
            if (note.recordings) {
                for (const recording of note.recordings) {
                    if (recording.originalAudioPath && fs.existsSync(recording.originalAudioPath)) {
                        fs.unlinkSync(recording.originalAudioPath);
                    }
                    const metadataPath = `${recording.originalAudioPath}.json`;
                    if (fs.existsSync(metadataPath)) {
                        fs.unlinkSync(metadataPath);
                    }
                }
            }

            // Usuń fizyczne pliki TTS
            if (note.ttsGenerations) {
                for (const tts of note.ttsGenerations) {
                    if (tts.audioPath && fs.existsSync(tts.audioPath)) {
                        fs.unlinkSync(tts.audioPath);
                    }
                    const metadataPath = `${tts.audioPath}.json`;
                    if (fs.existsSync(metadataPath)) {
                        fs.unlinkSync(metadataPath);
                    }
                }
            }

            // Usuń notatkę z bazy (CASCADE usunie powiązane rekordy)
            await note.destroy();

            res.json({
                success: true,
                message: 'Notatka została usunięta wraz z wszystkimi powiązanymi plikami'
            });

        } catch (error) {
            console.error('Note delete error:', error);
            res.status(500).json({
                error: 'Błąd usuwania notatki: ' + error.message
            });
        }
    }
}

module.exports = new NoteListController();

