# 🎤 Voice Notes App - Notatnik Głosowy z AI

Aplikacja do zamiany mowy na tekst z automatyczną korektą przez Claude AI. Obsługuje zarówno Web Speech API (natychmiastowe) jak i Whisper AI (dokładniejsze, lokalne).

## ✨ Funkcje

### 🎙️ Transkrypcja głosu
- **Web Speech API** - szybka transkrypcja w przeglądarce (Chrome/Edge)
- **Whisper AI** - dokładniejsza transkrypcja przez OpenAI Whisper (lokalnie w Dockerze)
- Wybór urządzenia audio (mikrofon)
- Wizualizacja audio w czasie rzeczywistym
  - Poziom głośności (progress bar)
  - Equalizer (7 częstotliwości)
  - Kolorowanie zależne od poziomu (zielony/żółty/czerwony)

### 🤖 Korekcja AI (Claude)
- Automatyczna korekcja ortografii, gramatyki i interpunkcji
- Zachowanie naturalnego stylu mówionego
- Auto-wysyłka co 50 słów (konfigurowalne)
- Możliwość edycji tekstu w trakcie nagrywania

### 💾 Historia i zarządzanie
- Historia sesji (ostatnie 50 notatek)
- Auto-zapis do localStorage
- Eksport do pliku TXT
- Dark/Light theme

### 🎙️ Nagrywanie audio
- **Pełne nagrywanie sesji** - zapisz całą rozmowę do pliku audio
- **Automatyczny zapis na serwerze** - nagrania przechowywane w katalogu `recordings/`
- **Zarządzanie nagraniami:**
  - Lista wszystkich nagrań z datą i czasem trwania
  - Odtwarzacz HTML5 audio wbudowany w panel
  - Pobieranie nagrań w formacie WebM
  - Usuwanie niepotrzebnych nagrań
- **Timer i wskaźnik rozmiaru** - na żywo podczas nagrywania
- **Niezależne od transkrypcji** - nagrywanie działa równolegle z rozpoznawaniem mowy

### 🔊 Text-to-Speech (TTS) z ElevenLabs
- **Generowanie audio z tekstu** - zamień poprawiony tekst na profesjonalne nagranie głosowe
- **Polskie głosy premium** - dostęp do biblioteki polskich lektorów ElevenLabs
- **Zaawansowane ustawienia głosu:**
  - Stabilność (0-1) - kontroluj stabilność vs ekspresję głosu
  - Podobieństwo (0-1) - jak blisko oryginalnego głosu
  - Styl (0-1) - dodaj więcej stylu (kosztuje latencję)
- **Zarządzanie nagraniami TTS:**
  - Historia wygenerowanych audio
  - Odtwarzacz wbudowany
  - Pobieranie plików MP3
  - Usuwanie niepotrzebnych nagrań
- **Model Eleven Flash v2.5** - szybszy model z niską latencją
- **Limit 2000 znaków** na jedno audio

### 📱 Responsywny design
- Działa na mobile i desktop
- Pełna szerokość ekranu
- Automatyczne przewijanie tekstu

## 🚀 Szybki start

### 1. Klonowanie repozytorium
```bash
git clone <repo-url>
cd vnotes
```

### 2. Konfiguracja kluczy API

#### Pierwsza konfiguracja (dla nowych deweloperów)

1. **Skopiuj plik `.env` do `.env.local`:**
```bash
cp backend/.env backend/.env.local
```

2. **Edytuj `backend/.env.local` i wpisz swoje klucze API:**
```env
# Claude API (WYMAGANE)
CLAUDE_API_KEY=sk-ant-your-actual-key-here

# ElevenLabs API (WYMAGANE dla TTS)
ELEVEN_LABS_API_KEY=sk_your_actual_elevenlabs_key_here

# SMTP Mailer (OPCJONALNE - dla funkcji wysyłania email)
MAILER_DSN=smtp://user:password@smtp.example.com:587?encryption=tls

# Pozostałe ustawienia
PORT=7776
WHISPER_MODEL=base
WHISPER_URL=http://whisper:9000
NODE_ENV=development
```

#### Jak uzyskać klucze API?

**Claude API:**
1. Zarejestruj się na https://console.anthropic.com/
2. Przejdź do "API Keys"
3. Skopiuj klucz API (rozpoczyna się od `sk-ant-`)

**ElevenLabs API:**
1. Zarejestruj się na https://elevenlabs.io/
2. Przejdź do "Profile" → "API Keys"
3. Skopiuj klucz API (rozpoczyna się od `sk_`)

**SMTP Mailer (opcjonalnie):**
```env
# Gmail
MAILER_DSN=smtp://your-email@gmail.com:your-app-password@smtp.gmail.com:587?encryption=tls

# Własny SMTP
MAILER_DSN=smtp://username:password@smtp.yourserver.com:587?encryption=tls
```

#### ⚠️ WAŻNE - Bezpieczeństwo

- **NIGDY** nie commituj pliku `.env.local` do repozytorium!
- Plik `.env.local` jest automatycznie ignorowany przez git
- Plik `.env` zawiera tylko przykładowe wartości i może być commitowany
- Docker automatycznie użyje `.env.local` jeśli istnieje

### 3. Generowanie certyfikatów SSL (dla HTTPS)

Aplikacja używa Nginx z SSL/TLS. Możesz użyć self-signed certyfikatów (dla rozwoju) lub Let's Encrypt (dla produkcji).

#### Opcja A: Self-signed certyfikat (development)

```bash
# Utwórz katalog SSL jeśli nie istnieje
mkdir -p nginx/ssl

# Wygeneruj self-signed certyfikat (ważny 365 dni)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=PL/ST=Warsaw/L=Warsaw/O=Dev/CN=localhost"
```

**Uwaga:** Przeglądarka będzie ostrzegać o niezaufanym certyfikacie. To normalne dla self-signed certów.

#### Opcja B: Let's Encrypt (produkcja)

```bash
# Zainstaluj certbot
sudo apt-get install certbot

# Wygeneruj certyfikat (zamień example.com na swoją domenę)
sudo certbot certonly --standalone -d example.com -d www.example.com

# Skopiuj certyfikaty do projektu
sudo cp /etc/letsencrypt/live/example.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/example.com/privkey.pem nginx/ssl/key.pem

# Nadaj odpowiednie uprawnienia
sudo chmod 644 nginx/ssl/cert.pem
sudo chmod 600 nginx/ssl/key.pem
```

#### Opcja C: Bez SSL (tylko HTTP)

Jeśli nie potrzebujesz HTTPS, możesz wyłączyć SSL w `docker-compose.yml`:

```yaml
# W sekcji nginx, usuń port 443 i zostaw tylko 80
ports:
  - "80:80"
  # - "443:443"  # Zakomentuj tę linię
```

I w `nginx/nginx.conf` zakomentuj sekcję `server` dla portu 443.

### 4. Uruchomienie z Docker Compose (zalecane)
```bash
docker-compose up --build
```

**Dostępne serwisy:**
- Aplikacja główna: 
  - **HTTPS:** https://localhost (domyślnie, wymaga certyfikatów SSL)
  - **HTTP:** http://localhost (fallback)
- Backend API: http://localhost:7776 (bezpośredni dostęp)
- phpMyAdmin: http://localhost:7778 (zarządzanie bazą danych)
- Whisper AI: http://localhost:9102 (serwis transkrypcji)

**Pierwsze uruchomienie:**
- Może trwać kilka minut (budowanie kontenerów + download modelu Whisper)
- Jeśli używasz self-signed certów, przeglądarka wyświetli ostrzeżenie (kliknij "Advanced" → "Proceed")
- Baza danych zostanie automatycznie utworzona
- Migracje zostaną automatycznie wykonane

### 5. Lub uruchomienie lokalnie (bez Docker)
```bash
npm install
npm start
```

## 🐳 Docker

### Budowanie i uruchomienie
```bash
# Uruchom wszystko (Voice Notes + Whisper)
docker-compose up -d

# Tylko Voice Notes (bez Whisper)
docker-compose up -d voice-notes

# Rebuild po zmianach
docker-compose up -d --build

# Logi
docker-compose logs -f

# Stop
docker-compose down
```

### Modele Whisper
Możesz wybrać model Whisper w `.env`:
- `tiny` - najszybszy, ~1GB pamięci RAM
- `base` - dobry kompromis (domyślny) ~1GB RAM
- `small` - lepsze wyniki ~2GB RAM
- `medium` - bardzo dobre wyniki ~5GB RAM
- `large` - najlepsze wyniki ~10GB RAM

## 📖 Jak używać

### Transkrypcja
1. **Wybierz mikrofon** z listy urządzeń audio
2. **Wybierz tryb transkrypcji:**
   - Web Speech API - natychmiastowa transkrypcja
   - Whisper AI - dokładniejsza (wymaga Docker)
3. **Kliknij "🎤 Start"** aby rozpocząć nagrywanie
4. **Mów naturalnie** - aplikacja nasłuchuje w tle
5. **Obserwuj wizualizację** audio i status

### Nagrywanie audio
1. **Kliknij "⏺️ Rozpocznij nagrywanie"** w sekcji "Nagrywanie pełnej sesji"
2. **Timer i rozmiar** będą aktualizowane na żywo
3. **Kliknij "⏹️ Zatrzymaj nagrywanie"** aby zakończyć
4. **Nagranie zostanie automatycznie zapisane** na serwerze
5. **Otwórz panel "🎙️ Nagrania"** aby zarządzać swoimi nagraniami:
   - Odtwórz nagranie bezpośrednio w przeglądarce
   - Pobierz plik audio (WebM)
   - Usuń niepotrzebne nagrania

**Wskazówka:** Możesz jednocześnie nagrywać audio i robić transkrypcję - działają niezależnie!
6. Co 50 słów tekst jest **automatycznie wysyłany do AI**
7. Możesz też kliknąć **"✨ Wyślij do AI teraz"** w dowolnym momencie
8. **Edytuj tekst** w prawym oknie jeśli potrzeba
9. **Pobierz TXT** lub zapisz w historii

## 🎨 Motywy
- **☀️ Jasny** - białe tło, czarny tekst
- **🌙 Ciemny** - ciemny motyw, biały tekst

Przełącznik w prawym górnym rogu.

## 📜 Historia sesji
Kliknij **"📜 Historia"** aby zobaczyć ostatnie 50 notatek:
- Timestamp
- Liczba słów
- Podgląd tekstu
- Kliknij aby załadować sesję

## 🔧 Konfiguracja

### Environment Variables

Aplikacja używa dwóch plików konfiguracyjnych:
- **`.env`** - Plik z przykładowymi wartościami (commitowany do repo)
- **`.env.local`** - Plik z rzeczywistymi kluczami API (NIE commitowany, ignorowany przez git)

#### Wymagane zmienne:

```env
# Claude API - do korekty tekstu AI
CLAUDE_API_KEY=sk-ant-your-actual-key-here

# ElevenLabs API - do generowania audio (TTS)
ELEVEN_LABS_API_KEY=sk_your_actual_elevenlabs_key_here
```

#### Opcjonalne zmienne:

```env
# SMTP Mailer - do wysyłania email
MAILER_DSN=smtp://user:password@smtp.example.com:587?encryption=tls

# Port aplikacji (domyślnie 7776)
PORT=7776

# Model Whisper (tiny/base/small/medium/large)
WHISPER_MODEL=base

# URL serwisu Whisper
WHISPER_URL=http://whisper:9000

# Tryb Node.js
NODE_ENV=development

# Konfiguracja bazy danych
DB_HOST=mariadb
DB_PORT=3306
DB_NAME=vnotes
DB_USER=vnotes_user
DB_PASSWORD=vnotes_secure_pass_2024
MYSQL_ROOT_PASSWORD=root_secure_pass_2024
```

### Funkcje wymagające kluczy API

| Funkcja | Wymagany klucz | Opis |
|---------|---------------|------|
| Korekta tekstu AI | `CLAUDE_API_KEY` | Automatyczna korekta ortografii i gramatyki |
| Text-to-Speech | `ELEVEN_LABS_API_KEY` | Generowanie audio z tekstu (polskie głosy) |
| Wysyłanie email | `MAILER_DSN` | Wysyłanie notatek przez email |
| Transkrypcja Whisper | - | Działa lokalnie w Dockerze (bez klucza) |
| Web Speech API | - | Działa w przeglądarce (bez klucza) |

### Chunk size
W pliku `public/index.html` możesz zmienić:
```javascript
chunkSize: 50,  // Liczba słów przed auto-wysyłką do AI
```

## 🏗️ Architektura

```
┌─────────────────┐
│   Frontend      │
│   (Vue.js)      │
│   - Web Speech  │
│   - MediaRecorder│
│   - Visualization│
└────────┬────────┘
         │
         │ HTTP/REST
         ▼
┌─────────────────┐
│   Node.js       │
│   (Express)     │
│   - /api/correct│
│   - /api/transcribe│
└────┬─────┬──────┘
     │     │
     │     └──────────┐
     │                │
     ▼                ▼
┌─────────┐    ┌──────────┐
│ Claude  │    │ Whisper  │
│   API   │    │ (Docker) │
└─────────┘    └──────────┘
```

## 📁 Struktura projektu

```
vnotes/
├── docker-compose.yml       # Orchestracja kontenerów
├── Dockerfile              # Dockerfile dla Node.js + Frontend
├── backend/
│   ├── package.json        # Zależności Node.js
│   ├── .env                # Przykładowa konfiguracja (commitowana)
│   ├── .env.local          # Rzeczywiste klucze API (NIE commitować!)
│   ├── server.js           # Stary monolityczny serwer (deprecated)
│   ├── docker-entrypoint.sh # Skrypt startowy Docker
│   ├── recordings/         # Nagrania audio użytkowników
│   └── src/
│       ├── server.js       # Główny serwer Express
│       ├── controllers/    # Kontrolery (1 endpoint = 1 plik)
│       ├── services/       # Logika biznesowa
│       ├── routes/         # Routing API
│       ├── models/         # Modele Sequelize (baza danych)
│       ├── migrations/     # Migracje bazy danych
│       └── config/         # Konfiguracja bazy
├── frontend/
│   ├── package.json        # Zależności Vue.js
│   ├── vue.config.js       # Konfiguracja Vue CLI
│   ├── public/
│   │   └── index.html      # Główny plik HTML
│   └── src/
│       ├── App.vue         # Główny komponent aplikacji
│       ├── components/     # Komponenty Vue
│       └── services/       # Serwisy (API, Audio, TTS, Storage)
├── whisper/
│   ├── Dockerfile          # Dockerfile dla Whisper
│   └── server.py           # Serwer Whisper (Flask)
├── nginx/
│   ├── nginx.conf          # Konfiguracja Nginx
│   └── ssl/                # Certyfikaty SSL (NIE commitować!)
│       ├── cert.pem        # Certyfikat publiczny
│       └── key.pem         # Klucz prywatny
├── recordings/             # Katalog nagrań (montowany z Docker)
│   └── diary/              # Nagrania TTS
└── .gitignore             # Ignorowane pliki (w tym .env.local)
```

## 🔍 Troubleshooting

### Brak klucza API Claude
**Objaw:** Komunikat "Brak klucza API" przy próbie korekty tekstu

**Rozwiązanie:**
1. Utwórz plik `backend/.env.local` (jeśli nie istnieje)
2. Dodaj: `CLAUDE_API_KEY=sk-ant-your-actual-key-here`
3. Zrestartuj aplikację: `docker-compose restart`

### Brak klucza ElevenLabs
**Objaw:** Brak dostępnych głosów lub błąd przy generowaniu TTS

**Rozwiązanie:**
1. Dodaj do `backend/.env.local`: `ELEVEN_LABS_API_KEY=sk_your_actual_key_here`
2. Zrestartuj aplikację: `docker-compose restart`
3. Sprawdź w konsoli przeglądarki czy endpoint `/api/tts/voices` zwraca głosy

### Nie działa wysyłanie email
**Objaw:** Błąd przy próbie wysłania email

**Rozwiązanie:**
1. Sprawdź konfigurację SMTP w `backend/.env.local`
2. Format: `MAILER_DSN=smtp://user:password@smtp.example.com:587?encryption=tls`
3. Dla Gmail użyj "App Password" zamiast zwykłego hasła
4. Zrestartuj aplikację

### Whisper nie działa
**Objaw:** Brak transkrypcji w trybie Whisper AI

**Rozwiązanie:**
1. Sprawdź czy kontener jest uruchomiony: `docker ps`
2. Sprawdź logi: `docker-compose logs whisper`
3. Health check: `curl http://localhost:9102/health`
4. Może potrzebować więcej czasu na start (download modelu pierwszego razu)
5. Sprawdź czy masz wystarczająco RAM dla wybranego modelu

### Problemy z certyfikatem SSL
**Objaw:** Przeglądarka ostrzega o niezaufanym certyfikacie lub błąd ERR_SSL_PROTOCOL_ERROR

**Rozwiązanie:**

1. **Brak certyfikatów - wygeneruj je:**
   ```bash
   mkdir -p nginx/ssl
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout nginx/ssl/key.pem \
     -out nginx/ssl/cert.pem \
     -subj "/C=PL/ST=Warsaw/L=Warsaw/O=Dev/CN=localhost"
   docker-compose restart nginx
   ```

2. **Ostrzeżenie "Not Secure" (self-signed cert):**
   - To normalne dla self-signed certyfikatów w development
   - Chrome: kliknij "Advanced" → "Proceed to localhost (unsafe)"
   - Firefox: kliknij "Advanced" → "Accept the Risk and Continue"

3. **Błędy uprawnień:**
   ```bash
   chmod 644 nginx/ssl/cert.pem
   chmod 600 nginx/ssl/key.pem
   docker-compose restart nginx
   ```

4. **Nginx nie startuje - sprawdź logi:**
   ```bash
   docker-compose logs nginx
   ```

### Nginx nie startuje
**Objaw:** Kontener nginx nie działa, błąd przy starcie

**Rozwiązanie:**
1. Sprawdź czy porty 80 i 443 nie są zajęte:
   ```bash
   sudo lsof -i :80
   sudo lsof -i :443
   # Jeśli coś blokuje, zatrzymaj (np. Apache):
   sudo systemctl stop apache2
   ```
2. Sprawdź konfigurację nginx:
   ```bash
   docker-compose exec nginx nginx -t
   ```
3. Sprawdź logi:
   ```bash
   docker-compose logs nginx
   ```

### Baza danych nie działa
**Objaw:** Backend nie może połączyć się z MariaDB, błąd "Connection refused"

**Rozwiązanie:**
1. Sprawdź czy kontener MariaDB działa:
   ```bash
   docker-compose ps mariadb
   docker-compose logs mariadb
   ```
2. Sprawdź połączenie:
   ```bash
   docker-compose exec mariadb mysql -u vnotes_user -p vnotes
   # Hasło: vnotes_secure_pass_2024
   ```
3. Zresetuj bazę danych (UWAGA: usuwa wszystkie dane):
   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

### Web Speech nie działa
- Użyj Chrome lub Edge
- Wymagane HTTPS (lub localhost)
- Sprawdź uprawnienia mikrofonu w przeglądarce

### Claude API error
- Sprawdź czy klucz API jest prawidłowy w `.env`
- Sprawdź limity API w konsoli Anthropic
- Sprawdź logi: `docker-compose logs voice-notes`

### Brak dźwięku / mikrofon
- Sprawdź uprawnienia mikrofonu w przeglądarce
- Wybierz właściwe urządzenie z listy
- Sprawdź czy inne aplikacje nie używają mikrofonu

## 🚀 Development

### Lokalny development (hot reload)
```bash
# Backend
npm run dev

# Frontend - edytuj public/index.html i odśwież przeglądarkę
```

### Tylko Whisper w Docker, reszta lokalnie
```bash
# Uruchom tylko Whisper
docker-compose up -d whisper

# Zmień w .env
WHISPER_URL=http://localhost:9102

# Uruchom Node.js lokalnie
npm run dev
```

## TODO / Roadmap

### Zaimplementowane
- [x] Web Speech API
- [x] Claude AI korekcja (różne tryby)
- [x] Wizualizacja audio (equalizer)
- [x] Wybór urządzenia audio
- [x] Whisper lokalny (Docker)
- [x] Historia sesji
- [x] Responsive design
- [x] Nagrywanie audio podczas transkrypcji
- [x] Text-to-Speech (ElevenLabs)
- [x] Baza danych (MariaDB + Sequelize)
- [x] MVC Architecture (Controllers/Services/Routes)
- [x] SSL/HTTPS (Nginx)
- [x] Zaawansowane ustawienia TTS (suwaki parametrów)


## Licencja

MIT

## Contributing

Pull requests are welcome! Przed rozpoczęciem pracy nad dużą funkcją, otwórz issue aby przedyskutować zmiany.

## Technologie

- **Frontend:** Vue.js 2, TailwindCSS
- **Backend:** Node.js, Express, Sequelize ORM
- **Baza danych:** MariaDB
- **AI/ML:** Claude API (Anthropic), OpenAI Whisper, ElevenLabs TTS
- **Infrastructure:** Docker, Docker Compose, Nginx
- **Architektura:** MVC, DDD, SOLID principles

## Autor

Voice Notes App - 2025

Stworzone z myślą o efektywnym robieniu notatek głosowych z automatyczną korektą przez AI.

