<template>
    <div v-if="show" class="rounded-lg p-4 mb-6 shadow-sm border" :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-lg">📜 Historia sesji</h3>
            <button 
                @click="$emit('clear-history')"
                class="text-sm px-3 py-1 rounded transition-colors"
                :class="darkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'"
            >
                Wyczyść historię
            </button>
        </div>
        <div v-if="sessionHistory.length === 0" class="text-center py-8" :class="darkMode ? 'text-gray-500' : 'text-gray-400'">
            Brak zapisanych sesji
        </div>
        <div v-else class="space-y-3 max-h-96 overflow-y-auto">
            <div 
                v-for="(session, index) in sessionHistory.slice().reverse()" 
                :key="index"
                class="p-3 rounded border cursor-pointer hover:shadow-md transition-shadow"
                :class="darkMode ? 'bg-gray-900 border-gray-700 hover:border-gray-600' : 'bg-gray-50 border-gray-200 hover:border-gray-300'"
                @click="$emit('load-session', session)"
            >
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-mono" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">{{ session.timestamp }}</span>
                    <span class="text-xs" :class="darkMode ? 'text-gray-500' : 'text-gray-400'">{{ session.wordCount }} słów</span>
                </div>
                <p class="text-sm line-clamp-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">
                    {{ session.text.substring(0, 150) }}{{ session.text.length > 150 ? '...' : '' }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HistoryPanel',
    props: {
        darkMode: Boolean,
        show: Boolean,
        sessionHistory: Array
    },
    emits: ['load-session', 'clear-history']
};
</script>
