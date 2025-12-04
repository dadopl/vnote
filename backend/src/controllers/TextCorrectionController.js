const ClaudeService = require('../services/ClaudeService');
const db = require('../models');

class TextCorrectionController {
    async correct(req, res) {
        try {
            const { text, type = 'default', customInstruction = '' } = req.body;

            if (!text || !text.trim()) {
                return res.status(400).json({ error: 'Brak tekstu do korekty' });
            }

            const apiKey = process.env.CLAUDE_API_KEY;
            if (!apiKey) {
                return res.status(500).json({
                    error: 'Brak klucza API. Ustaw CLAUDE_API_KEY w pliku .env'
                });
            }

            // Correct text using Claude service
            const correctedText = await ClaudeService.correctText(text, type, customInstruction);

            // Save to database
            try {
                await db.Note.create({
                    rawText: text,
                    transformedText: correctedText,
                    type: type,
                    customInstruction: type === 'custom' ? customInstruction : null
                });
                console.log('Note saved to database');
            } catch (dbError) {
                console.error('Database save error:', dbError);
            }

            res.json({
                correctedText,
                originalLength: text.length,
                correctedLength: correctedText.length
            });

        } catch (error) {
            console.error('Text correction error:', error);
            res.status(500).json({
                error: 'Błąd serwera: ' + error.message
            });
        }
    }
}

module.exports = new TextCorrectionController();

