// Audio Service - zarządza nagrywaniem i strumieniami audio
export class AudioService {
    constructor() {
        this.audioStream = null;
        this.mediaRecorder = null;
        this.fullRecorder = null;
        this.audioChunksBuffer = [];
        this.fullRecordingChunks = [];
        this.whisperInterval = null;
    }

    async getAudioStream(deviceId = null) {
        const constraints = {
            audio: deviceId
                ? {
                    deviceId: { exact: deviceId },
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
                : true
        };

        this.audioStream = await navigator.mediaDevices.getUserMedia(constraints);
        return this.audioStream;
    }

    async getAudioDevices() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');

        return audioInputs.map(device => {
            const label = device.label || `Audio Input ${device.deviceId.substring(0, 8)}`;
            let deviceType = 'microphone';

            const lowerLabel = label.toLowerCase();
            if (lowerLabel.includes('line') || lowerLabel.includes('aux')) {
                deviceType = 'lineIn';
            } else if (lowerLabel.includes('virtual') || lowerLabel.includes('loopback') || lowerLabel.includes('cable')) {
                deviceType = 'virtual';
            }

            return {
                ...device,
                deviceType,
                displayLabel: label
            };
        });
    }

    stopStream() {
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
            this.audioStream = null;
        }
    }

    // Whisper Recording
    startWhisperRecording(onDataCallback) {
        if (!this.audioStream) {
            throw new Error('Audio stream nie jest dostępny');
        }

        this.mediaRecorder = new MediaRecorder(this.audioStream, {
            mimeType: 'audio/webm;codecs=opus'
        });

        this.audioChunksBuffer = [];

        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.audioChunksBuffer.push(event.data);
            }
        };

        this.mediaRecorder.onstop = async () => {
            if (this.audioChunksBuffer.length > 0) {
                const audioBlob = new Blob(this.audioChunksBuffer, { type: 'audio/webm;codecs=opus' });
                console.log(`Utworzono kompletny blob: ${audioBlob.size} bytes z ${this.audioChunksBuffer.length} chunków`);
                await onDataCallback(audioBlob);
                this.audioChunksBuffer = [];
            }
        };

        this.mediaRecorder.start();

        // Auto-stop every 5 seconds to create complete chunks
        this.whisperInterval = setInterval(() => {
            if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                this.mediaRecorder.stop();
            }
        }, 5000);
    }

    stopWhisperRecording() {
        if (this.whisperInterval) {
            clearInterval(this.whisperInterval);
            this.whisperInterval = null;
        }

        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
            this.mediaRecorder = null;
        }
    }

    // Full Recording
    startFullRecording() {
        if (!this.audioStream) {
            throw new Error('Nie można uzyskać dostępu do mikrofonu');
        }

        this.fullRecorder = new MediaRecorder(this.audioStream, {
            mimeType: 'audio/webm;codecs=opus'
        });

        this.fullRecordingChunks = [];

        this.fullRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.fullRecordingChunks.push(event.data);
            }
        };

        this.fullRecorder.start(1000);
        return this.fullRecorder;
    }

    stopFullRecording() {
        if (this.fullRecorder && this.fullRecorder.state !== 'inactive') {
            this.fullRecorder.stop();
        }
    }

    getFullRecordingBlob() {
        const audioBlob = new Blob(this.fullRecordingChunks, { type: 'audio/webm;codecs=opus' });
        this.fullRecordingChunks = [];
        return audioBlob;
    }

    getRecordingSize() {
        return this.fullRecordingChunks.reduce((total, chunk) => total + chunk.size, 0);
    }
}
