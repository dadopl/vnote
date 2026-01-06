<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div class="p-6 border-b flex justify-between items-center">
                <h2 class="text-2xl font-bold text-slate-800">{{ t('notes.title') }}</h2>
                <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-3xl leading-none">&times;</button>
            </div>

            <div v-if="loading" class="flex-1 flex items-center justify-center">
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
                                    {{ formatDate(note.createdAt) }}
                                </span>
                                <span class="text-xs text-slate-500 ml-2">
                                    {{ note.wordCount }} {{ t('textAreas.words') }}
                                </span>
                            </div>
                            <div class="flex gap-2">
                                <button
                                    @click="$emit('load', note.id)"
                                    class="px-3 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded text-sm font-semibold transition-colors"
                                >
                                    {{ t('notes.load') }}
                                </button>
                                <button
                                    @click="$emit('delete', note.id)"
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
            <div v-if="pagination && pagination.totalPages > 1" class="p-6 border-t flex justify-between items-center bg-gray-50">
                <button
                    @click="$emit('page-change', currentPage - 1)"
                    :disabled="!pagination.hasPrev"
                    class="px-4 py-2 bg-slate-700 hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 text-white rounded font-semibold transition-colors"
                >
                    {{ t('notes.previous') }}
                </button>

                <span class="text-slate-700 font-semibold">
                    {{ t('notes.page') }} {{ pagination.page }} {{ t('notes.of') }} {{ pagination.totalPages }}
                    <span class="text-slate-500 text-sm">({{ pagination.total }} {{ t('notes.notesCount') }})</span>
                </span>

                <button
                    @click="$emit('page-change', currentPage + 1)"
                    :disabled="!pagination.hasNext"
                    class="px-4 py-2 bg-slate-700 hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 text-white rounded font-semibold transition-colors"
                >
                    {{ t('notes.next') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { i18nMixin } from '../i18n/index.js';

export default {
    name: 'NotesListModal',
    mixins: [i18nMixin],
    props: {
        show: {
            type: Boolean,
            default: false
        },
        notes: {
            type: Array,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        pagination: {
            type: Object,
            default: null
        },
        currentPage: {
            type: Number,
            default: 1
        }
    },
    emits: ['close', 'load', 'delete', 'page-change'],
    methods: {
        formatDate(dateString) {
            return new Date(dateString).toLocaleString(
                this.currentLanguage === 'pl' ? 'pl-PL' : 'en-US'
            );
        }
    }
};
</script>

