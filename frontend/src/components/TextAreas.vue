<template>
    <div class="grid lg:grid-cols-2 gap-6 mb-6">
        <!-- Raw Text -->
        <div class="rounded-lg p-4 shadow-sm bg-white">
            <div class="flex justify-between items-center mb-3">
                <h2 class="text-xl font-semibold text-slate-800">{{ t('textAreas.rawText') }}</h2>
                <span class="text-sm text-slate-600">{{ rawWordCount }} {{ t('textAreas.words') }}</span>
            </div>
            <div class="relative">
                <div
                    ref="rawTextDisplay"
                    class="w-full h-96 rounded p-3 resize-none font-mono text-sm overflow-y-auto whitespace-pre-wrap bg-gray-50 text-slate-800"
                    style="word-wrap: break-word; scroll-behavior: smooth;"
                >
                    <span>{{ rawText }}</span><span class="text-blue-600 opacity-70">{{ interimText }}</span><span class="animate-pulse">|</span>
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
                :value="correctedText"
                @input="$emit('update:correctedText', $event.target.value)"
                class="w-full h-96 rounded p-3 resize-none font-mono text-sm bg-gray-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
                :placeholder="t('textAreas.correctedPlaceholder')"
            ></textarea>
        </div>
    </div>
</template>

<script>
import { i18nMixin } from '../i18n/index.js';

export default {
    name: 'TextAreas',
    mixins: [i18nMixin],
    props: {
        rawText: {
            type: String,
            default: ''
        },
        interimText: {
            type: String,
            default: ''
        },
        correctedText: {
            type: String,
            default: ''
        }
    },
    emits: ['update:correctedText'],
    computed: {
        rawWordCount() {
            return this.rawText.trim().split(/\s+/).filter(w => w.length > 0).length;
        },
        correctedWordCount() {
            return this.correctedText.trim().split(/\s+/).filter(w => w.length > 0).length;
        }
    },
    watch: {
        rawText() {
            this.scrollToBottom();
        },
        interimText() {
            this.scrollToBottom();
        }
    },
    methods: {
        scrollToBottom() {
            this.$nextTick(() => {
                const el = this.$refs.rawTextDisplay;
                if (el) {
                    el.scrollTop = el.scrollHeight;
                }
            });
        }
    }
};
</script>

