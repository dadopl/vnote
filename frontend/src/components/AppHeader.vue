<template>
    <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 class="text-3xl md:text-4xl font-bold mb-2 text-slate-800">{{ t('header.title') }}</h1>
            <p class="text-slate-600">{{ t('header.subtitle') }}</p>
        </div>
        <div class="flex gap-3 items-center">
            <!-- User info -->
            <span v-if="currentUser" class="text-sm text-slate-600">
                {{ currentUser.email }}
            </span>
            <!-- Language Selector -->
            <select
                :value="currentLanguage"
                @change="$emit('language-change', $event.target.value)"
                class="px-3 py-2 rounded-lg font-semibold transition-all shadow-sm bg-white border border-slate-300 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
                <option value="en">EN</option>
                <option value="pl">PL</option>
            </select>
            <button
                @click="$emit('toggle-recordings')"
                class="px-4 py-2 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md bg-slate-700 hover:bg-slate-800 text-white"
            >
                {{ t('nav.recordings') }} ({{ recordingsCount }})
            </button>
            <button
                @click="$emit('toggle-history')"
                class="px-4 py-2 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md bg-slate-700 hover:bg-slate-800 text-white"
            >
                {{ t('nav.history') }}
            </button>
            <button
                @click="$emit('logout')"
                class="px-4 py-2 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md bg-red-600 hover:bg-red-700 text-white"
            >
                {{ t('nav.logout') }}
            </button>
        </div>
    </div>
</template>

<script>
import { i18nMixin } from '../i18n/index.js';

export default {
    name: 'AppHeader',
    mixins: [i18nMixin],
    props: {
        recordingsCount: {
            type: Number,
            default: 0
        },
        currentUser: {
            type: Object,
            default: null
        }
    },
    emits: ['language-change', 'toggle-recordings', 'toggle-history', 'logout']
};
</script>

