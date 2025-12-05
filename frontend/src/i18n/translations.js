// Frontend translations for Voice Notes App
// Supported languages: en (English - default), pl (Polish)

export const translations = {
    en: {
        // Header
        header: {
            title: 'Voice Notepad',
            subtitle: 'Speak freely, AI will correct the text'
        },

        // Navigation buttons
        nav: {
            recordings: 'Recordings',
            history: 'History',
            diaryAudio: 'Audio Diary',
            allNotes: 'All notes'
        },

        // Server status
        server: {
            connected: 'Connected',
            disconnected: 'Disconnected',
            noApiKey: 'No API key in .env',
            label: 'Server'
        },

        // Audio device selection
        audioDevice: {
            label: 'Audio device selection',
            default: 'Default microphone',
            microphoneNumber: 'Microphone'
        },

        // Transcription mode
        transcription: {
            label: 'Transcription mode selection',
            webSpeech: 'Web Speech API (instant)',
            whisper: 'Whisper AI',
            whisperAvailable: '(available)',
            whisperUnavailable: '(unavailable)',
            mobileWarning: 'Mobile device detected:',
            mobileWarningText: 'Web Speech API may not work properly on Android. If you don\'t see text in the "Raw text" field, switch to Whisper AI mode.'
        },

        // Correction types
        correction: {
            label: 'AI correction type',
            types: {
                default: 'Default (Language correction)',
                summary: 'Summary',
                jira: 'Jira task',
                note: 'Note',
                expansion: 'Topic expansion',
                dziennik: 'Diary entry',
                sesja: 'Therapy session',
                custom: 'Custom instruction'
            },
            customPlaceholder: 'E.g. Translate to Spanish, Change style to formal...'
        },

        // Therapy session
        therapy: {
            title: 'Therapy session mode:',
            description: 'AI will act as a professional psychotherapist. Your statements will appear in the "Raw text" field, and therapist responses in the "Corrected text" field.',
            context: 'Context: last',
            exchanges: 'exchanges',
            history: 'History:',
            clearHistory: 'Clear session history'
        },

        // Recording
        recording: {
            enableLabel: 'Record audio while dictating',
            enableDescription: 'Recording will be automatically saved to the server after stopping dictation'
        },

        // Control buttons
        buttons: {
            start: 'Start',
            stop: 'Stop',
            sendToAI: 'Send to AI now',
            clear: 'Clear',
            downloadTxt: 'Download TXT',
            sendEmail: 'Send email'
        },

        // TTS section
        tts: {
            title: 'Generate audio from text (Text-to-Speech)',
            selectVoice: 'Select voice',
            loadingVoices: 'Loading voices...',
            chooseVoice: 'Choose voice',
            stability: 'Stability',
            stabilityHint: 'higher = more stable, less expressive',
            similarity: 'Similarity',
            similarityHint: 'higher = closer to original voice',
            style: 'Style',
            styleHint: 'higher = more style (costs latency)',
            characters: 'characters',
            generateAudio: 'Generate audio',
            generating: 'Generating...',
            textTooLong: 'Text is too long. Maximum length is 2000 characters. Shorten the text before generating audio.'
        },

        // Text areas
        textAreas: {
            rawText: 'Raw text',
            correctedText: 'Corrected text',
            words: 'words',
            correctedPlaceholder: 'The AI-corrected text will appear here...'
        },

        // Notes list
        notes: {
            title: 'All notes',
            loading: 'Loading notes...',
            empty: 'No notes in database',
            emptyHint: 'Start dictating to create your first note',
            rawText: 'Raw text:',
            correctedTextLabel: 'Corrected text:',
            none: '(none)',
            load: 'Load',
            delete: 'Delete',
            deleteConfirm: 'Are you sure you want to delete this note?\n\nThis operation is irreversible and will also delete all associated recordings and TTS audio.',
            previous: 'Previous',
            next: 'Next',
            page: 'Page',
            of: 'of',
            notesCount: 'notes'
        },

        // Error messages
        errors: {
            title: 'Error',
            cannotConnect: 'Cannot connect to server',
            speechNotSupported: 'Your browser does not support speech recognition. Use Chrome or Edge.',
            recognitionError: 'Recognition error:',
            cannotStartRecognition: 'Cannot start speech recognition',
            recordingError: 'Cannot start recording:',
            savingError: 'Error saving recording:',
            deletingError: 'Error deleting recording:',
            transcriptionError: 'Error transcribing recording:',
            noTextRecognized: 'Whisper did not recognize any text in the recording',
            voicesError: 'Cannot load voices:',
            audioError: 'Error generating audio',
            deletingAudioError: 'Error deleting audio:',
            loadingNotesError: 'Error loading notes:',
            loadingNoteError: 'Error loading note:',
            deletingNoteError: 'Error deleting note:'
        },

        // Processing log
        processingLog: {
            title: 'Correction history',
            audioGenerated: 'Audio generated:'
        },

        // Status indicators
        status: {
            listening: 'Listening',
            wordsCount: 'words',
            autoSendAt: 'auto-send at',
            processing: 'Processing...',
            whisperProcessing: 'Whisper processing...',
            saved: 'Saved!'
        },

        // Recordings panel
        recordingsPanel: {
            title: 'Recordings',
            empty: 'No recordings',
            duration: 'Duration:',
            transcribe: 'Transcribe',
            download: 'Download',
            delete: 'Delete',
            deleteConfirm: 'Are you sure you want to delete this recording?'
        },

        // History panel
        historyPanel: {
            title: 'Session history',
            empty: 'No saved sessions',
            load: 'Load',
            clearAll: 'Clear history',
            clearConfirm: 'Are you sure you want to clear entire history?'
        },

        // Diary panel
        diaryPanel: {
            title: 'Audio Diary (TTS)',
            empty: 'No TTS audio generated',
            voice: 'Voice:',
            length: 'Length:',
            chars: 'chars',
            play: 'Play',
            download: 'Download',
            delete: 'Delete',
            deleteConfirm: 'Are you sure you want to delete this audio?'
        },

        // Email modal
        email: {
            title: 'Send email',
            recipient: 'Recipient',
            recipientPlaceholder: 'email@example.com',
            subject: 'Subject',
            subjectPlaceholder: 'Email subject (optional)',
            textType: 'Text type',
            rawText: 'Raw text',
            correctedText: 'Corrected text',
            both: 'Both',
            cancel: 'Cancel',
            send: 'Send',
            sending: 'Sending...'
        },

        // Language selector
        language: {
            label: 'Language',
            en: 'English',
            pl: 'Polish'
        },

        // Misc
        misc: {
            close: 'Close',
            confirm: 'Confirm',
            cancel: 'Cancel',
            yes: 'Yes',
            no: 'No'
        }
    },

    pl: {
        // Header
        header: {
            title: 'Notatnik Głosowy',
            subtitle: 'Mów swobodnie, AI poprawi tekst'
        },

        // Navigation buttons
        nav: {
            recordings: 'Nagrania',
            history: 'Historia',
            diaryAudio: 'Dziennik Audio',
            allNotes: 'Wszystkie notatki'
        },

        // Server status
        server: {
            connected: 'Połączony',
            disconnected: 'Rozłączony',
            noApiKey: 'Brak klucza API w .env',
            label: 'Serwer'
        },

        // Audio device selection
        audioDevice: {
            label: 'Wybór urządzenia audio',
            default: 'Domyślny mikrofon',
            microphoneNumber: 'Mikrofon'
        },

        // Transcription mode
        transcription: {
            label: 'Wybór trybu transkrypcji',
            webSpeech: 'Web Speech API (natychmiastowe)',
            whisper: 'Whisper AI',
            whisperAvailable: '(dostępne)',
            whisperUnavailable: '(niedostępne)',
            mobileWarning: 'Urządzenie mobilne wykryte:',
            mobileWarningText: 'Web Speech API może nie działać poprawnie na Androidzie. Jeśli nie widzisz tekstu w polu "Surowy tekst", przełącz się na tryb Whisper AI.'
        },

        // Correction types
        correction: {
            label: 'Rodzaj korekty AI',
            types: {
                default: 'Domyślna (Korekta językowa)',
                summary: 'Streszczenie',
                jira: 'Zadanie w Jira',
                note: 'Notatka',
                expansion: 'Rozwinięcie zagadnień',
                dziennik: 'Wpis do dziennika',
                sesja: 'Sesja terapeutyczna',
                custom: 'Własna instrukcja'
            },
            customPlaceholder: 'Np. Przetłumacz na angielski, Zmień styl na formalny...'
        },

        // Therapy session
        therapy: {
            title: 'Tryb sesji terapeutycznej:',
            description: 'AI będzie działać jako profesjonalny psychoterapeuta. Twoje wypowiedzi pojawią się w polu "Surowy tekst", a odpowiedzi terapeuty w polu "Skorygowany tekst".',
            context: 'Kontekst: ostatnie',
            exchanges: 'wymian',
            history: 'Historia:',
            clearHistory: 'Wyczyść historię sesji'
        },

        // Recording
        recording: {
            enableLabel: 'Nagrywaj audio podczas dyktowania',
            enableDescription: 'Nagranie zostanie automatycznie zapisane na serwerze po zatrzymaniu dyktowania'
        },

        // Control buttons
        buttons: {
            start: 'Start',
            stop: 'Stop',
            sendToAI: 'Wyślij do AI teraz',
            clear: 'Wyczyść',
            downloadTxt: 'Pobierz TXT',
            sendEmail: 'Wyślij email'
        },

        // TTS section
        tts: {
            title: 'Generuj audio z tekstu (Text-to-Speech)',
            selectVoice: 'Wybierz głos',
            loadingVoices: 'Ładowanie głosów...',
            chooseVoice: 'Wybierz głos',
            stability: 'Stabilność',
            stabilityHint: 'wyższe = bardziej stabilny, mniej ekspresyjny',
            similarity: 'Podobieństwo',
            similarityHint: 'wyższe = bliżej oryginalnego głosu',
            style: 'Styl',
            styleHint: 'wyższe = więcej stylu (kosztuje latencję)',
            characters: 'znaków',
            generateAudio: 'Generuj audio',
            generating: 'Generowanie...',
            textTooLong: 'Tekst jest za długi. Maksymalna długość to 2000 znaków. Skróć tekst przed generowaniem audio.'
        },

        // Text areas
        textAreas: {
            rawText: 'Surowy tekst',
            correctedText: 'Skorygowany tekst',
            words: 'słów',
            correctedPlaceholder: 'Tutaj pojawi się tekst po korekcie przez AI...'
        },

        // Notes list
        notes: {
            title: 'Wszystkie notatki',
            loading: 'Ładowanie notatek...',
            empty: 'Brak notatek w bazie danych',
            emptyHint: 'Zacznij dyktować aby utworzyć pierwszą notatkę',
            rawText: 'Tekst surowy:',
            correctedTextLabel: 'Tekst poprawiony:',
            none: '(brak)',
            load: 'Załaduj',
            delete: 'Usuń',
            deleteConfirm: 'Czy na pewno chcesz usunąć tę notatkę?\n\nOperacja jest nieodwracalna i usunie również wszystkie powiązane nagrania i audio TTS.',
            previous: 'Poprzednia',
            next: 'Następna',
            page: 'Strona',
            of: 'z',
            notesCount: 'notatek'
        },

        // Error messages
        errors: {
            title: 'Błąd',
            cannotConnect: 'Nie można połączyć się z serwerem',
            speechNotSupported: 'Twoja przeglądarka nie wspiera rozpoznawania mowy. Użyj Chrome lub Edge.',
            recognitionError: 'Błąd rozpoznawania:',
            cannotStartRecognition: 'Nie można uruchomić rozpoznawania mowy',
            recordingError: 'Nie można rozpocząć nagrywania:',
            savingError: 'Błąd zapisu nagrania:',
            deletingError: 'Błąd usuwania nagrania:',
            transcriptionError: 'Błąd transkrypcji nagrania:',
            noTextRecognized: 'Whisper nie rozpoznał żadnego tekstu w nagraniu',
            voicesError: 'Nie można załadować głosów:',
            audioError: 'Błąd generowania audio',
            deletingAudioError: 'Błąd usuwania audio:',
            loadingNotesError: 'Błąd ładowania notatek:',
            loadingNoteError: 'Błąd ładowania notatki:',
            deletingNoteError: 'Błąd usuwania notatki:'
        },

        // Processing log
        processingLog: {
            title: 'Historia korekt',
            audioGenerated: 'Audio wygenerowane:'
        },

        // Status indicators
        status: {
            listening: 'Nasłuchuje',
            wordsCount: 'słów',
            autoSendAt: 'auto-wysyłka przy',
            processing: 'Przetwarzanie...',
            whisperProcessing: 'Whisper przetwarza...',
            saved: 'Zapisano!'
        },

        // Recordings panel
        recordingsPanel: {
            title: 'Nagrania',
            empty: 'Brak nagrań',
            duration: 'Czas trwania:',
            transcribe: 'Transkrybuj',
            download: 'Pobierz',
            delete: 'Usuń',
            deleteConfirm: 'Czy na pewno chcesz usunąć to nagranie?'
        },

        // History panel
        historyPanel: {
            title: 'Historia sesji',
            empty: 'Brak zapisanych sesji',
            load: 'Załaduj',
            clearAll: 'Wyczyść historię',
            clearConfirm: 'Czy na pewno chcesz wyczyścić całą historię?'
        },

        // Diary panel
        diaryPanel: {
            title: 'Dziennik Audio (TTS)',
            empty: 'Brak wygenerowanych audio TTS',
            voice: 'Głos:',
            length: 'Długość:',
            chars: 'znaków',
            play: 'Odtwórz',
            download: 'Pobierz',
            delete: 'Usuń',
            deleteConfirm: 'Czy na pewno chcesz usunąć to audio?'
        },

        // Email modal
        email: {
            title: 'Wyślij email',
            recipient: 'Odbiorca',
            recipientPlaceholder: 'email@example.com',
            subject: 'Temat',
            subjectPlaceholder: 'Temat wiadomości (opcjonalnie)',
            textType: 'Typ tekstu',
            rawText: 'Surowy tekst',
            correctedText: 'Skorygowany tekst',
            both: 'Oba',
            cancel: 'Anuluj',
            send: 'Wyślij',
            sending: 'Wysyłanie...'
        },

        // Language selector
        language: {
            label: 'Język',
            en: 'Angielski',
            pl: 'Polski'
        },

        // Misc
        misc: {
            close: 'Zamknij',
            confirm: 'Potwierdź',
            cancel: 'Anuluj',
            yes: 'Tak',
            no: 'Nie'
        }
    }
};

export default translations;

