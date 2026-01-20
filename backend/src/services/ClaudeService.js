const i18n = require('../config/i18n');

class ClaudeService {
    constructor() {
        this.apiKey = process.env.CLAUDE_API_KEY;
        this.model = 'claude-sonnet-4-20250514';
    }

    async correctText(text, type = 'default', customInstruction = '', conversationHistory = [], language = 'en') {
        const lang = i18n.getLanguage(language);

        if (type === 'sesja') {
            return this.handleTherapySession(text, conversationHistory, lang);
        }

        const userPrompt = i18n.getPrompt(type, text, lang, customInstruction);

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.model,
                max_tokens: 4096,
                messages: [{
                    role: 'user',
                    content: userPrompt
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Claude API Error:', error);
            throw new Error(error.error?.message || 'Claude API Error');
        }

        const data = await response.json();
        return data.content[0].text;
    }

    async handleTherapySession(currentText, conversationHistory, language) {
        const therapyConfig = i18n.getTherapyConfig(language);

        const messages = [];

        if (conversationHistory && conversationHistory.length > 0) {
            for (const exchange of conversationHistory) {
                messages.push({
                    role: 'user',
                    content: exchange.client
                });
                messages.push({
                    role: 'assistant',
                    content: exchange.therapist
                });
            }
        }

        messages.push({
            role: 'user',
            content: currentText
        });

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.model,
                max_tokens: 4096,
                system: therapyConfig.systemPrompt,
                messages: messages
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Claude API Error:', error);
            throw new Error(error.error?.message || 'Claude API Error');
        }

        const data = await response.json();
        return data.content[0].text;
    }
}

module.exports = new ClaudeService();
