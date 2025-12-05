<template>
    <div class="min-h-screen transition-colors duration-300 bg-gray-50">
    <div id="app" class="w-full max-w-full px-4 py-8 mx-auto">
        <!-- Header -->
        <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 class="text-3xl md:text-4xl font-bold mb-2 text-slate-800">{{ t('header.title') }}</h1>
                <p class="text-slate-600">{{ t('header.subtitle') }}</p>
            </div>
            <div class="flex gap-3 items-center">
                <!-- Language Selector -->
                <select
                    v-model="currentLanguage"
                    @change="onLanguageChange"
                    class="px-3 py-2 rounded-lg font-semibold transition-all shadow-sm bg-white border border-slate-300 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                    <option value="en">🇬🇧 EN</option>
                    <option value="pl">🇵🇱 PL</option>
                </select>
                <button
                        @click="showRecordings = !showRecordings"
                        class="px-4 py-2 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md bg-slate-700 hover:bg-slate-800 text-white"
                >
                    {{ t('nav.recordings') }} ({{ recordings.length }})
                </button>
                <button
                        @click="showHistory = !showHistory"
                        class="px-4 py-2 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md bg-slate-700 hover:bg-slate-800 text-white"
                >
                    {{ t('nav.history') }}
                </button>
            </div>
        </div>

        <!-- Server Status -->
        <div class="rounded-lg p-4 mb-6 shadow-sm bg-white">
            <div class="flex items-center gap-3 flex-wrap">
                <div
                        class="w-3 h-3 rounded-full"
                        :class="serverStatus ? 'bg-green-500' : 'bg-red-500'"
                ></div>
                <span class="text-sm text-slate-700">
                        {{ t('server.label') }}: {{ serverStatus ? t('server.connected') : t('server.disconnected') }}
                    </span>
                <span v-if="serverStatus && !apiKeyConfigured" class="text-yellow-600 text-sm">
                        {{ t('server.noApiKey') }}
                    </span>
            </div>
        </div>

        <!-- Audio Device Selection -->
        <div class="rounded-lg p-4 mb-6 shadow-sm bg-white">
            <label class="block text-sm font-semibold mb-2 text-slate-700">{{ t('audioDevice.label') }}</label>
            <select
                    v-model="selectedDeviceId"
                    @change="changeAudioDevice"
                    class="w-full md:w-auto px-4 py-2 rounded-lg transition-colors bg-gray-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
                <option value="">{{ t('audioDevice.default') }}</option>
                <option v-for="device in audioDevices" :key="device.deviceId" :value="device.deviceId">
                    {{ device.label || `${t('audioDevice.microphoneNumber')} ${audioDevices.indexOf(device) + 1}` }}
                </option>
            </select>
        </div>

        <!-- Transcription Mode Selection -->
        <div class="rounded-lg p-4 mb-6 shadow-sm bg-white">
            <label class="block text-sm font-semibold mb-3 text-slate-700">{{ t('transcription.label') }}</label>

            <!-- Mobile warning -->
            <div v-if="isMobileDevice && transcriptionMode === 'webspeech'" class="mb-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p class="text-sm text-yellow-800">
                    <strong>{{ t('transcription.mobileWarning') }}</strong><br>
                    {{ t('transcription.mobileWarningText') }}
                </p>
            </div>

            <div class="flex gap-3 flex-wrap mb-4">
                <button
                        @click="transcriptionMode = 'webspeech'"
                        class="px-4 py-2 rounded-lg font-semibold transition-all shadow-sm"
                        :class="transcriptionMode === 'webspeech'
                            ? 'bg-slate-700 text-white shadow-md'
                            : 'bg-gray-100 text-slate-600 hover:bg-gray-200'"
                >
                    {{ t('transcription.webSpeech') }}
                </button>
                <button
                        @click="transcriptionMode = 'whisper'"
                        class="px-4 py-2 rounded-lg font-semibold transition-all shadow-sm"
                        :class="transcriptionMode === 'whisper'
                            ? 'bg-slate-700 text-white shadow-md'
                            : 'bg-gray-100 text-slate-600 hover:bg-gray-200'"
                        :disabled="!whisperAvailable"
                >
                    {{ t('transcription.whisper') }} {{ whisperAvailable ? t('transcription.whisperAvailable') : t('transcription.whisperUnavailable') }}
                </button>
            </div>

            <!-- Correction Type Selection -->
            <div class="mt-4 pt-4 border-t" :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
                <label class="block text-sm font-semibold mb-2">{{ t('correction.label') }}</label>
                <div class="flex flex-col gap-3">
                    <select 
                        v-model="correctionType"
                        class="w-full md:w-auto px-4 py-2 rounded-lg transition-colors bg-gray-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                        <option value="default">{{ t('correction.types.default') }}</option>
                        <option value="summary">{{ t('correction.types.summary') }}</option>
                        <option value="jira">{{ t('correction.types.jira') }}</option>
                        <option value="note">{{ t('correction.types.note') }}</option>
                        <option value="expansion">{{ t('correction.types.expansion') }}</option>
                        <option value="dziennik">{{ t('correction.types.dziennik') }}</option>
                        <option value="sesja">{{ t('correction.types.sesja') }}</option>
                        <option value="custom">{{ t('correction.types.custom') }}</option>
                    </select>

                    <!-- Therapy session info -->
                    <div v-if="correctionType === 'sesja'" class="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p class="text-sm text-blue-800 mb-2">
                            <strong>{{ t('therapy.title') }}</strong><br>
                            {{ t('therapy.description') }}
                        </p>
                        <div class="flex items-center gap-3 text-xs text-blue-700">
                            <span>{{ t('therapy.context') }} {{ therapyExchangeCount }} {{ t('therapy.exchanges') }}</span>
                            <span>•</span>
                            <span>{{ t('therapy.history') }} {{ therapyHistory.length }} {{ t('therapy.exchanges') }}</span>
                            <button
                                v-if="therapyHistory.length > 0"
                                @click="clearTherapyHistory"
                                class="ml-auto px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-xs font-semibold transition-colors"
                            >
                                {{ t('therapy.clearHistory') }}
                            </button>
                        </div>
                    </div>

                    <!-- Custom instruction input -->
                    <div v-if="correctionType === 'custom'" class="animate-fade-in">
                        <input 
                            type="text" 
                            v-model="customCorrectionInstruction"
                            :placeholder="t('correction.customPlaceholder')"
                            class="w-full px-4 py-2 rounded-lg transition-colors bg-gray-50 text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                        >
                    </div>
                </div>
            </div>
        </div>

        <!-- Status Indicators Component -->
        <status-indicators
                :dark-mode="darkMode"
                :is-listening="isListening"
                :word-count="wordCount"
                :chunk-size="chunkSize"
                :is-processing="isProcessing"
                :is-whisper-processing="isWhisperProcessing"
                :show-success="showSuccess"
        />

        <!-- Audio Visualization Component -->
        <audio-visualization
                v-show="isListening"
                ref="audioVisualization"
                :dark-mode="darkMode"
        />

        <!-- Controls -->
        <div class="mb-6">
            <!-- Recording Checkbox -->
            <div class="mb-4 p-3 rounded-lg border" :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'">
                <div class="flex items-center gap-3">
                    <label class="flex items-center gap-3 cursor-pointer flex-1">
                        <input
                                type="checkbox"
                                v-model="enableRecording"
                                class="w-5 h-5 rounded"
                                :disabled="isListening"
                        >
                        <span class="flex-1">
                                <span class="font-semibold block">{{ t('recording.enableLabel') }}</span>
                                <span class="text-xs mt-1 block" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
                                    {{ t('recording.enableDescription') }}
                                </span>
                            </span>
                    </label>
                    <div v-if="isFullRecording" class="flex items-center gap-3 flex-shrink-0">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span class="text-sm font-mono">{{ formatDuration(recordingDuration) }}</span>
                        </div>
                        <span class="text-xs" :class="darkMode ? 'text-gray-400' : 'text-gray-600'">
                                {{ formatSize(recordingSize) }}
                            </span>
                    </div>
                </div>
            </div>

            <!-- Control Buttons -->
            <div class="flex gap-3 flex-wrap">
                <button
                        @click="toggleListening"
                        :disabled="!serverStatus"
                        class="px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 text-white"
                        :class="isListening
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed'"
                >
                    <span v-if="isListening">{{ t('buttons.stop') }}</span>
                    <span v-else>{{ t('buttons.start') }}</span>
                </button>

                <button
                        @click="sendToAI"
                        :disabled="!finalTranscript || isProcessing || !serverStatus"
                        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors text-white"
                >
                    {{ t('buttons.sendToAI') }}
                </button>

                <button
                        @click="clearAll"
                        class="px-6 py-3 rounded-lg font-semibold transition-colors text-white"
                        :class="darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-700'"
                >
                    {{ t('buttons.clear') }}
                </button>

                <button
                        @click="downloadText"
                        :disabled="!correctedText"
                        class="px-6 py-3 bg-slate-700 hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md text-white"
                >
                    {{ t('buttons.downloadTxt') }}
                </button>

                <button
                        @click="showEmailModal = true"
                        :disabled="!finalTranscript && !correctedText"
                        class="px-6 py-3 bg-slate-700 hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md text-white"
                >
                    {{ t('buttons.sendEmail') }}
                </button>

                <button
                        @click="showDiaryPanel = !showDiaryPanel"
                        class="px-6 py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md text-white bg-slate-700 hover:bg-slate-800"
                >
                    {{ t('nav.diaryAudio') }} ({{ diaryAudios.length }})
                </button>

                <button
                        @click="showNotesList = !showNotesList"
                        class="px-6 py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md text-white bg-slate-700 hover:bg-slate-800"
                >
                    {{ t('nav.allNotes') }} ({{ totalNotes }})
                </button>
            </div>
        </div>

        <!-- TTS Section -->
        <div v-if="correctedText" class="mb-6 rounded-lg p-4 shadow-sm border" :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
            <h3 class="text-lg font-semibold mb-4">{{ t('tts.title') }}</h3>

            <div class="flex flex-col md:flex-row gap-3 items-start md:items-end">
                <!-- Voice Selection -->
                <div class="flex-1 w-full">
                    <label class="block text-sm font-semibold mb-2">{{ t('tts.selectVoice') }}</label>
                    <select
                        v-model="selectedVoiceId"
                        class="w-full px-4 py-2 rounded-lg border transition-colors"
                        :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
                        :disabled="isGeneratingAudio || voices.length === 0"
                    >
                        <option value="" disabled>{{ voices.length === 0 ? t('tts.loadingVoices') : t('tts.chooseVoice') }}</option>
                        <option v-for="voice in voices" :key="voice.voice_id" :value="voice.voice_id">
                            {{ voice.name }} {{ voice.labels && voice.labels.accent ? `(${voice.labels.accent})` : '' }}
                        </option>
                    </select>
                </div>

                <!-- TTS Voice Settings -->
                <div class="flex flex-col gap-3 mt-3">
                    <div>
                        <label class="text-xs font-semibold">{{ t('tts.stability') }}: {{ ttsStability.toFixed(2) }}</label>
                        <input type="range" v-model.number="ttsStability" min="0" max="1" step="0.01"
                               class="w-full h-2 rounded-lg appearance-none cursor-pointer"
                               :class="darkMode ? 'bg-gray-700' : 'bg-gray-300'">
                        <span class="text-xs" :class="darkMode ? 'text-gray-400' : 'text-gray-600'">{{ t('tts.stabilityHint') }}</span>
                    </div>
                    <div>
                        <label class="text-xs font-semibold">{{ t('tts.similarity') }}: {{ ttsSimilarity.toFixed(2) }}</label>
                        <input type="range" v-model.number="ttsSimilarity" min="0" max="1" step="0.01"
                               class="w-full h-2 rounded-lg appearance-none cursor-pointer"
                               :class="darkMode ? 'bg-gray-700' : 'bg-gray-300'">
                        <span class="text-xs" :class="darkMode ? 'text-gray-400' : 'text-gray-600'">{{ t('tts.similarityHint') }}</span>
                    </div>
                    <div>
                        <label class="text-xs font-semibold">{{ t('tts.style') }}: {{ ttsStyle.toFixed(2) }}</label>
                        <input type="range" v-model.number="ttsStyle" min="0" max="1" step="0.01"
                               class="w-full h-2 rounded-lg appearance-none cursor-pointer"
                               :class="darkMode ? 'bg-gray-700' : 'bg-gray-300'">
                        <span class="text-xs" :class="darkMode ? 'text-gray-400' : 'text-gray-600'">{{ t('tts.styleHint') }}</span>
                    </div>
                </div>

                <!-- Character Counter -->
                <div class="text-sm mt-3" :class="correctedText.length > 2000 ? 'text-red-500 font-bold' : (darkMode ? 'text-gray-400' : 'text-gray-600')">
                    {{ correctedText.length }} / 2000 {{ t('tts.characters') }}
                </div>

                <!-- Generate Button -->
                <button
                        @click="generateAudio"
                        :disabled="!correctedText || !selectedVoiceId || correctedText.length > 2000 || isGeneratingAudio"
                        class="px-6 py-2 bg-slate-700 hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md text-white whitespace-nowrap"
                >
                    <span v-if="isGeneratingAudio">{{ t('tts.generating') }}</span>
                    <span v-else>{{ t('tts.generateAudio') }}</span>
                </button>
            </div>

            <!-- Warning message -->
            <p v-if="correctedText.length > 2000" class="mt-3 text-sm text-red-500">
                {{ t('tts.textTooLong') }}
            </p>
        </div>

        <!-- Text Areas -->
        <div class="grid lg:grid-cols-2 gap-6 mb-6">
            <!-- Raw Text -->
            <div class="rounded-lg p-4 shadow-sm bg-white">
                <div class="flex justify-between items-center mb-3">
                    <h2 class="text-xl font-semibold text-slate-800">{{ t('textAreas.rawText') }}</h2>
                    <span class="text-sm text-slate-600">{{ wordCount }} {{ t('textAreas.words') }}</span>
                </div>
                <div class="relative">
                    <div
                            id="rawTextDisplay"
                            class="w-full h-96 rounded p-3 resize-none font-mono text-sm overflow-y-auto whitespace-pre-wrap bg-gray-50 text-slate-800"
                            style="word-wrap: break-word; scroll-behavior: smooth;"
                    >
                        <span>{{ finalTranscript }}</span><span class="text-blue-600 opacity-70">{{ interimTranscript }}</span><span class="animate-pulse">|</span>
                    </div>
                </div>
            </div>

            <!-- Corrected Text -->
            <div class="rounded-lg p-4 shadow-sm bg-white">
                <div class="flex justify-between items-center mb-3">
                    <h2 class="text-xl font-semibold text-slate-800">{{ t('textAreas.correctedText') }}</h2>
                    <span class="text-sm text-slate-600">{{ correctedWordCount }} {{ t('textAreas.words') }}</span>
                </div>
                <textarea
                        v-model="correctedText"
                        class="w-full h-96 rounded p-3 resize-none font-mono text-sm bg-gray-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
                        :placeholder="t('textAreas.correctedPlaceholder')"
                ></textarea>
            </div>
        </div>

        <!-- History Panel Component -->
        <history-panel
                :dark-mode="darkMode"
                :show="showHistory"
                :session-history="sessionHistory"
                @load-session="loadSession"
                @clear-history="clearHistory"
        />

        <!-- Recordings Panel Component -->
        <recordings-panel
                :dark-mode="darkMode"
                :show="showRecordings"
                :recordings="recordings"
                @load-recordings="loadRecordings"
                @delete-recording="deleteRecording"
                @transcribe-recording="transcribeRecording"
                @download-recording="downloadRecording"
        />

        <!-- Diary Panel Component -->
        <diary-panel
                :dark-mode="darkMode"
                :show="showDiaryPanel"
                :audios="diaryAudios"
                :api-base-url="''"
                @close="showDiaryPanel = false"
                @delete-audio="deleteDiaryAudio"
                @download-audio="downloadDiaryAudio"
        />

        <!-- Notes List Panel -->
        <div v-if="showNotesList" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                <div class="p-6 border-b flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-slate-800">{{ t('notes.title') }}</h2>
                    <button @click="showNotesList = false" class="text-gray-500 hover:text-gray-700 text-3xl leading-none">&times;</button>
                </div>

                <div v-if="loadingNotes" class="flex-1 flex items-center justify-center">
                    <div class="text-slate-600 text-lg">{{ t('notes.loading') }}</div>
                </div>

                <div v-else class="flex-1 overflow-y-auto p-6">
                    <div v-if="notes.length === 0" class="text-center text-slate-600 py-12">
                        <p class="text-xl mb-2">{{ t('notes.empty') }}</p>
                        <p class="text-sm">{{ t('notes.emptyHint') }}</p>
                    </div>

                    <div v-else class="space-y-4">
                        <div
                            v-for="note in notes"
                            :key="note.id"
                            class="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
                        >
                            <div class="flex justify-between items-start mb-3">
                                <div class="flex-1">
                                    <span class="text-xs font-semibold px-2 py-1 rounded bg-slate-200 text-slate-700">
                                        {{ note.type }}
                                    </span>
                                    <span class="text-xs text-slate-500 ml-2">
                                        {{ new Date(note.createdAt).toLocaleString(currentLanguage === 'pl' ? 'pl-PL' : 'en-US') }}
                                    </span>
                                    <span class="text-xs text-slate-500 ml-2">
                                        {{ note.wordCount }} {{ t('textAreas.words') }}
                                    </span>
                                </div>
                                <div class="flex gap-2">
                                    <button
                                        @click="loadNote(note.id)"
                                        class="px-3 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded text-sm font-semibold transition-colors"
                                    >
                                        {{ t('notes.load') }}
                                    </button>
                                    <button
                                        @click="deleteNoteConfirm(note.id)"
                                        class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-semibold transition-colors"
                                    >
                                        {{ t('notes.delete') }}
                                    </button>
                                </div>
                            </div>

                            <div class="text-sm text-slate-700 mb-2">
                                <strong class="font-semibold">{{ t('notes.rawText') }}</strong>
                                <div class="mt-1 text-slate-600">{{ note.rawText || t('notes.none') }}</div>
                            </div>

                            <div v-if="note.transformedText" class="text-sm text-slate-700">
                                <strong class="font-semibold">{{ t('notes.correctedTextLabel') }}</strong>
                                <div class="mt-1 text-slate-600">{{ note.transformedText }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="notesPagination && notesPagination.totalPages > 1" class="p-6 border-t flex justify-between items-center bg-gray-50">
                    <button
                        @click="loadNotes(notesPage - 1)"
                        :disabled="!notesPagination.hasPrev"
                        class="px-4 py-2 bg-slate-700 hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 text-white rounded font-semibold transition-colors"
                    >
                        {{ t('notes.previous') }}
                    </button>

                    <span class="text-slate-700 font-semibold">
                        {{ t('notes.page') }} {{ notesPagination.page }} {{ t('notes.of') }} {{ notesPagination.totalPages }}
                        <span class="text-slate-500 text-sm">({{ notesPagination.total }} {{ t('notes.notesCount') }})</span>
                    </span>

                    <button
                        @click="loadNotes(notesPage + 1)"
                        :disabled="!notesPagination.hasNext"
                        class="px-4 py-2 bg-slate-700 hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 text-white rounded font-semibold transition-colors"
                    >
                        {{ t('notes.next') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Debug Info -->
        <div v-if="lastError" class="mb-6 rounded-lg p-4 border" :class="darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-300'">
            <h3 class="font-semibold mb-2" :class="darkMode ? 'text-red-200' : 'text-red-900'">{{ t('errors.title') }}</h3>
            <p class="text-sm" :class="darkMode ? 'text-red-300' : 'text-red-700'">{{ lastError }}</p>
        </div>

        <!-- Processing Log -->
        <div v-if="processingLog.length > 0" class="rounded-lg p-4 shadow-sm border" :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
            <h3 class="font-semibold mb-3">{{ t('processingLog.title') }}</h3>
            <div class="space-y-2">
                <div
                        v-for="(log, index) in processingLog.slice(-5)"
                        :key="index"
                        class="text-sm flex gap-2"
                        :class="darkMode ? 'text-gray-400' : 'text-gray-600'"
                >
                    <span>{{ log }}</span>
                </div>
            </div>
        </div>

        <!-- Email Modal Component -->
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
import AudioVisualization from './components/AudioVisualization.vue';
import StatusIndicators from './components/StatusIndicators.vue';
import EmailModal from './components/EmailModal.vue';
import RecordingsPanel from './components/RecordingsPanel.vue';
import HistoryPanel from './components/HistoryPanel.vue';
import DiaryPanel from './components/DiaryPanel.vue';

import { AudioService } from './services/AudioService.js';
import { ApiService } from './services/ApiService.js';
import { SpeechRecognitionService } from './services/SpeechRecognitionService.js';
import { StorageService } from './services/StorageService.js';
import { i18nMixin } from './i18n/index.js';

export default {
    name: 'App',
    mixins: [i18nMixin],
    components: {
        'audio-visualization': AudioVisualization,
        'status-indicators': StatusIndicators,
        'email-modal': EmailModal,
        'recordings-panel': RecordingsPanel,
        'history-panel': HistoryPanel,
        'diary-panel': DiaryPanel
    },
    data() {
        return {
            // Theme
            darkMode: StorageService.getDarkMode(),

            // Server
            serverStatus: false,
            apiKeyConfigured: false,
            whisperAvailable: false,

            // Speech Recognition
            isListening: false,
            transcriptionMode: StorageService.getTranscriptionMode(),

            // Audio Device
            audioDevices: [],
            selectedDeviceId: StorageService.getSelectedDevice(),

            // Whisper Processing
            isWhisperProcessing: false,

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
        }
    },
    watch: {
        wordCount(newCount) {
            if (newCount > 0 && newCount % this.chunkSize === 0 && !this.isProcessing && this.serverStatus) {
                this.sendToAI();
            }
        },
        finalTranscript() {
            this.scrollRawText();
        },
        interimTranscript() {
            this.scrollRawText();
        },
        darkMode(newVal) {
            StorageService.setDarkMode(newVal);
        },
        transcriptionMode(newVal) {
            StorageService.setTranscriptionMode(newVal);
            if (this.isListening) {
                this.toggleListening();
                this.$nextTick(() => this.toggleListening());
            }
        },
        showNotesList(newVal) {
            if (newVal) {
                this.loadNotes(1);
            }
        },
        currentLanguage(newVal) {
            StorageService.setLanguage(newVal);
            // Reload voices when language changes
            this.loadVoices();
        }
    },
    async mounted() {
        // Initialize services
        this.audioService = new AudioService();
        this.apiService = new ApiService();
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
        toggleTheme() {
            this.darkMode = !this.darkMode;
        },

        onLanguageChange() {
            StorageService.setLanguage(this.currentLanguage);
        },

        async checkServerStatus() {
            try {
                const data = await this.apiService.checkHealth();
                this.serverStatus = true;
                this.apiKeyConfigured = data.hasApiKey;
                this.whisperAvailable = data.whisperAvailable || false;
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
                if (this.transcriptionMode === 'webspeech') {
                    this.speechService.stop();
                } else if (this.transcriptionMode === 'whisper') {
                    this.audioService.stopWhisperRecording();
                }

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

                const audioStream = await this.audioService.getAudioStream(this.selectedDeviceId);

                if (this.$refs.audioVisualization) {
                    await this.$refs.audioVisualization.start(audioStream);
                }

                // Start full recording if enabled
                if (this.enableRecording) {
                    await this.startFullRecording();
                }

                if (this.transcriptionMode === 'webspeech') {
                    try {
                        this.speechService.start();
                        this.isListening = true;
                    } catch (e) {
                        this.lastError = this.t('errors.cannotStartRecognition');
                    }
                } else if (this.transcriptionMode === 'whisper') {
                    this.audioService.startWhisperRecording(async (audioBlob) => {
                        await this.sendToWhisper(audioBlob);
                    });
                    this.isListening = true;
                }
            }
        },

        async sendToWhisper(audioBlob) {
            this.isWhisperProcessing = true;

            try {
                console.log(`Wysyłam chunk audio do Whisper: ${audioBlob.size} bytes`);
                const data = await this.apiService.transcribe(audioBlob);

                if (data.text && data.text.trim()) {
                    console.log(`Otrzymano z Whisper: "${data.text.substring(0, 50)}..."`);
                    this.finalTranscript += data.text + ' ';
                } else {
                    console.log('Whisper zwrócił pusty tekst');
                }

            } catch (error) {
                console.error('Whisper error:', error);
            } finally {
                this.isWhisperProcessing = false;
            }
        },

        // Full Recording Methods
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

                // Update duration timer
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
                // Najpierw upewnij się że Note istnieje
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

                    this.scrollRawText();

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

        // TTS Methods
        async loadVoices() {
            try {
                const response = await this.apiService.getVoices(this.currentLanguage);
                this.voices = response.voices || [];

                // Set default voice (first multilingual or first available)
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
                // Najpierw upewnij się że Note istnieje
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

                // Scroll to top
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
                // Zapisz do localStorage (dla recovery)
                if (this.finalTranscript) {
                    StorageService.setRawText(this.finalTranscript);
                }
                if (this.correctedText) {
                    StorageService.setCorrectedText(this.correctedText);
                }

                // Zapisz do bazy danych przez API
                if ((this.finalTranscript || this.correctedText) && this.serverStatus) {
                    try {
                        await this.ensureNoteExists();
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

            // Load recordings
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

                // Dla sesji terapeutycznej dodaj historię konwersacji
                if (this.correctionType === 'sesja') {
                    const recentHistory = this.therapyHistory.slice(-this.therapyExchangeCount);
                    requestData.conversationHistory = recentHistory;
                }

                // Dla custom dodaj instrukcję
                if (this.correctionType === 'custom') {
                    requestData.customInstruction = this.customCorrectionInstruction;
                }

                const data = await this.apiService.correctText(requestData);

                // Dla sesji: dodaj wymianę do historii i wyczyść pole surowego tekstu
                if (this.correctionType === 'sesja') {
                    this.therapyHistory.push({
                        client: this.finalTranscript,
                        therapist: data.correctedText
                    });

                    // Zapisz historię w localStorage
                    localStorage.setItem('therapyHistory', JSON.stringify(this.therapyHistory));

                    // Wyczyść pole "Surowy tekst" aby nie wysyłać ponownie tej samej wypowiedzi
                    this.finalTranscript = '';
                    StorageService.setRawText('');
                }

                this.correctedText = data.correctedText;

                // Save to history
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
                localStorage.removeItem('therapyHistory');
                this.showSuccess = true;
                setTimeout(() => {
                    this.showSuccess = false;
                }, 2000);
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

        formatDuration(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },

        formatSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        },

        scrollRawText() {
            this.$nextTick(() => {
                const display = document.getElementById('rawTextDisplay');
                if (display) {
                    display.scrollTop = display.scrollHeight;
                }
            });
        },

        clearHistory() {
            this.sessionHistory = [];
            StorageService.setSessionHistory(this.sessionHistory);
        }
    }
};
</script>

<style>
/* Add your custom styles here */
</style>
