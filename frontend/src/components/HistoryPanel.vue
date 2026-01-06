<template>
    <div v-if="show" class="rounded-lg p-4 mb-6 shadow-sm border" :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-lg">{{ t('historyPanel.title') }}</h3>
        </div>

        <div v-if="loading" class="text-center py-8" :class="darkMode ? 'text-gray-500' : 'text-gray-400'">
            {{ t('notes.loading') }}
        </div>

        <div v-else-if="notes.length === 0" class="text-center py-8" :class="darkMode ? 'text-gray-500' : 'text-gray-400'">
            {{ t('notes.empty') }}
        </div>

        <div v-else class="space-y-3 max-h-96 overflow-y-auto">
            <div 
                v-for="note in notes"
                :key="note.id"
                class="p-3 rounded border cursor-pointer hover:shadow-md transition-shadow"
                :class="darkMode ? 'bg-gray-900 border-gray-700 hover:border-gray-600' : 'bg-gray-50 border-gray-200 hover:border-gray-300'"
                @click="$emit('load-note', note.id)"
            >
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-mono" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">{{ formatTimestamp(note.createdAt) }}</span>
                    <span class="text-xs px-2 py-0.5 rounded" :class="getTypeClass(note.type)">{{ getTypeLabel(note.type) }}</span>
                </div>

                <div v-if="note.rawText" class="mb-2">
                    <p class="text-sm" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">
                        {{ note.rawText }}
                    </p>
                </div>

                <div v-if="note.transformedText">
                    <p class="font-bold" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">
                        {{ note.transformedText }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { i18nMixin } from '../i18n/index.js';
import { ApiService } from '../services/ApiService.js';

export default {
    name: 'HistoryPanel',
    mixins: [i18nMixin],
    props: {
        darkMode: Boolean,
        show: Boolean,
        currentType: {
            type: String,
            default: 'default'
        }
    },
    emits: ['load-note'],
    data() {
        return {
            notes: [],
            loading: false,
            apiService: new ApiService()
        };
    },
    watch: {
        show(newVal) {
            if (newVal) {
                this.loadNotes();
            }
        },
        currentType() {
            if (this.show) {
                this.loadNotes();
            }
        }
    },
    mounted() {
        if (this.show) {
            this.loadNotes();
        }
    },
    methods: {
        async loadNotes() {
            this.loading = true;
            try {
                const response = await this.apiService.getNotes(1, 20, this.currentType);
                this.notes = response.notes || [];
            } catch (error) {
                console.error('Error loading notes:', error);
                this.notes = [];
            } finally {
                this.loading = false;
            }
        },
        formatTimestamp(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleString(this.currentLanguage === 'pl' ? 'pl-PL' : 'en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        getTypeLabel(type) {
            if (!type || type === 'default') return this.t('correction.types.default');
            return this.t(`correction.types.${type}`) || type;
        },
        getTypeClass(type) {
            const baseClass = 'text-xs font-semibold';
            switch(type) {
                case 'sesja':
                    return `${baseClass} bg-purple-100 text-purple-800`;
                case 'dziennik':
                    return `${baseClass} bg-blue-100 text-blue-800`;
                case 'summary':
                    return `${baseClass} bg-green-100 text-green-800`;
                case 'jira':
                    return `${baseClass} bg-orange-100 text-orange-800`;
                default:
                    return `${baseClass} bg-gray-100 text-gray-800`;
            }
        }
    }
};
</script>
