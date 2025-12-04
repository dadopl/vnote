class HealthController {
    async check(req, res) {
        try {
            const hasApiKey = !!process.env.CLAUDE_API_KEY;
            const whisperAvailable = !!process.env.WHISPER_URL;

            res.json({
                status: 'ok',
                hasApiKey,
                whisperAvailable,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Health check error:', error);
            res.status(500).json({ error: 'Health check failed' });
        }
    }
}

module.exports = new HealthController();

