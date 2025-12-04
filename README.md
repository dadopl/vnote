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

### 🎙️ Nagrywanie audio (NOWOŚĆ!)
- **Pełne nagrywanie sesji** - zapisz całą rozmowę do pliku audio
- **Automatyczny zapis na serwerze** - nagrania przechowywane w katalogu `recordings/`
- **Zarządzanie nagraniami:**
  - Lista wszystkich nagrań z datą i czasem trwania
  - Odtwarzacz HTML5 audio wbudowany w panel
  - Pobieranie nagrań w formacie WebM
  - Usuwanie niepotrzebnych nagrań
- **Timer i wskaźnik rozmiaru** - na żywo podczas nagrywania
- **Niezależne od transkrypcji** - nagrywanie działa równolegle z rozpoznawaniem mowy

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

### 2. Konfiguracja
```bash
cp .env.example .env
```

Edytuj `.env` i ustaw swój klucz Claude API:
```env
CLAUDE_API_KEY=sk-ant-your-key-here
WHISPER_MODEL=base
```

### 3. Uruchomienie z Docker Compose (zalecane)
```bash
docker-compose up -d
```

Aplikacja będzie dostępna pod adresem: http://localhost:7776

### 4. Lub uruchomienie lokalnie (bez Whisper)
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
```env
# Wymagane
CLAUDE_API_KEY=sk-ant-your-key-here

# Opcjonalne
PORT=7776
WHISPER_MODEL=base
WHISPER_URL=http://whisper:9000
```

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
├── docker-compose.yml    # Orchestracja kontenerów
├── Dockerfile           # Dockerfile dla Node.js
├── package.json         # Zależności Node.js
├── .env                 # Konfiguracja (nie commituj!)
├── .env.example         # Przykładowa konfiguracja
├── public/
│   └── index.html       # Frontend (Vue.js SPA)
├── src/
│   └── server.js        # Backend (Express)
└── whisper/
    ├── Dockerfile       # Dockerfile dla Whisper
    └── whisper_server.py # Serwer Whisper (Flask)
```

## 🔍 Troubleshooting

### Whisper nie działa
1. Sprawdź czy kontener jest uruchomiony: `docker ps`
2. Sprawdź logi: `docker-compose logs whisper`
3. Health check: `curl http://localhost:9102/health`
4. Może potrzebować więcej czasu na start (download modelu)

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

## 📝 TODO / Roadmap

- [x] Web Speech API
- [x] Claude AI korekcja
- [x] Wizualizacja audio
- [x] Wybór urządzenia
- [x] Whisper lokalny
- [x] Dark/Light theme
- [x] Historia sesji
- [x] Responsive design
- [ ] Export do PDF/DOCX
- [ ] Punktowanie / formatowanie (listy, nagłówki)
- [ ] Obsługa wielu języków
- [ ] Whisper GPU support
- [ ] Real-time streaming Whisper
- [ ] Backup do chmury (S3/Drive)
- [ ] Współdzielenie notatek (URL/QR)

## 📄 Licencja

MIT

## 🤝 Contributing

Pull requests are welcome!

## 👨‍💻 Autor

Voice Notes App - 2025
