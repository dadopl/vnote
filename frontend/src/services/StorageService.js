// Storage Service - zarządza localStorage
export class StorageService {
    static KEYS = {
        DARK_MODE: 'darkMode',
        TRANSCRIPTION_MODE: 'transcriptionMode',
        SELECTED_DEVICE: 'selectedDeviceId',
        RAW_TEXT: 'rawText',
        CORRECTED_TEXT: 'correctedText',
        SESSION_HISTORY: 'sessionHistory',
        EMAIL_RECIPIENT: 'emailRecipient'
    };

    static get(key, defaultValue = null) {
        const value = localStorage.getItem(key);
        if (value === null) return defaultValue;

        // Try to parse as JSON
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }

    static set(key, value) {
        if (typeof value === 'object') {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            localStorage.setItem(key, value);
        }
    }

    static remove(key) {
        localStorage.removeItem(key);
    }

    static clear() {
        localStorage.clear();
    }

    // Specific getters/setters
    static getDarkMode() {
        return this.get(this.KEYS.DARK_MODE) === 'true';
    }

    static setDarkMode(value) {
        this.set(this.KEYS.DARK_MODE, value);
    }

    static getTranscriptionMode() {
        return this.get(this.KEYS.TRANSCRIPTION_MODE, 'webspeech');
    }

    static setTranscriptionMode(value) {
        this.set(this.KEYS.TRANSCRIPTION_MODE, value);
    }

    static getSelectedDevice() {
        return this.get(this.KEYS.SELECTED_DEVICE, '');
    }

    static setSelectedDevice(value) {
        this.set(this.KEYS.SELECTED_DEVICE, value);
    }

    static getRawText() {
        return this.get(this.KEYS.RAW_TEXT, '');
    }

    static setRawText(value) {
        this.set(this.KEYS.RAW_TEXT, value);
    }

    static getCorrectedText() {
        return this.get(this.KEYS.CORRECTED_TEXT, '');
    }

    static setCorrectedText(value) {
        this.set(this.KEYS.CORRECTED_TEXT, value);
    }

    static getSessionHistory() {
        return this.get(this.KEYS.SESSION_HISTORY, []);
    }

    static setSessionHistory(value) {
        this.set(this.KEYS.SESSION_HISTORY, value);
    }

    static addToSessionHistory(session) {
        const history = this.getSessionHistory();
        history.push(session);

        // Keep only last 50 sessions
        if (history.length > 50) {
            history.splice(0, history.length - 50);
        }

        this.setSessionHistory(history);
    }

    static clearSessionHistory() {
        this.remove(this.KEYS.SESSION_HISTORY);
    }

    static getEmailRecipient() {
        return this.get(this.KEYS.EMAIL_RECIPIENT, '');
    }

    static setEmailRecipient(value) {
        this.set(this.KEYS.EMAIL_RECIPIENT, value);
    }
}
