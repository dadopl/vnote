<template>
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
</template>

<script>
import { i18nMixin } from '../i18n/index.js';

export default {
    name: 'ServerStatus',
    mixins: [i18nMixin],
    props: {
        serverStatus: {
            type: Boolean,
            required: true
        },
        apiKeyConfigured: {
            type: Boolean,
            required: true
        }
    }
};
</script>

