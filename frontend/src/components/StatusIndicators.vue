<template>
    <div class="rounded-lg p-4 mb-6 shadow-sm border" :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="flex items-center gap-6 flex-wrap">
            <!-- Listening Status -->
            <div class="flex items-center gap-2">
                <div class="relative">
                    <div 
                        class="w-3 h-3 rounded-full"
                        :class="isListening ? 'bg-red-500' : 'bg-gray-400'"
                    ></div>
                    <div 
                        v-if="isListening"
                        class="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping"
                    ></div>
                </div>
                <span class="text-sm">
                    {{ isListening ? 'Nasłuchuję' : 'Zatrzymano' }}
                </span>
            </div>

            <!-- Chunk Ready -->
            <div class="flex items-center gap-2">
                <div 
                    class="w-3 h-3 rounded-full"
                    :class="wordCount >= chunkSize ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'"
                ></div>
                <span class="text-sm">
                    Chunk ({{ wordCount }}/{{ chunkSize }} słów)
                    <span v-if="wordCount >= chunkSize" class="text-yellow-600">→ Gotowy!</span>
                </span>
            </div>

            <!-- AI Processing -->
            <div class="flex items-center gap-2">
                <div class="relative">
                    <div 
                        class="w-3 h-3 rounded-full"
                        :class="isProcessing ? 'bg-blue-500' : 'bg-gray-400'"
                    ></div>
                    <div 
                        v-if="isProcessing"
                        class="absolute inset-0 w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                    ></div>
                </div>
                <span class="text-sm">
                    {{ isProcessing ? 'AI koryguje...' : 'Oczekuje' }}
                </span>
            </div>

            <!-- Success Indicator -->
            <div 
                v-if="showSuccess"
                class="flex items-center gap-2 transition-opacity duration-500"
            >
                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-sm text-green-600">Skorygowano!</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StatusIndicators',
    props: {
        darkMode: Boolean,
        isListening: Boolean,
        wordCount: Number,
        chunkSize: Number,
        isProcessing: Boolean,
        showSuccess: Boolean
    }
};
</script>
