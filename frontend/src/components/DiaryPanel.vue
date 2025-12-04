<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
             :class="darkMode ? 'bg-gray-800' : 'bg-white'">

            <!-- Header -->
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">🎧 Dziennik Audio</h2>
                <button
                        @click="$emit('close')"
                        class="px-4 py-2 rounded-lg font-semibold transition-colors"
                        :class="darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'"
                >
                    ✕ Zamknij
                </button>
            </div>

            <!-- Audio List -->
            <div v-if="audios.length === 0" class="text-center py-8" :class="darkMode ? 'text-gray-400' : 'text-gray-600'">
                <p class="text-lg">Brak wygenerowanych plików audio</p>
                <p class="text-sm mt-2">Wygeneruj audio z tekstu aby zobaczyć je tutaj</p>
            </div>

            <div v-else class="space-y-4">
                <div
                        v-for="audio in audios"
                        :key="audio.id"
                        class="p-4 rounded-lg border"
                        :class="darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-300'"
                >
                    <!-- Audio Info -->
                    <div class="flex flex-col gap-3 mb-3">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="font-semibold">🎙️ {{ audio.voice_name }}</span>
                                    <span class="text-xs px-2 py-1 rounded"
                                          :class="darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'">
                                        {{ audio.text_length }} znaków
                                    </span>
                                </div>
                                <p class="text-sm" :class="darkMode ? 'text-gray-400' : 'text-gray-600'">
                                    {{ audio.text_preview }}
                                </p>
                            </div>
                            <button
                                    @click="$emit('delete-audio', audio.id)"
                                    class="px-3 py-1 rounded-lg text-sm font-semibold transition-colors text-white bg-red-600 hover:bg-red-700"
                            >
                                🗑️
                            </button>
                        </div>

                        <!-- Date -->
                        <div class="text-xs" :class="darkMode ? 'text-gray-500' : 'text-gray-500'">
                            {{ formatDate(audio.date) }}
                        </div>
                    </div>

                    <!-- Audio Player -->
                    <audio
                            :src="getAudioUrl(audio.id)"
                            controls
                            class="w-full"
                            :class="darkMode ? 'audio-player-dark' : ''"
                    ></audio>

                    <!-- Actions -->
                    <div class="flex gap-2 mt-3">
                        <button
                                @click="$emit('download-audio', audio)"
                                class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-white bg-blue-600 hover:bg-blue-700"
                        >
                            💾 Pobierz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DiaryPanel',
    props: {
        darkMode: {
            type: Boolean,
            required: true
        },
        show: {
            type: Boolean,
            required: true
        },
        audios: {
            type: Array,
            required: true
        },
        apiBaseUrl: {
            type: String,
            default: ''
        }
    },
    methods: {
        getAudioUrl(audioId) {
            return `${this.apiBaseUrl}/api/tts/diary/${audioId}`;
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
};
</script>

<style scoped>
audio {
    outline: none;
}
</style>

