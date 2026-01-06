<template>
    <div v-if="correctedText" class="mb-6 rounded-lg p-4 shadow-sm border bg-white border-gray-200">
        <h3 class="text-lg font-semibold mb-4">{{ t('tts.title') }}</h3>

        <div class="flex flex-col md:flex-row gap-3 items-start md:items-end">
            <!-- Voice Selection -->
            <div class="flex-1 w-full">
                <label class="block text-sm font-semibold mb-2">{{ t('tts.selectVoice') }}</label>
                <select
                    :value="selectedVoiceId"
                    @change="$emit('update:selectedVoiceId', $event.target.value)"
                    class="w-full px-4 py-2 rounded-lg border transition-colors bg-white border-gray-300 text-gray-900"
                    :disabled="isGenerating || voices.length === 0"
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
                    <label class="text-xs font-semibold">{{ t('tts.stability') }}: {{ stability.toFixed(2) }}</label>
                    <input
                        type="range"
                        :value="stability"
                        @input="$emit('update:stability', parseFloat($event.target.value))"
                        min="0" max="1" step="0.01"
                        class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300"
                    >
                    <span class="text-xs text-gray-600">{{ t('tts.stabilityHint') }}</span>
                </div>
                <div>
                    <label class="text-xs font-semibold">{{ t('tts.similarity') }}: {{ similarity.toFixed(2) }}</label>
                    <input
                        type="range"
                        :value="similarity"
                        @input="$emit('update:similarity', parseFloat($event.target.value))"
                        min="0" max="1" step="0.01"
                        class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300"
                    >
                    <span class="text-xs text-gray-600">{{ t('tts.similarityHint') }}</span>
                </div>
                <div>
                    <label class="text-xs font-semibold">{{ t('tts.style') }}: {{ style.toFixed(2) }}</label>
                    <input
                        type="range"
                        :value="style"
                        @input="$emit('update:style', parseFloat($event.target.value))"
                        min="0" max="1" step="0.01"
                        class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300"
                    >
                    <span class="text-xs text-gray-600">{{ t('tts.styleHint') }}</span>
                </div>
            </div>

            <!-- Character Counter -->
            <div class="text-sm mt-3" :class="textLength > 2000 ? 'text-red-500 font-bold' : 'text-gray-600'">
                {{ textLength }} / 2000 {{ t('tts.characters') }}
            </div>

            <!-- Generate Button -->
            <button
                @click="$emit('generate')"
                :disabled="!correctedText || !selectedVoiceId || textLength > 2000 || isGenerating"
                class="px-6 py-2 bg-slate-700 hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md text-white whitespace-nowrap"
            >
                <span v-if="isGenerating">{{ t('tts.generating') }}</span>
                <span v-else>{{ t('tts.generateAudio') }}</span>
            </button>
        </div>

        <!-- Warning message -->
        <p v-if="textLength > 2000" class="mt-3 text-sm text-red-500">
            {{ t('tts.textTooLong') }}
        </p>
    </div>
</template>

<script>
import { i18nMixin } from '../i18n/index.js';

export default {
    name: 'TtsSection',
    mixins: [i18nMixin],
    props: {
        correctedText: {
            type: String,
            default: ''
        },
        voices: {
            type: Array,
            default: () => []
        },
        selectedVoiceId: {
            type: String,
            default: ''
        },
        isGenerating: {
            type: Boolean,
            default: false
        },
        stability: {
            type: Number,
            default: 0.5
        },
        similarity: {
            type: Number,
            default: 0.75
        },
        style: {
            type: Number,
            default: 0.0
        }
    },
    emits: [
        'update:selectedVoiceId',
        'update:stability',
        'update:similarity',
        'update:style',
        'generate'
    ],
    computed: {
        textLength() {
            return this.correctedText.length;
        }
    }
};
</script>

