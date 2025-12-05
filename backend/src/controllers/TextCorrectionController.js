const ClaudeService = require('../services/ClaudeService');
const db = require('../models');
const i18n = require('../config/i18n');

class TextCorrectionController {
    async correct(req, res) {
        try {
            const {
                text,
                type = 'default',
                customInstruction = '',
                conversationHistory = [],
                language = 'en'
            } = req.body;

            const lang = i18n.getLanguage(language);

            if (!text || !text.trim()) {
                return res.status(400).json({ error: i18n.getErrorMessage('noText', lang) });
            }

            const apiKey = process.env.CLAUDE_API_KEY;
            if (!apiKey) {
                return res.status(500).json({
                    error: i18n.getErrorMessage('noApiKey', lang)
                });
            }

            // Correct text using Claude service with conversation history and language
            const correctedText = await ClaudeService.correctText(
                text,
                type,
                customInstruction,
                conversationHistory,
                lang
            );

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
            const lang = i18n.getLanguage(req.body?.language);
            res.status(500).json({
                error: i18n.getErrorMessage('serverError', lang) + error.message
            });
        }
    }
}

module.exports = new TextCorrectionController();
