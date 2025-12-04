require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./models');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 7776;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Mount API routes
app.use(routes);

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Database sync and server start
const startServer = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Database connection established');

        app.listen(PORT, () => {
            console.log(`🎤 Voice Notes App działa na http://localhost:${PORT}`);
            console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
            console.log(`🔑 Claude API Key: ${process.env.CLAUDE_API_KEY ? '✅ Ustawiony' : '❌ Brak'}`);
            console.log(`🤖 Whisper URL: ${process.env.WHISPER_URL || 'http://whisper:9000'}`);
            console.log(`🎙️ ElevenLabs API Key: ${process.env.ELEVEN_LABS_API_KEY ? '✅ Ustawiony' : '❌ Brak'}`);
        });
    } catch (error) {
        console.error('❌ Unable to start server:', error);
        process.exit(1);
    }
};

startServer();

