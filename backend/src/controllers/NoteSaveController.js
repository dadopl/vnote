const db = require('../models');

class NoteSaveController {
    async save(req, res) {
        try {
            const { id, rawText, correctedText, type = 'default' } = req.body;

            console.log('NoteSaveController.save - id:', id, 'type:', type);

            if (!rawText && !correctedText) {
                return res.status(400).json({ error: 'Brak tekstu do zapisania' });
            }

            let note;

            if (id) {
                // Update existing note
                note = await db.Note.findByPk(id);
                if (!note) {
                    return res.status(404).json({ error: 'Notatka nie znaleziona' });
                }

                await note.update({
                    rawText: rawText || note.rawText,
                    transformedText: correctedText || note.transformedText,
                    type: type || note.type
                });
            } else {
                // Create new note
                note = await db.Note.create({
                    rawText: rawText || '',
                    transformedText: correctedText || null,
                    type: type || 'default',
                    customInstruction: null
                });
            }

            res.json({
                success: true,
                noteId: note.id,
                note: {
                    id: note.id,
                    rawText: note.rawText,
                    transformedText: note.transformedText,
                    type: note.type,
                    createdAt: note.createdAt,
                    updatedAt: note.updatedAt
                }
            });

        } catch (error) {
            console.error('Note save error:', error);
            res.status(500).json({
                error: 'Błąd zapisu: ' + error.message
            });
        }
    }
}

module.exports = new NoteSaveController();

