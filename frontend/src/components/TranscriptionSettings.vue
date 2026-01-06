<template>
    <div class="rounded-lg p-4 mb-6 shadow-sm bg-white">
        <!-- Correction Type Selection -->
        <div>
            <label class="block text-sm font-semibold mb-2">{{ t('correction.label') }}</label>
            <div class="flex flex-col gap-3">
                <select
                    :value="correctionType"
                    @change="$emit('update:correctionType', $event.target.value)"
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
                    <div class="flex items-center gap-3 text-xs text-blue-700 mb-3">
                        <span>{{ t('therapy.context') }} {{ therapyExchangeCount }} {{ t('therapy.exchanges') }}</span>
                        <span>•</span>
                        <span>{{ t('therapy.history') }} {{ therapyHistoryLength }} {{ t('therapy.exchanges') }}</span>
                        <button
                            v-if="therapyHistoryLength > 0"
                            @click="$emit('clear-therapy-history')"
                            class="ml-auto px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-xs font-semibold transition-colors"
                        >
                            {{ t('therapy.clearHistory') }}
                        </button>
                    </div>
                    <div class="pt-3 border-t border-blue-200">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                :checked="therapyAudioEnabled"
                                @change="$emit('update:therapyAudioEnabled', $event.target.checked)"
                                class="w-4 h-4 rounded"
                            >
                            <span class="text-sm">
                                <span class="font-semibold text-blue-900">{{ t('therapy.enableAudio') }}</span>
                                <span class="block text-xs text-blue-700 mt-0.5">{{ t('therapy.enableAudioDescription') }}</span>
                            </span>
                        </label>
                    </div>
                </div>

                <!-- Custom instruction input -->
                <div v-if="correctionType === 'custom'" class="animate-fade-in">
                    <input
                        type="text"
                        :value="customInstruction"
                        @input="$emit('update:customInstruction', $event.target.value)"
                        :placeholder="t('correction.customPlaceholder')"
                        class="w-full px-4 py-2 rounded-lg transition-colors bg-gray-50 text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { i18nMixin } from '../i18n/index.js';

export default {
    name: 'TranscriptionSettings',
    mixins: [i18nMixin],
    props: {
        correctionType: {
            type: String,
            required: true
        },
        customInstruction: {
            type: String,
            default: ''
        },
        therapyExchangeCount: {
            type: Number,
            default: 10
        },
        therapyHistoryLength: {
            type: Number,
            default: 0
        },
        therapyAudioEnabled: {
            type: Boolean,
            default: false
        }
    },
    emits: [
        'update:correctionType',
        'update:customInstruction',
        'clear-therapy-history',
        'update:therapyAudioEnabled'
    ]
};
</script>

