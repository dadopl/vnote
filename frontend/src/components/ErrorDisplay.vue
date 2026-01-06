<template>
    <div v-if="error" class="mb-6 rounded-lg p-4 border bg-red-50 border-red-300">
        <h3 class="font-semibold mb-2 text-red-900">{{ t('errors.title') }}</h3>
        <p class="text-sm text-red-700">{{ error }}</p>
    </div>
</template>

<script>
import { i18nMixin } from '../i18n/index.js';

export default {
    name: 'ErrorDisplay',
    mixins: [i18nMixin],
    props: {
        error: {
            type: String,
            default: ''
        }
    }
};
</script>

