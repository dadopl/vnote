<template>
    <div v-if="show" class="rounded-lg p-4 mb-6 shadow-sm border" :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-lg">🎙️ Moje nagrania</h3>
            <button
                @click="$emit('load-recordings')"
                class="text-sm px-3 py-1 rounded transition-colors"
                :class="darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
            >
                🔄 Odśwież
            </button>
        </div>
        <div v-if="recordings.length === 0" class="text-center py-8" :class="darkMode ? 'text-gray-500' : 'text-gray-400'">
            Brak nagrań. Rozpocznij nagrywanie, aby utworzyć pierwsze nagranie.
        </div>
        <div v-else class="space-y-4 max-h-[600px] overflow-y-auto">
            <div
                v-for="recording in recordings"
                :key="recording.id"
                class="p-4 rounded border"
                :class="darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'"
            >
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h4 class="font-semibold mb-1">{{ recording.name }}</h4>
                        <div class="flex gap-3 text-xs" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
                            <span>📅 {{ formatDate(recording.timestamp) }}</span>
                            <span>⏱️ {{ formatDuration(recording.duration) }}</span>
                            <span>💾 {{ formatSize(recording.size) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Audio Player -->
                <audio
                    controls
                    class="w-full mb-3"
                    :src="'/api/recordings/' + recording.id"
                    :class="darkMode ? 'audio-player-dark' : 'audio-player-light'"
                ></audio>

                <!-- Actions -->
                <div class="flex gap-2">
                    <button
                        @click="$emit('download-recording', recording.id, recording.name)"
                        class="flex-1 px-3 py-2 rounded text-sm font-semibold transition-colors text-white"
                        :class="darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'"
                    >
                        💾 Pobierz
                    </button>
                    <button
                        @click="$emit('transcribe-recording', recording.id)"
                        :disabled="recording.transcribing"
                        class="flex-1 px-3 py-2 rounded text-sm font-semibold transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'"
                    >
                        {{ recording.transcribing ? '⏳ Transkrybuję...' : '🤖 Transkrybuj' }}
                    </button>
                    <button
                        @click="$emit('delete-recording', recording.id)"
                        class="flex-1 px-3 py-2 rounded text-sm font-semibold transition-colors text-white"
                        :class="darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'"
                    >
                        🗑️ Usuń
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RecordingsPanel',
    props: {
        darkMode: Boolean,
        show: Boolean,
        recordings: Array
    },
    emits: ['load-recordings', 'delete-recording', 'transcribe-recording', 'download-recording'],
    methods: {
        formatDate(timestamp) {
            return new Date(timestamp).toLocaleString('pl-PL');
        },
        formatDuration(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },
        formatSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }
    }
};
</script>
