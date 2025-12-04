const db = require('../models');

class NoteAutoSaveController {
    async autoSave(req, res) {
        try {
            const { rawText, correctedText } = req.body;

            if (!rawText && !correctedText) {
                return res.status(400).json({ error: 'Brak tekstu do zapisania' });
            }

            // Find last autosave note
            const lastNote = await db.Note.findOne({
                where: { type: 'autosave' },
                order: [['createdAt', 'DESC']]
            });

            // Update if last autosave was less than 1 minute ago
            if (lastNote && lastNote.createdAt > new Date(Date.now() - 60000)) {
                await lastNote.update({
                    rawText: rawText || lastNote.rawText,
                    transformedText: correctedText || lastNote.transformedText
                });

                return res.json({
                    success: true,
                    message: 'Autosave zaktualizowany',
                    noteId: lastNote.id
                });
            }

            // Create new autosave note
            const note = await db.Note.create({
                rawText: rawText || '',
                transformedText: correctedText || '',
                type: 'autosave',
                customInstruction: null
            });

            res.json({
                success: true,
                message: 'Autosave zapisany',
                noteId: note.id
            });

        } catch (error) {
            console.error('AutoSave error:', error);
            res.status(500).json({
                error: 'Błąd zapisu: ' + error.message
            });
        }
    }
}

module.exports = new NoteAutoSaveController();

