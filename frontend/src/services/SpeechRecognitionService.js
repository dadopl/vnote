// Speech Recognition Service
export class SpeechRecognitionService {
    constructor() {
        this.recognition = null;
        this.onResultCallback = null;
        this.onEndCallback = null;
        this.onErrorCallback = null;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            throw new Error('Twoja przeglądarka nie wspiera rozpoznawania mowy. Użyj Chrome lub Edge.');
        }

        this.recognition = new SpeechRecognition();

        // Na mobilnych urządzeniach ustawiamy bardziej konserwatywne opcje
        if (this.isMobile) {
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
        } else {
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
        }

        this.recognition.lang = 'pl-PL';
        this.recognition.maxAlternatives = 1;

        this.recognition.onresult = (event) => {
            if (this.onResultCallback) {
                this.onResultCallback(event);
            }
        };

        this.recognition.onend = () => {
            if (this.onEndCallback) {
                this.onEndCallback();
            }
        };

        this.recognition.onerror = (event) => {
            if (event.error !== 'no-speech' && event.error !== 'aborted') {
                if (this.onErrorCallback) {
                    this.onErrorCallback(event.error);
                }
            }
        };
    }

    start() {
        if (this.recognition) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting recognition:', error);
                if (this.onErrorCallback) {
                    this.onErrorCallback(error.message);
                }
            }
        }
    }

    stop() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    onResult(callback) {
        this.onResultCallback = callback;
    }

    onEnd(callback) {
        this.onEndCallback = callback;
    }

    onError(callback) {
        this.onErrorCallback = callback;
    }

    isAvailable() {
        return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }
}
