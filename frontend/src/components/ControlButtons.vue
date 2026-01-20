<template>
    <div class="mb-6">
        <!-- Recording and AutoSave Checkboxes -->
        <div class="mb-4 p-3 rounded-lg border bg-gray-50 border-gray-200">
            <div class="flex flex-col md:flex-row md:items-center gap-4">
                <!-- Recording Checkbox -->
                <label class="flex items-center gap-3 cursor-pointer flex-1">
                    <input
                        type="checkbox"
                        :checked="enableRecording"
                        @change="$emit('update:enableRecording', $event.target.checked)"
                        class="w-5 h-5 rounded"
                        :disabled="isListening"
                    >
                    <span class="flex-1">
                        <span class="font-semibold block">{{ t('recording.enableLabel') }}</span>
                        <span class="text-xs mt-1 block text-gray-500">
                            {{ t('recording.enableDescription') }}
                        </span>
                    </span>
                </label>

                <!-- AutoSave Checkbox -->
                <label class="flex items-center gap-3 cursor-pointer flex-1">
                    <input
                        type="checkbox"
                        :checked="autoSaveEnabled"
                        @change="$emit('update:autoSaveEnabled', $event.target.checked)"
                        class="w-5 h-5 rounded"
                    >
                    <span class="flex-1">
                        <span class="font-semibold block">{{ t('settings.autoSave') }}</span>
                        <span class="text-xs mt-1 block text-gray-500">
                            {{ t('settings.autoSaveDescription') }}
                        </span>
                    </span>
                </label>

                <div v-if="isFullRecording" class="flex items-center gap-3 flex-shrink-0">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span class="text-sm font-mono">{{ formatDuration(recordingDuration) }}</span>
                    </div>
                    <span class="text-xs text-gray-600">
                        {{ formatSize(recordingSize) }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Control Buttons -->
        <div class="flex gap-3 flex-wrap">
            <button
                @click="$emit('toggle-listening')"
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
                @click="$emit('send-to-ai')"
                :disabled="!hasText || isProcessing || !serverStatus"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors text-white"
            >
                {{ t('buttons.sendToAI') }}
            </button>

            <button
                @click="$emit('clear-all')"
                class="px-6 py-3 rounded-lg font-semibold transition-colors text-white bg-gray-600 hover:bg-gray-700"
            >
                {{ t('buttons.clear') }}
            </button>

            <button
                @click="$emit('download-text')"
                :disabled="!hasCorrectedText"
                class="px-6 py-3 bg-slate-700 hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md text-white"
            >
                {{ t('buttons.downloadTxt') }}
            </button>

            <button
                @click="$emit('show-email-modal')"
                :disabled="!hasText && !hasCorrectedText"
                class="px-6 py-3 bg-slate-700 hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md text-white"
            >
                {{ t('buttons.sendEmail') }}
            </button>

            <button
                @click="$emit('toggle-diary-panel')"
                class="px-6 py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md text-white bg-slate-700 hover:bg-slate-800"
            >
                {{ t('nav.diaryAudio') }} ({{ diaryAudiosCount }})
            </button>

            <button
                @click="$emit('toggle-notes-list')"
                class="px-6 py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md text-white bg-slate-700 hover:bg-slate-800"
            >
                {{ t('nav.allNotes') }} ({{ totalNotes }})
            </button>
        </div>
    </div>
</template>

<script>
import { i18nMixin } from '../i18n/index.js';

export default {
    name: 'ControlButtons',
    mixins: [i18nMixin],
    props: {
        serverStatus: {
            type: Boolean,
            required: true
        },
        isListening: {
            type: Boolean,
            required: true
        },
        isProcessing: {
            type: Boolean,
            required: true
        },
        hasText: {
            type: Boolean,
            required: true
        },
        hasCorrectedText: {
            type: Boolean,
            required: true
        },
        enableRecording: {
            type: Boolean,
            required: true
        },
        isFullRecording: {
            type: Boolean,
            required: true
        },
        recordingDuration: {
            type: Number,
            default: 0
        },
        recordingSize: {
            type: Number,
            default: 0
        },
        diaryAudiosCount: {
            type: Number,
            default: 0
        },
        totalNotes: {
            type: Number,
            default: 0
        },
        autoSaveEnabled: {
            type: Boolean,
            default: false
        }
    },
    emits: [
        'toggle-listening',
        'send-to-ai',
        'clear-all',
        'download-text',
        'show-email-modal',
        'toggle-diary-panel',
        'toggle-notes-list',
        'update:enableRecording',
        'update:autoSaveEnabled'
    ],
    methods: {
        formatDuration(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },
        formatSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }
    }
};
</script>

