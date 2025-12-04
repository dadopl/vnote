class ClaudeService {
    constructor() {
        this.apiKey = process.env.CLAUDE_API_KEY;
        this.model = 'claude-sonnet-4-20250514';
    }

    async correctText(text, type = 'default', customInstruction = '') {
        const userPrompt = this.buildPrompt(text, type, customInstruction);

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
            throw new Error(error.error?.message || 'Błąd API Claude');
        }

        const data = await response.json();
        return data.content[0].text;
    }

    buildPrompt(text, type, customInstruction) {
        const prompts = {
            summary: `Stwórz zwięzłe streszczenie poniższego tekstu. Wyciągnij najważniejsze informacje i przedstaw je w punktach.
            
Tekst do streszczenia:
${text}`,

            jira: `Sformatuj poniższy tekst jako zadanie w systemie Jira. 
Struktura powinna zawierać:
1. Tytuł (zwięzły i konkretny)
2. Opis (szczegóły zadania)
3. Kryteria akceptacji (lista punktowa co musi zostać zrobione)
4. Priorytet (sugerowany na podstawie treści)

Tekst do sformatowania:
${text}`,

            note: `Stwórz czytelną, dobrze sformatowaną notatkę na podstawie poniższego tekstu. Użyj nagłówków, pogrubień i list punktowanych tam gdzie to poprawi czytelność. Zachowaj wszystkie istotne informacje.

Tekst do notatki:
${text}`,

            expansion: `Rozwiń poruszane w poniższym tekście zagadnienia. Dodaj brakujący kontekst, wyjaśnij trudniejsze pojęcia i zaproponuj kolejne kroki lub powiązane tematy, które warto rozważyć.

Tekst do rozwinięcia:
${text}`,

            dziennik: `Napisz zwięzły wpis(300-1200 znaków, dla lektora) w prywatnym dzienniku, oszczędny i perfekcyjny stylistycznie, bezbłędny, zaskakujący narracją i prowadzeniem słowa, niebanalny, nietuzinkowy, wciągający bez reszty i niestroniący od przekleństw i zaskakujących hiperbol. Bez żadnych znaków specjalnych.

Tekst bazowy:
${text}`,

            custom: `${customInstruction}
swgo 
Tekst do przetworzenia:
${text}`,

            default: `Popraw ortografię, gramatykę i interpunkcję w poniższym tekście. Zachowaj naturalny styl mówiony i znaczenie. Zdania muszą mieć sens, pomijaj nic nie wnoszące bezsensowne i wyrwane z kontekstu stwierdzenia. Odpowiedz TYLKO poprawionym tekstem, bez komentarzy.

Tekst do poprawy:
${text}`
        };

        return prompts[type] || prompts.default;
    }
}

module.exports = new ClaudeService();

