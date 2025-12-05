# Voice Notes App - AI-Powered Voice Notepad

Speech-to-text application with automatic AI correction by Claude. Supports both Web Speech API (instant) and Whisper AI (more accurate, local).

## Features

### Voice Transcription
- **Web Speech API** - fast browser-based transcription (Chrome/Edge)
- **Whisper AI** - more accurate transcription via OpenAI Whisper (locally in Docker)
- Audio device selection (microphone)
- Real-time audio visualization
  - Volume level (progress bar)
  - Equalizer (7 frequencies)
  - Color coding based on level (green/yellow/red)

### AI Correction (Claude)
- Automatic spelling, grammar, and punctuation correction
- Preserves natural spoken style
- Auto-send every 50 words (configurable)
- Edit text while recording

### Multi-language Support
- **English (default)** and **Polish** interface
- Language selector in the header
- AI prompts adapt to selected language
- TTS voices filtered by selected language

### History and Management
- Session history (last 50 notes)
- Auto-save to localStorage and database
- Export to TXT file
- Database storage with MariaDB

### Audio Recording
- **Full session recording** - save entire conversation to audio file
- **Automatic server save** - recordings stored in `recordings/` directory
- **Recording management:**
  - List of all recordings with date and duration
  - Built-in HTML5 audio player
  - Download recordings in WebM format
  - Delete unwanted recordings
- **Timer and size indicator** - live during recording
- **Independent of transcription** - recording works in parallel with speech recognition

### Text-to-Speech (TTS) with ElevenLabs
- **Generate audio from text** - convert corrected text to professional voice recording
- **Premium voices** - access to ElevenLabs voice library in your language
- **Advanced voice settings:**
  - Stability (0-1) - control stability vs expression
  - Similarity (0-1) - how close to original voice
  - Style (0-1) - add more style (costs latency)
- **TTS recording management:**
  - History of generated audio
  - Built-in player
  - Download MP3 files
  - Delete unwanted recordings
- **Eleven Flash v2.5 model** - faster model with low latency
- **2000 character limit** per audio

### Therapy Session Mode
- AI acts as a professional psychotherapist
- Conversation context maintained (last 10 exchanges)
- Reflective questions and empathetic responses
- Session history with clear option

### Responsive Design
- Works on mobile and desktop
- Full screen width
- Automatic text scrolling

## Quick Start

### 1. Clone Repository
```bash
git clone <repo-url>
cd vnotes
```

### 2. API Keys Configuration

#### First-time Setup (for new developers)

1. **Copy `.env` to `.env.local`:**
```bash
cp backend/.env backend/.env.local
```

2. **Edit `backend/.env.local` and enter your API keys:**
```env
# Claude API (REQUIRED)
CLAUDE_API_KEY=sk-ant-your-actual-key-here

# ElevenLabs API (REQUIRED for TTS)
ELEVEN_LABS_API_KEY=sk_your_actual_elevenlabs_key_here

# SMTP Mailer (OPTIONAL - for email sending feature)
MAILER_DSN=smtp://user:password@smtp.example.com:587?encryption=tls

# Database settings
DB_HOST=mariadb
DB_PORT=3306
DB_NAME=vnotes
DB_USER=vnotes_user
DB_PASSWORD=vnotes_secure_pass_2024
MYSQL_ROOT_PASSWORD=root_secure_pass_2024

# Other settings
PORT=7776
WHISPER_MODEL=base
WHISPER_URL=http://whisper:9000
NODE_ENV=development
```

#### How to Get API Keys?

**Claude API:**
1. Sign up at https://console.anthropic.com/
2. Go to "API Keys"
3. Copy API key (starts with `sk-ant-`)

**ElevenLabs API:**
1. Sign up at https://elevenlabs.io/
2. Go to "Profile" → "API Keys"
3. Copy API key (starts with `sk_`)

**SMTP Mailer (optional):**
```env
# Gmail
MAILER_DSN=smtp://your-email@gmail.com:your-app-password@smtp.gmail.com:587?encryption=tls

# Custom SMTP
MAILER_DSN=smtp://username:password@smtp.yourserver.com:587?encryption=tls
```

#### ⚠️ IMPORTANT - Security

- **NEVER** commit `.env.local` file to repository!
- `.env.local` is automatically ignored by git
- `.env` contains only example values and can be committed
- Docker will automatically use `.env.local` if it exists

### 3. Generating SSL Certificates (for HTTPS)

The application uses Nginx with SSL/TLS. You can use self-signed certificates (for development) or Let's Encrypt (for production).

#### Option A: Self-signed Certificate (development)

```bash
# Create SSL directory if it doesn't exist
mkdir -p nginx/ssl

# Generate self-signed certificate (valid for 365 days)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Dev/CN=localhost"
```

**Note:** Browser will warn about untrusted certificate. This is normal for self-signed certs.

#### Option B: Let's Encrypt (production)

```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate (replace example.com with your domain)
sudo certbot certonly --standalone -d example.com -d www.example.com

# Copy certificates to project
sudo cp /etc/letsencrypt/live/example.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/example.com/privkey.pem nginx/ssl/key.pem

# Set appropriate permissions
sudo chmod 644 nginx/ssl/cert.pem
sudo chmod 600 nginx/ssl/key.pem
```

#### Option C: Without SSL (HTTP only)

If you don't need HTTPS, you can disable SSL in `docker-compose.yml`:

```yaml
# In nginx section, remove port 443 and keep only 80
ports:
  - "80:80"
  # - "443:443"  # Comment this line
```

And in `nginx/nginx.conf` comment out the `server` section for port 443.

### 4. Run with Makefile (recommended)

The project includes a `Makefile` for convenient container management:

```bash
# Build and start all containers
make setup

# Stop all containers
make stop

# Restart all containers
make restart

# Show logs (follow mode)
make logs

# Stop and remove volumes (clean slate)
make clean

# Force rebuild without cache
make rebuild

# Show all available commands
make help
```

### 5. Or Run with Docker Compose directly
```bash
docker-compose up --build
```

**Available Services:**
- Main application: 
  - **HTTPS:** https://localhost (default, requires SSL certificates)
  - **HTTP:** http://localhost (fallback)
- Backend API: http://localhost:7776 (direct access)
- phpMyAdmin: http://localhost:7778 (database management)
- Whisper AI: http://localhost:9102 (transcription service)

**First Run:**
- May take several minutes (building containers + downloading Whisper model)
- If using self-signed certs, browser will display warning (click "Advanced" → "Proceed")
- Database will be automatically created
- Migrations will be automatically executed

## Docker

### Build and Run
```bash
# Run everything (Voice Notes + Whisper)
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Services
- **voice-notes-app** - main application (frontend + backend)
- **whisper-service** - Whisper AI transcription service
- **vnotes-mariadb** - MariaDB database
- **vnotes-phpmyadmin** - phpMyAdmin for database management
- **vnotes-nginx** - Nginx reverse proxy with SSL

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Nginx (SSL)                         │
│                   Port 80/443                            │
└─────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           ▼                               ▼
┌─────────────────────┐        ┌─────────────────────┐
│   Frontend (Vue)    │        │   Backend (Node)    │
│    Static Files     │        │    Port 7776        │
└─────────────────────┘        └─────────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
           ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
           │   MariaDB    │    │   Whisper    │    │  ElevenLabs  │
           │  Port 3306   │    │  Port 9000   │    │     API      │
           └──────────────┘    └──────────────┘    └──────────────┘
```

## API Endpoints

### Health Check
- `GET /api/health` - server status

### Text Correction
- `POST /api/correct` - correct text with AI (supports `language` parameter)

### Transcription
- `POST /api/transcribe` - transcribe audio with Whisper

### Recordings
- `GET /api/recordings` - list recordings
- `POST /api/recordings/save` - save recording
- `GET /api/recordings/:id` - get recording
- `DELETE /api/recordings/:id` - delete recording

### Notes
- `GET /api/notes` - list notes with pagination
- `GET /api/notes/:id` - get note
- `POST /api/notes/save` - save note
- `DELETE /api/notes/:id` - delete note

### TTS
- `GET /api/tts/voices?language=en` - get available voices (filtered by language)
- `POST /api/tts/generate` - generate audio from text
- `GET /api/tts/diary` - list generated audio
- `GET /api/tts/diary/:id` - get audio file
- `DELETE /api/tts/diary/:id` - delete audio

### Email
- `POST /api/send-email` - send email with text

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend port | 7776 |
| `CLAUDE_API_KEY` | Claude API key | - |
| `ELEVEN_LABS_API_KEY` | ElevenLabs API key | - |
| `WHISPER_MODEL` | Whisper model (tiny/base/small/medium/large) | base |
| `WHISPER_URL` | Whisper service URL | http://whisper:9000 |
| `DB_HOST` | Database host | mariadb |
| `DB_PORT` | Database port | 3306 |
| `DB_NAME` | Database name | vnotes |
| `DB_USER` | Database user | vnotes_user |
| `DB_PASSWORD` | Database password | - |
| `MYSQL_ROOT_PASSWORD` | MySQL root password | - |
| `MAILER_DSN` | SMTP configuration | - |

## Troubleshooting

### No sound/microphone
- Allow microphone access in browser
- Check if correct device is selected
- Try a different browser (Chrome/Edge recommended)

### Whisper not working
- Check if whisper-service container is running: `docker-compose ps`
- Check logs: `docker-compose logs whisper-service`
- First run may take time (downloading model)

### TTS not working
- Check if `ELEVEN_LABS_API_KEY` is set in `.env.local`
- Check ElevenLabs account quota
- Try selecting a different voice

### Database connection issues
- Ensure MariaDB container is running
- Check database credentials in `.env.local`
- Wait for database to initialize on first run

### SSL Certificate errors
- For development, use self-signed certificates
- Click "Advanced" → "Proceed to localhost" in browser
- Or disable SSL (see Option C above)

## License

MIT

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

