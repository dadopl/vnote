// Backend internationalization configuration
// Supported languages: en (English), pl (Polish)

const SUPPORTED_LANGUAGES = ['en', 'pl'];
const DEFAULT_LANGUAGE = 'en';

const prompts = {
    en: {
        default: (text) => `Correct the spelling, grammar, and punctuation in the text below. Maintain the natural spoken style and meaning. Sentences must make sense, skip meaningless and out-of-context statements. Reply ONLY with the corrected text, without comments.

Text to correct:
${text}`,

        summary: (text) => `Create a concise summary of the text below. Extract the most important information and present it in bullet points.

Text to summarize:
${text}`,

        jira: (text) => `Format the text below as a Jira task.
Structure should contain:
1. Title (concise and specific)
2. Description (task details)
3. Acceptance criteria (bullet list of what needs to be done)
4. Priority (suggested based on content)

Text to format:
${text}`,

        note: (text) => `Create a readable, well-formatted note based on the text below. Use headings, bold text, and bullet lists where it improves readability. Keep all important information.

Text for note:
${text}`,

        expansion: (text) => `Expand on the topics mentioned in the text below. Add missing context, explain difficult concepts, and suggest next steps or related topics worth considering.

Text to expand:
${text}`,

        dziennik: (text) => `Write a concise diary entry (300-1200 characters depending on input text length), economical and stylistically perfect, flawless, surprising with narration and word flow, unconventional, unique, completely engaging and not shying away from profanity and surprising hyperboles. Without any special characters.

Base text:
${text}`,

        custom: (text, instruction) => `${instruction}

Text to process:
${text}`
    },

    pl: {
        default: (text) => `Popraw ortografię, gramatykę i interpunkcję w poniższym tekście. Zachowaj naturalny styl mówiony i znaczenie. Zdania muszą mieć sens, pomijaj nic nie wnoszące bezsensowne i wyrwane z kontekstu stwierdzenia. Odpowiedz TYLKO poprawionym tekstem, bez komentarzy.

Tekst do poprawy:
${text}`,

        summary: (text) => `Stwórz zwięzłe streszczenie poniższego tekstu. Wyciągnij najważniejsze informacje i przedstaw je w punktach.

Tekst do streszczenia:
${text}`,

        jira: (text) => `Sformatuj poniższy tekst jako zadanie w systemie Jira.
Struktura powinna zawierać:
1. Tytuł (zwięzły i konkretny)
2. Opis (szczegóły zadania)
3. Kryteria akceptacji (lista punktowa co musi zostać zrobione)
4. Priorytet (sugerowany na podstawie treści)

Tekst do sformatowania:
${text}`,

        note: (text) => `Stwórz czytelną, dobrze sformatowaną notatkę na podstawie poniższego tekstu. Użyj nagłówków, pogrubień i list punktowanych tam gdzie to poprawi czytelność. Zachowaj wszystkie istotne informacje.

Tekst do notatki:
${text}`,

        expansion: (text) => `Rozwiń poruszane w poniższym tekście zagadnienia. Dodaj brakujący kontekst, wyjaśnij trudniejsze pojęcia i zaproponuj kolejne kroki lub powiązane tematy, które warto rozważyć.

Tekst do rozwinięcia:
${text}`,

        dziennik: (text) => `Napisz zwięzły wpis (300-1200 znaków w zależności od długości tekstu wsadu) w prywatnym dzienniku, oszczędny i perfekcyjny stylistycznie, bezbłędny, zaskakujący narracją i prowadzeniem słowa, niebanalny, nietuzinkowy, wciągający bez reszty i niestroniący od przekleństw i zaskakujących hiperbol. Bez żadnych znaków specjalnych.

Tekst bazowy:
${text}`,

        custom: (text, instruction) => `${instruction}

Tekst do przetworzenia:
${text}`
    }
};

const therapyPrompts = {
    en: {
        systemPrompt: `You are a professional psychotherapist conducting a therapy session.

YOUR ROLE:
1. ANALYSIS - Carefully analyze the client's statement, considering the context of previous exchanges
2. EMPATHY - Show deep understanding of their emotions and life situation
3. QUESTIONS - Ask 1-2 reflective, open-ended questions that help the client think more deeply about their situation
4. OBSERVATIONS - Gently point out thought, emotional, or behavioral patterns you notice
5. SUPPORT - Provide a safe space without judgment or criticism

THERAPEUTIC TECHNIQUES TO APPLY:
- Reflecting emotions and paraphrasing statements
- Validating the client's feelings and experiences
- Open questions instead of closed ones or giving ready-made advice
- Helping the client in self-discovery and reaching their own conclusions
- Pointing out internal resources and client's strengths
- Working with "here and now" while considering historical context

COMMUNICATION STYLE:
- Warm, empathetic, professional but human
- Authentic and present in contact
- No psychological jargon - speak simply and understandably
- Adjust pace and depth to client's needs
- Respect for boundaries and client's autonomy`,

        contextHeader: `\n\nCONTEXT OF PREVIOUS EXCHANGES:\n`,
        exchangeLabel: (index) => `\n[Exchange ${index}]\n`,
        clientLabel: 'Client',
        therapistLabel: 'Therapist',
        currentStatement: `\n\nCLIENT'S CURRENT STATEMENT:\n`,
        responseInstruction: `\n\nRespond as a therapist (150-500 words). Remember the context of previous exchanges if it exists. Your response should be natural, like in a real therapy session.`
    },

    pl: {
        systemPrompt: `Jesteś profesjonalnym psychoterapeutą prowadzącym sesję terapeutyczną.

TWOJA ROLA:
1. ANALIZA - Uważnie przeanalizuj wypowiedź klienta, uwzględniając kontekst poprzednich wymian
2. EMPATIA - Wykaż głębokie zrozumienie jego emocji i sytuacji życiowej
3. PYTANIA - Zadaj 1-2 refleksyjne, otwarte pytania, które pomogą klientowi głębiej zastanowić się nad swoją sytuacją
4. OBSERWACJE - Delikatnie zwróć uwagę na wzorce myślowe, emocjonalne lub behawioralne, które dostrzegasz
5. WSPARCIE - Zapewnij bezpieczną przestrzeń bez oceniania i krytyki

TECHNIKI TERAPEUTYCZNE DO ZASTOSOWANIA:
- Odzwierciedlanie emocji i parafrazowanie wypowiedzi
- Walidacja uczuć i doświadczeń klienta
- Otwarte pytania zamiast zamkniętych lub dawania gotowych rad
- Pomoc klientowi w samopoznaniu i dojściu do własnych wniosków
- Zwracanie uwagi na zasoby wewnętrzne i mocne strony klienta
- Praca z "tu i teraz", ale z uwzględnieniem kontekstu historycznego

STYL KOMUNIKACJI:
- Ciepły, empatyczny, profesjonalny ale niepozbawiony człowieczeństwa
- Autentyczny i obecny w kontakcie
- Bez żargonu psychologicznego - mów prosto i zrozumiale
- Dostosuj tempo i głębokość do potrzeb klienta
- Szacunek dla granic i autonomii klienta`,

        contextHeader: `\n\nKONTEKST POPRZEDNICH WYMIAN:\n`,
        exchangeLabel: (index) => `\n[Wymiana ${index}]\n`,
        clientLabel: 'Klient',
        therapistLabel: 'Terapeuta',
        currentStatement: `\n\nAKTUALNA WYPOWIEDŹ KLIENTA:\n`,
        responseInstruction: `\n\nOdpowiedz jako terapeuta (150-500 słów). Pamiętaj o kontekście poprzednich wymian jeśli istnieje. Twoja odpowiedź powinna być naturalna, jak w prawdziwej sesji terapeutycznej.`
    }
};

const errorMessages = {
    en: {
        noText: 'No text to correct',
        noApiKey: 'API key missing. Set CLAUDE_API_KEY in .env file',
        serverError: 'Server error: ',
        textTooLong: (length) => `Text too long (${length}/2000 characters)`,
        noteIdRequired: 'noteId is required',
        audioNotFound: 'Audio not found',
        fileNotFound: 'Audio file does not exist',
        noTextOrVoice: 'Missing text or voice ID',
        elevenLabsNotConfigured: 'ELEVEN_LABS_API_KEY is not configured',
        voicesError: 'Error fetching voices: ',
        generateError: 'Error generating audio: '
    },
    pl: {
        noText: 'Brak tekstu do korekty',
        noApiKey: 'Brak klucza API. Ustaw CLAUDE_API_KEY w pliku .env',
        serverError: 'Błąd serwera: ',
        textTooLong: (length) => `Tekst za długi (${length}/2000 znaków)`,
        noteIdRequired: 'noteId jest wymagany',
        audioNotFound: 'Audio nie znalezione',
        fileNotFound: 'Plik audio nie istnieje',
        noTextOrVoice: 'Brak tekstu lub ID głosu',
        elevenLabsNotConfigured: 'ELEVEN_LABS_API_KEY nie jest skonfigurowany',
        voicesError: 'Błąd pobierania głosów: ',
        generateError: 'Błąd generowania audio: '
    }
};

// Language code mapping for ElevenLabs
const elevenLabsLanguageCodes = {
    en: 'en',
    pl: 'pl'
};

function getLanguage(lang) {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
        return lang;
    }
    return DEFAULT_LANGUAGE;
}

function getPrompt(type, text, language, customInstruction = '') {
    const lang = getLanguage(language);
    const langPrompts = prompts[lang];

    if (type === 'custom') {
        return langPrompts.custom(text, customInstruction);
    }

    const promptFn = langPrompts[type] || langPrompts.default;
    return promptFn(text);
}

function getTherapyPrompt(currentText, conversationHistory, language) {
    const lang = getLanguage(language);
    const therapy = therapyPrompts[lang];

    let contextPart = '';

    if (conversationHistory && conversationHistory.length > 0) {
        contextPart = therapy.contextHeader;
        conversationHistory.forEach((exchange, index) => {
            contextPart += therapy.exchangeLabel(index + 1);
            contextPart += `${therapy.clientLabel}: ${exchange.client}\n`;
            contextPart += `${therapy.therapistLabel}: ${exchange.therapist}\n`;
        });
        contextPart += `\n---\n`;
    }

    return therapy.systemPrompt + contextPart + therapy.currentStatement + currentText + therapy.responseInstruction;
}

function getErrorMessage(key, language, ...args) {
    const lang = getLanguage(language);
    const message = errorMessages[lang][key];

    if (typeof message === 'function') {
        return message(...args);
    }
    return message || errorMessages[DEFAULT_LANGUAGE][key];
}

function getElevenLabsLanguageCode(language) {
    return elevenLabsLanguageCodes[getLanguage(language)] || 'en';
}

module.exports = {
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE,
    getLanguage,
    getPrompt,
    getTherapyPrompt,
    getErrorMessage,
    getElevenLabsLanguageCode
};

