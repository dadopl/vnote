<template>
    <div class="min-h-screen transition-colors duration-300 bg-gray-50">
        <!-- Loading state while checking session -->
        <div v-if="checkingSession" class="flex items-center justify-center min-h-screen">
            <div class="text-gray-600">Loading...</div>
        </div>

        <!-- Login Modal -->
        <login-modal
            v-else-if="!isAuthenticated"
            :api-service="apiService"
            @login-success="onLoginSuccess"
        />

        <!-- Main App Content -->
        <div v-else id="app" class="w-full max-w-full px-4 py-8 mx-auto">
            <!-- Header -->
            <app-header
                :recordings-count="recordings.length"
                :current-user="currentUser"
                @language-change="onLanguageChange"
                @toggle-recordings="showRecordings = !showRecordings"
                @toggle-history="showHistory = !showHistory"
                @logout="handleLogout"
            />

            <!-- Server Status -->
            <server-status
                :server-status="serverStatus"
                :api-key-configured="apiKeyConfigured"
            />

            <!-- Audio Device Selection -->
            <audio-device-selector
                :audio-devices="audioDevices"
                v-model:selected-device-id="selectedDeviceId"
                @update:selected-device-id="changeAudioDevice"
            />

            <!-- Transcription Settings -->
            <transcription-settings
                v-model:correction-type="correctionType"
                v-model:custom-instruction="customCorrectionInstruction"
                :therapy-exchange-count="therapyExchangeCount"
                :therapy-history-length="therapyHistory.length"
                :therapy-audio-enabled="therapyAudioEnabled"
                @update:therapyAudioEnabled="therapyAudioEnabled = $event"
                @clear-therapy-history="clearTherapyHistory"
            />

            <!-- Status Indicators -->
            <status-indicators
                :dark-mode="darkMode"
                :is-listening="isListening"
                :word-count="wordCount"
                :chunk-size="chunkSize"
                :is-processing="isProcessing"
                :show-success="showSuccess"
            />

            <!-- Audio Visualization -->
            <audio-visualization
                v-show="isListening"
                ref="audioVisualization"
                :dark-mode="darkMode"
            />

            <!-- Control Buttons -->
            <control-buttons
                :server-status="serverStatus"
                :is-listening="isListening"
                :is-processing="isProcessing"
                :has-text="!!finalTranscript"
                :has-corrected-text="!!correctedText"
                v-model:enable-recording="enableRecording"
                :is-full-recording="isFullRecording"
                :recording-duration="recordingDuration"
                :recording-size="recordingSize"
                :diary-audios-count="diaryAudios.length"
                :total-notes="totalNotes"
                @toggle-listening="toggleListening"
                @send-to-ai="sendToAI"
                @clear-all="clearAll"
                @download-text="downloadText"
                @show-email-modal="showEmailModal = true"
                @toggle-diary-panel="showDiaryPanel = !showDiaryPanel"
                @toggle-notes-list="showNotesList = !showNotesList"
            />

            <!-- TTS Section -->
            <tts-section
                :corrected-text="correctedText"
                :voices="voices"
                v-model:selected-voice-id="selectedVoiceId"
                v-model:stability="ttsStability"
                v-model:similarity="ttsSimilarity"
                v-model:style="ttsStyle"
                :is-generating="isGeneratingAudio"
                @generate="generateAudio"
            />

            <!-- Therapy Audio Player -->
            <therapy-audio-player
                :audio="therapyAudio"
                :audio-url="therapyAudioUrl"
                :is-therapy-mode="correctionType === 'sesja'"
                :auto-play="true"
                @delete="deleteTherapyAudio"
            />

            <!-- Text Areas -->
            <text-areas
                :raw-text="finalTranscript"
                :interim-text="interimTranscript"
                v-model:corrected-text="correctedText"
            />

            <!-- History Panel -->
            <history-panel
                :dark-mode="darkMode"
                :show="showHistory"
                :current-type="correctionType"
                @load-note="loadNote"
            />

            <!-- Recordings Panel -->
            <recordings-panel
                :dark-mode="darkMode"
                :show="showRecordings"
                :recordings="recordings"
                @load-recordings="loadRecordings"
                @delete-recording="deleteRecording"
                @transcribe-recording="transcribeRecording"
                @download-recording="downloadRecording"
            />

            <!-- Diary Panel -->
            <diary-panel
                :dark-mode="darkMode"
                :show="showDiaryPanel"
                :audios="diaryAudios"
                :api-base-url="''"
                @close="showDiaryPanel = false"
                @delete-audio="deleteDiaryAudio"
                @download-audio="downloadDiaryAudio"
            />

            <!-- Notes List Modal -->
            <notes-list-modal
                :show="showNotesList"
                :notes="notes"
                :loading="loadingNotes"
                :pagination="notesPagination"
                :current-page="notesPage"
                @close="showNotesList = false"
                @load="loadNote"
                @delete="deleteNoteConfirm"
                @page-change="loadNotes"
            />

            <!-- Error Display -->
            <error-display :error="lastError" />

            <!-- Processing Log -->
            <processing-log :logs="processingLog" />

            <!-- Email Modal -->
            <email-modal
                :dark-mode="darkMode"
                :show="showEmailModal"
                :final-transcript="finalTranscript"
                :corrected-text="correctedText"
                :word-count="wordCount"
                :corrected-word-count="correctedWordCount"
                @close="showEmailModal = false"
            />
        </div>
    </div>
</template>

<script>
// Components
import AppHeader from './components/AppHeader.vue';
import ServerStatus from './components/ServerStatus.vue';
import AudioDeviceSelector from './components/AudioDeviceSelector.vue';
import TranscriptionSettings from './components/TranscriptionSettings.vue';
import AudioVisualization from './components/AudioVisualization.vue';
import StatusIndicators from './components/StatusIndicators.vue';
import ControlButtons from './components/ControlButtons.vue';
import TtsSection from './components/TtsSection.vue';
import TherapyAudioPlayer from './components/TherapyAudioPlayer.vue';
import TextAreas from './components/TextAreas.vue';
import EmailModal from './components/EmailModal.vue';
import RecordingsPanel from './components/RecordingsPanel.vue';
import HistoryPanel from './components/HistoryPanel.vue';
import DiaryPanel from './components/DiaryPanel.vue';
import NotesListModal from './components/NotesListModal.vue';
import ErrorDisplay from './components/ErrorDisplay.vue';
import ProcessingLog from './components/ProcessingLog.vue';
import LoginModal from './components/LoginModal.vue';

// Services
import { AudioService } from './services/AudioService.js';
import { ApiService } from './services/ApiService.js';
import { SpeechRecognitionService } from './services/SpeechRecognitionService.js';
import { StorageService } from './services/StorageService.js';

// i18n
import { i18nMixin } from './i18n/index.js';

export default {
    name: 'App',
    mixins: [i18nMixin],
    components: {
        AppHeader,
        ServerStatus,
        AudioDeviceSelector,
        TranscriptionSettings,
        AudioVisualization,
        StatusIndicators,
        ControlButtons,
        TtsSection,
        TherapyAudioPlayer,
        TextAreas,
        EmailModal,
        RecordingsPanel,
        HistoryPanel,
        DiaryPanel,
        NotesListModal,
        ErrorDisplay,
        ProcessingLog,
        LoginModal
    },
    data() {
        return {
            // Auth
            isAuthenticated: false,
            currentUser: null,
            checkingSession: true,

            // Theme
            darkMode: StorageService.getDarkMode(),

            // Server
            serverStatus: false,
            apiKeyConfigured: false,

            // Speech Recognition
            isListening: false,

            // Audio Device
            audioDevices: [],
            selectedDeviceId: StorageService.getSelectedDevice(),


            // Full Recording
            isFullRecording: false,
            enableRecording: false,
            recordingStartTime: null,
            recordingDuration: 0,
            recordingTimer: null,
            recordingSize: 0,
            recordings: [],
            showRecordings: false,

            // Text
            finalTranscript: StorageService.getRawText(),
            interimTranscript: '',
            correctedText: StorageService.getCorrectedText(),

            // Status
            isProcessing: false,
            showSuccess: false,
            lastError: '',
            processingLog: [],

            // Correction Options
            correctionType: 'default',
            customCorrectionInstruction: '',

            // History
            showHistory: false,
            sessionHistory: StorageService.getSessionHistory(),

            // Settings
            chunkSize: 50,
            autoSaveInterval: null,

            // Note management
            currentNoteId: null,

            // Email Modal
            showEmailModal: false,

            // TTS
            voices: [],
            selectedVoiceId: null,
            isGeneratingAudio: false,
            diaryAudios: [],
            showDiaryPanel: false,
            ttsStability: 0.5,
            ttsSimilarity: 0.75,
            ttsStyle: 0.0,

            // Notes list
            showNotesList: false,
            notes: [],
            notesPage: 1,
            notesLimit: 20,
            notesPagination: null,
            totalNotes: 0,
            loadingNotes: false,

            // Therapy session
            therapyHistory: [],
            therapyExchangeCount: 10,
            therapyAudio: null,
            therapyAudioPlaying: false,
            therapyAudioEnabled: false,

            // Services
            audioService: null,
            apiService: null,
            speechService: null
        };
    },
    computed: {
        wordCount() {
            return this.finalTranscript.trim().split(/\s+/).filter(w => w.length > 0).length;
        },
        correctedWordCount() {
            return this.correctedText.trim().split(/\s+/).filter(w => w.length > 0).length;
        },
        isMobileDevice() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        therapyAudioUrl() {
            if (this.therapyAudio && this.therapyAudio.filename) {
                return this.apiService.getPiperAudioUrl(this.therapyAudio.filename);
            }
            return null;
        }
    },
    watch: {
        wordCount(newCount) {
            if (newCount > 0 && newCount % this.chunkSize === 0 && !this.isProcessing && this.serverStatus) {
                this.sendToAI();
            }
        },
        darkMode(newVal) {
            StorageService.setDarkMode(newVal);
        },
        showNotesList(newVal) {
            if (newVal) {
                this.loadNotes(1);
            }
        },
        currentLanguage(newVal) {
            StorageService.setLanguage(newVal);
            this.loadVoices();
        },
        therapyAudioEnabled(newVal) {
            localStorage.setItem('therapyAudioEnabled', newVal);
        }
    },
    async mounted() {
        // Initialize API service first (needed for login)
        this.apiService = new ApiService();

        // Check session
        try {
            const session = await this.apiService.checkSession();
            if (session.authenticated) {
                this.isAuthenticated = true;
                this.currentUser = session.user;
                await this.initializeApp();
            }
        } catch (error) {
            console.error('Session check failed:', error);
        } finally {
            this.checkingSession = false;
        }
    },
    beforeUnmount() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        if (this.audioService) {
            this.audioService.stopStream();
        }
    },
    methods: {
        async initializeApp() {
            // Initialize other services
            this.audioService = new AudioService();
            this.speechService = new SpeechRecognitionService();

            await this.checkServerStatus();
            await this.loadAudioDevices();
            await this.loadRecordings();
            this.initSpeechRecognition();
            this.startAutoSave();
            await this.loadVoices();
            await this.loadDiaryAudios();
            await this.loadNotes(1);

            // Load therapy history from localStorage
            const savedTherapyHistory = localStorage.getItem('therapyHistory');
            if (savedTherapyHistory) {
                try {
                    this.therapyHistory = JSON.parse(savedTherapyHistory);
                } catch (e) {
                    console.error('Error loading therapy history:', e);
                    this.therapyHistory = [];
                }
            }

            // Load therapy audio enabled setting from localStorage
            const savedTherapyAudioEnabled = localStorage.getItem('therapyAudioEnabled');
            if (savedTherapyAudioEnabled !== null) {
                this.therapyAudioEnabled = savedTherapyAudioEnabled === 'true';
            }
        },

        async onLoginSuccess(user) {
            this.isAuthenticated = true;
            this.currentUser = user;
            await this.initializeApp();
        },

        async handleLogout() {
            try {
                await this.apiService.logout();
            } catch (error) {
                console.error('Logout error:', error);
            }
            this.isAuthenticated = false;
            this.currentUser = null;
            if (this.autoSaveInterval) {
                clearInterval(this.autoSaveInterval);
            }
            if (this.audioService) {
                this.audioService.stopStream();
            }
        },

        onLanguageChange(lang) {
            this.currentLanguage = lang;
            StorageService.setLanguage(lang);
        },

        async checkServerStatus() {
            try {
                const data = await this.apiService.checkHealth();
                this.serverStatus = true;
                this.apiKeyConfigured = data.hasApiKey;
                this.lastError = '';
            } catch (error) {
                this.serverStatus = false;
                this.lastError = this.t('errors.cannotConnect');
            }
        },

        async loadAudioDevices() {
            try {
                this.audioDevices = await this.audioService.getAudioDevices();
            } catch (error) {
                console.error('Error loading audio devices:', error);
            }
        },

        async changeAudioDevice() {
            StorageService.setSelectedDevice(this.selectedDeviceId);

            if (this.isListening) {
                await this.toggleListening();
                await this.$nextTick();
                await this.toggleListening();
            }
        },

        initSpeechRecognition() {
            if (!this.speechService.isAvailable()) {
                this.lastError = this.t('errors.speechNotSupported');
                return;
            }

            this.speechService.init();

            this.speechService.onResult((event) => {
                let interim = '';
                let final = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;

                    if (event.results[i].isFinal) {
                        final += transcript + ' ';
                    } else {
                        interim += transcript;
                    }
                }

                if (final) {
                    this.finalTranscript += final;
                    StorageService.setRawText(this.finalTranscript);
                }

                this.interimTranscript = interim;
            });

            this.speechService.onEnd(() => {
                if (this.isListening && this.transcriptionMode === 'webspeech') {
                    try {
                        setTimeout(() => {
                            this.speechService.start();
                        }, 100);
                    } catch (e) {
                        console.error('Restart error:', e);
                    }
                }
            });

            this.speechService.onError((error) => {
                this.lastError = `Błąd rozpoznawania: ${error}`;
                console.error('Speech recognition error:', error);
            });
        },

        async toggleListening() {
            if (this.isListening) {
                // Stop
                this.speechService.stop();

                // Stop full recording if enabled
                if (this.enableRecording && this.isFullRecording) {
                    await this.stopFullRecording();
                }

                if (this.$refs.audioVisualization) {
                    this.$refs.audioVisualization.stop();
                }
                this.audioService.stopStream();
                this.isListening = false;

            } else {
                // Start
                this.lastError = '';

                try {
                    const audioStream = await this.audioService.getAudioStream(this.selectedDeviceId);

                    if (this.$refs.audioVisualization) {
                        await this.$refs.audioVisualization.start(audioStream);
                    }

                    // Start full recording if enabled
                    if (this.enableRecording) {
                        await this.startFullRecording();
                    }

                    try {
                        this.speechService.start();
                        this.isListening = true;
                    } catch (e) {
                        this.lastError = this.t('errors.cannotStartRecognition');
                    }
                } catch (error) {
                    console.error('Error getting audio stream:', error);

                    let errorMessage = '';
                    if (error.name === 'NotFoundError') {
                        errorMessage = `Audio device not found. Selected device may have been disconnected.`;
                    } else if (error.name === 'NotAllowedError') {
                        errorMessage = `Microphone access denied. Please allow access in browser settings.`;
                    } else if (error.name === 'OverconstrainedError') {
                        errorMessage = `Selected audio device cannot be used. Device: ${this.selectedDeviceId}. Error: ${error.constraint || 'unknown'}`;
                    } else if (error.name === 'NotReadableError') {
                        errorMessage = `Audio device is busy or cannot be accessed. It may be used by another application.`;
                    } else {
                        errorMessage = `Failed to access audio device: ${error.message}`;
                    }

                    this.lastError = errorMessage;
                    alert(errorMessage);
                }
            }
        },


        async startFullRecording() {
            try {
                this.recordingStartTime = Date.now();
                this.recordingDuration = 0;
                this.recordingSize = 0;

                const recorder = this.audioService.startFullRecording();

                recorder.onstop = async () => {
                    if (this.audioService.fullRecordingChunks.length > 0) {
                        await this.saveRecording();
                    }
                };

                this.isFullRecording = true;

                this.recordingTimer = setInterval(() => {
                    if (this.recordingStartTime) {
                        this.recordingDuration = Math.floor((Date.now() - this.recordingStartTime) / 1000);
                        this.recordingSize = this.audioService.getRecordingSize();
                    }
                }, 1000);

            } catch (error) {
                console.error('Error starting full recording:', error);
                this.lastError = this.t('errors.recordingError') + ' ' + error.message;
            }
        },

        async stopFullRecording() {
            if (this.recordingTimer) {
                clearInterval(this.recordingTimer);
                this.recordingTimer = null;
            }

            this.audioService.stopFullRecording();
            this.isFullRecording = false;
        },

        async saveRecording() {
            try {
                const noteId = await this.ensureNoteExists('recording');

                const audioBlob = this.audioService.getFullRecordingBlob();
                console.log(`Zapisuję nagranie: ${audioBlob.size} bytes, ${this.recordingDuration}s`);

                const data = await this.apiService.saveRecording(
                    audioBlob,
                    `Nagranie ${new Date().toLocaleString('pl-PL')}`,
                    this.recordingDuration,
                    noteId
                );

                console.log('Nagranie zapisane:', data.recording);
                await this.loadRecordings();

                this.showSuccess = true;
                setTimeout(() => {
                    this.showSuccess = false;
                }, 2000);

            } catch (error) {
                console.error('Error saving recording:', error);
                this.lastError = this.t('errors.savingError') + ' ' + error.message;
            } finally {
                this.recordingSize = 0;
                this.recordingDuration = 0;
                this.recordingStartTime = null;
            }
        },

        async loadRecordings() {
            try {
                const data = await this.apiService.getRecordings();
                this.recordings = data.recordings || [];
            } catch (error) {
                console.error('Error loading recordings:', error);
            }
        },

        async deleteRecording(id) {
            if (!confirm(this.t('recordingsPanel.deleteConfirm'))) {
                return;
            }

            try {
                await this.apiService.deleteRecording(id);
                await this.loadRecordings();
            } catch (error) {
                console.error('Error deleting recording:', error);
                this.lastError = this.t('errors.deletingError') + ' ' + error.message;
            }
        },

        async transcribeRecording(id) {
            try {
                const recording = this.recordings.find(r => r.id === id);
                if (!recording) {
                    throw new Error('Nagranie nie znalezione');
                }

                recording.transcribing = true;
                console.log(`Rozpoczynam transkrypcję nagrania ${id}...`);

                const audioBlob = await this.apiService.getRecordingBlob(id);
                console.log(`Pobrano nagranie: ${audioBlob.size} bytes`);

                const data = await this.apiService.transcribe(audioBlob);
                console.log(`Transkrypcja zakończona: ${data.text?.length || 0} znaków`);

                if (data.text && data.text.trim()) {
                    if (this.finalTranscript) {
                        this.finalTranscript += '\n\n--- Transkrypcja z nagrania ---\n\n';
                    }
                    this.finalTranscript += data.text;

                    this.showSuccess = true;
                    setTimeout(() => {
                        this.showSuccess = false;
                    }, 2000);
                } else {
                    this.lastError = this.t('errors.noTextRecognized');
                }

            } catch (error) {
                console.error('Error transcribing recording:', error);
                this.lastError = this.t('errors.transcriptionError') + ' ' + error.message;
            } finally {
                this.loadRecordings();
            }
        },

        async loadVoices() {
            try {
                const response = await this.apiService.getVoices(this.currentLanguage);
                this.voices = response.voices || [];

                if (this.voices.length > 0 && !this.selectedVoiceId) {
                    const multilingual = this.voices.find(v =>
                        v.labels && (v.labels.use_case === 'narration' || v.name.includes('Antoni'))
                    );
                    this.selectedVoiceId = multilingual ? multilingual.voice_id : this.voices[0].voice_id;
                }
            } catch (error) {
                console.error('Error loading voices:', error);
                this.lastError = this.t('errors.voicesError') + ' ' + error.message;
            }
        },

        async loadDiaryAudios() {
            try {
                const response = await this.apiService.getDiaryAudios();
                this.diaryAudios = response.audios || [];
            } catch (error) {
                console.error('Error loading diary audios:', error);
            }
        },

        async generateAudio() {
            if (this.isGeneratingAudio || !this.correctedText || !this.selectedVoiceId) {
                return;
            }

            if (this.correctedText.length > 2000) {
                this.lastError = this.t('tts.textTooLong');
                return;
            }

            this.isGeneratingAudio = true;
            this.lastError = '';

            try {
                const noteId = await this.ensureNoteExists('dziennik');

                const response = await this.apiService.generateAudio(
                    this.correctedText,
                    this.selectedVoiceId,
                    noteId,
                    {
                        stability: this.ttsStability,
                        similarity_boost: this.ttsSimilarity,
                        style: this.ttsStyle
                    },
                    this.currentLanguage
                );

                if (response.success) {
                    await this.loadDiaryAudios();

                    this.showSuccess = true;
                    setTimeout(() => {
                        this.showSuccess = false;
                    }, 2000);

                    this.processingLog.push(`${this.t('processingLog.audioGenerated')} ${response.audio.voice_name}`);
                }
            } catch (error) {
                console.error('Error generating audio:', error);
                this.lastError = error.message || this.t('errors.audioError');
            } finally {
                this.isGeneratingAudio = false;
            }
        },

        async deleteDiaryAudio(audioId) {
            if (!confirm('Czy na pewno chcesz usunąć to audio?')) {
                return;
            }

            try {
                await this.apiService.deleteDiaryAudio(audioId);
                await this.loadDiaryAudios();
            } catch (error) {
                console.error('Error deleting audio:', error);
                this.lastError = this.t('errors.deletingAudioError') + ' ' + error.message;
            }
        },

        downloadDiaryAudio(audio) {
            const url = this.apiService.getDiaryAudioUrl(audio.id);
            const link = document.createElement('a');
            link.href = url;
            link.download = `tts_${audio.id}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        async ensureNoteExists(type = 'default') {
            try {
                const response = await this.apiService.saveNote(
                    this.currentNoteId,
                    this.finalTranscript,
                    this.correctedText,
                    type
                );

                this.currentNoteId = response.noteId;
                return this.currentNoteId;
            } catch (error) {
                console.error('Error ensuring note exists:', error);
                throw error;
            }
        },

        async loadNotes(page = 1) {
            this.loadingNotes = true;
            try {
                const response = await this.apiService.getNotes(page, this.notesLimit);
                this.notes = response.notes;
                this.notesPagination = response.pagination;
                this.notesPage = page;
                this.totalNotes = response.pagination.total;
            } catch (error) {
                console.error('Error loading notes:', error);
                this.lastError = this.t('errors.loadingNotesError') + ' ' + error.message;
            } finally {
                this.loadingNotes = false;
            }
        },

        async loadNote(id) {
            try {
                const response = await this.apiService.getNote(id);
                const note = response.note;

                this.finalTranscript = note.rawText || '';
                this.correctedText = note.transformedText || '';
                this.currentNoteId = note.id;
                this.correctionType = note.type || 'default';

                this.showNotesList = false;
                this.showHistory = false;

                window.scrollTo({ top: 0, behavior: 'smooth' });

                this.showSuccess = true;
                setTimeout(() => {
                    this.showSuccess = false;
                }, 2000);
            } catch (error) {
                console.error('Error loading note:', error);
                this.lastError = this.t('errors.loadingNoteError') + ' ' + error.message;
            }
        },

        async deleteNoteConfirm(id) {
            if (!confirm(this.t('notes.deleteConfirm'))) {
                return;
            }

            try {
                await this.apiService.deleteNote(id);
                await this.loadNotes(this.notesPage);

                this.showSuccess = true;
                setTimeout(() => {
                    this.showSuccess = false;
                }, 2000);
            } catch (error) {
                console.error('Error deleting note:', error);
                this.lastError = this.t('errors.deletingNoteError') + ' ' + error.message;
            }
        },

        async startAutoSave() {
            this.autoSaveInterval = setInterval(async () => {
                if (this.finalTranscript) {
                    StorageService.setRawText(this.finalTranscript);
                }
                if (this.correctedText) {
                    StorageService.setCorrectedText(this.correctedText);
                }

                if ((this.finalTranscript || this.correctedText) && this.serverStatus) {
                    try {
                        await this.ensureNoteExists(this.correctionType);
                        console.log('Note zapisana/zaktualizowana, ID:', this.currentNoteId);
                    } catch (error) {
                        console.error('Błąd zapisu notatki:', error);
                    }
                }
            }, 30000);
        },

        async loadSession(session) {
            this.finalTranscript = session.rawText;
            this.correctedText = session.correctedText;
            this.transcriptionMode = session.transcriptionMode;
            this.enableRecording = session.enableRecording;
            this.selectedDeviceId = session.selectedDeviceId;

            await this.loadRecordings();

            this.showSuccess = true;
            setTimeout(() => {
                this.showSuccess = false;
            }, 2000);
        },

        async sendToAI() {
            if (!this.finalTranscript || this.isProcessing) return;

            this.isProcessing = true;
            this.lastError = '';

            try {
                let requestData = {
                    text: this.finalTranscript,
                    type: this.correctionType,
                    language: this.currentLanguage
                };

                if (this.correctionType === 'sesja') {
                    const recentHistory = this.therapyHistory.slice(-this.therapyExchangeCount);
                    requestData.conversationHistory = recentHistory;
                }

                if (this.correctionType === 'custom') {
                    requestData.customInstruction = this.customCorrectionInstruction;
                }

                const data = await this.apiService.correctText(requestData);

                if (this.correctionType === 'sesja') {
                    this.therapyHistory.push({
                        client: this.finalTranscript,
                        therapist: data.correctedText
                    });

                    localStorage.setItem('therapyHistory', JSON.stringify(this.therapyHistory));

                    this.finalTranscript = '';
                    StorageService.setRawText('');

                    if (this.therapyAudioEnabled) {
                        this.generateTherapyAudio(data.correctedText);
                    }
                }

                this.correctedText = data.correctedText;

                const session = {
                    id: Date.now(),
                    rawText: this.correctionType === 'sesja' ? '' : this.finalTranscript,
                    correctedText: this.correctedText,
                    timestamp: new Date().toISOString(),
                    correctionType: this.correctionType
                };
                this.sessionHistory.unshift(session);
                if (this.sessionHistory.length > 10) {
                    this.sessionHistory = this.sessionHistory.slice(0, 10);
                }
                StorageService.setSessionHistory(this.sessionHistory);

                this.showSuccess = true;
                setTimeout(() => {
                    this.showSuccess = false;
                }, 2000);

                this.processingLog.push(`${this.t('status.processing')} ${new Date().toLocaleTimeString(this.currentLanguage === 'pl' ? 'pl-PL' : 'en-US')}`);

            } catch (error) {
                this.lastError = this.t('errors.serverError') + ' ' + error.message;
            } finally {
                this.isProcessing = false;
            }
        },

        clearTherapyHistory() {
            if (confirm(this.t('therapy.clearHistory') + '?')) {
                this.therapyHistory = [];
                this.therapyAudio = null;
                localStorage.removeItem('therapyHistory');
                this.showSuccess = true;
                setTimeout(() => {
                    this.showSuccess = false;
                }, 2000);
            }
        },

        async generateTherapyAudio(text) {
            try {
                const voice = this.currentLanguage === 'pl' ? 'pl_PL-gosia-medium' : 'en_US-lessac-medium';
                const audio = await this.apiService.generatePiperAudio(text, voice);

                if (audio) {
                    this.therapyAudio = audio;
                }
            } catch (error) {
                console.error('Error generating therapy audio:', error);
            }
        },

        async deleteTherapyAudio() {
            if (!this.therapyAudio) return;

            try {
                await this.apiService.deletePiperAudio(this.therapyAudio.filename);
                this.therapyAudio = null;
                this.therapyAudioPlaying = false;
            } catch (error) {
                console.error('Error deleting therapy audio:', error);
                this.lastError = error.message;
            }
        },

        clearAll() {
            if (!confirm('Czy na pewno chcesz wyczyścić całą treść?')) {
                return;
            }

            this.finalTranscript = '';
            this.interimTranscript = '';
            this.correctedText = '';
            this.lastError = '';
            this.currentNoteId = null;

            StorageService.setRawText('');
            StorageService.setCorrectedText('');
        },

        downloadText() {
            if (!this.correctedText) return;

            const blob = new Blob([this.correctedText], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `notatka_${new Date().toISOString().slice(0, 10)}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        },

        downloadRecording(recording) {
            const url = `${this.apiService.baseUrl}/api/recordings/${recording.id}`;
            const link = document.createElement('a');
            link.href = url;
            link.download = recording.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        clearHistory() {
            this.sessionHistory = [];
            StorageService.setSessionHistory(this.sessionHistory);
        }
    }
};
</script>

<style>
/* Custom styles if needed */
</style>
