<template>
    <div v-if="logs.length > 0" class="rounded-lg p-4 shadow-sm border bg-white border-gray-200">
        <h3 class="font-semibold mb-3">{{ t('processingLog.title') }}</h3>
        <div class="space-y-2">
            <div
                v-for="(log, index) in logs.slice(-5)"
                :key="index"
                class="text-sm flex gap-2 text-gray-600"
            >
                <span>{{ log }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { i18nMixin } from '../i18n/index.js';

export default {
    name: 'ProcessingLog',
    mixins: [i18nMixin],
    props: {
        logs: {
            type: Array,
            default: () => []
        }
    }
};
</script>

