# Baza danych - Instrukcje

## Przegląd
Aplikacja używa MariaDB 11 Alpine jako bazy danych z Sequelize ORM do zarządzania modelami i migracjami.

## Dostęp do phpMyAdmin
phpMyAdmin jest dostępny pod adresem: `http://localhost:7778`

Dane logowania:
- Serwer: `mariadb`
- Użytkownik: `vnotes_user`
- Hasło: `vnotes_secure_pass_2024` (lub wartość z zmiennej `DB_PASSWORD` w `.env`)

## Struktura bazy danych

### Tabele:

1. **notes** - Przechowuje notatki głosowe
   - `id` - klucz główny
   - `raw_text` - surowy tekst z transkrypcji
   - `transformed_text` - tekst po korekcji AI
   - `type` - typ korekty (default, email, diary, custom)
   - `custom_instruction` - niestandardowa instrukcja dla AI
   - `created_at`, `updated_at` - znaczniki czasu

2. **recordings** - Przechowuje nagrania audio
   - `id` - klucz główny
   - `note_id` - FK do notes (opcjonalne)
   - `original_audio_path` - ścieżka do oryginalnego nagrania
   - `tts_audio_path` - ścieżka do pliku TTS (jeśli wygenerowano)
   - `duration` - długość nagrania
   - `name` - nazwa nagrania
   - `created_at`, `updated_at` - znaczniki czasu

3. **tts_generations** - Historia generowania TTS
   - `id` - klucz główny
   - `note_id` - FK do notes
   - `audio_path` - ścieżka do wygenerowanego audio
   - `voice_id` - ID głosu z ElevenLabs
   - `voice_name` - nazwa głosu
   - `model_id` - ID modelu użytego do generowania
   - `text_length` - długość tekstu
   - `created_at` - znacznik czasu

## Migracje

### Automatyczne uruchamianie
Migracje są automatycznie uruchamiane przy starcie kontenera Docker.

### Ręczne zarządzanie migracjami

Wejdź do kontenera:
```bash
docker exec -it voice-notes-app sh
```

Uruchom migracje:
```bash
npm run migrate
```

Cofnij ostatnią migrację:
```bash
npm run migrate:undo
```

Cofnij wszystkie migracje:
```bash
npm run migrate:undo:all
```

### Tworzenie nowych migracji

Wejdź do kontenera i uruchom:
```bash
npx sequelize-cli migration:generate --name nazwa-migracji
```

Migracja zostanie utworzona w katalogu `backend/src/migrations/`.

## Seeders

Umieść pliki seeders w katalogu `backend/src/seeders/`.

Uruchom seeders:
```bash
npm run seed
```

## Konfiguracja

Zmienne środowiskowe w pliku `backend/.env`:

```env
DB_HOST=mariadb
DB_PORT=3306
DB_NAME=vnotes
DB_USER=vnotes_user
DB_PASSWORD=vnotes_secure_pass_2024
MYSQL_ROOT_PASSWORD=root_secure_pass_2024
NODE_ENV=development
```

## Modele Sequelize

Modele znajdują się w `backend/src/models/`:
- `Note.js` - Model notatek
- `Recording.js` - Model nagrań
- `TtsGeneration.js` - Model generacji TTS

Wszystkie modele są automatycznie ładowane przez `backend/src/models/index.js`.

## Przykłady użycia w kodzie

```javascript
const { Note, Recording, TtsGeneration } = require('./src/models');

// Tworzenie nowej notatki
const note = await Note.create({
  rawText: 'Tekst z transkrypcji',
  transformedText: 'Tekst po korekcji',
  type: 'email'
});

// Pobieranie notatki z nagraniami
const noteWithRecordings = await Note.findByPk(id, {
  include: ['recordings', 'ttsGenerations']
});

// Tworzenie nagrania powiązanego z notatką
const recording = await Recording.create({
  noteId: note.id,
  originalAudioPath: '/app/recordings/audio.webm',
  duration: 120.5,
  name: 'Moje nagranie'
});
```

## Backup bazy danych

### Eksport
```bash
docker exec vnotes-mariadb mariadb-dump -u root -proot_secure_pass_2024 vnotes > backup.sql
```

### Import
```bash
docker exec -i vnotes-mariadb mariadb -u root -proot_secure_pass_2024 vnotes < backup.sql
```

## Troubleshooting

### Baza danych nie jest dostępna przy starcie
Upewnij się, że healthcheck działa poprawnie i kontener `mariadb` jest w stanie `healthy`:
```bash
docker ps
```

### Resetowanie bazy danych
```bash
docker compose down -v  # Usuwa volumeny
docker compose up -d    # Tworzy nową bazę
```

### Sprawdzanie logów bazy danych
```bash
docker logs vnotes-mariadb
```

