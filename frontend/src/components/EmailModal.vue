<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
        <div class="rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
            <!-- Modal Header -->
            <div class="p-6 border-b" :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold">📧 Wyślij tekst emailem</h3>
                    <button 
                        @click="$emit('close')"
                        class="text-2xl leading-none transition-colors"
                        :class="darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'"
                    >
                        ×
                    </button>
                </div>
            </div>

            <!-- Modal Body -->
            <div class="p-6 space-y-4">
                <!-- Text Type Selection -->
                <div>
                    <label class="block text-sm font-semibold mb-2">Wybierz wersję tekstu:</label>
                    <div class="space-y-2">
                        <label class="flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors"
                            :class="[
                                emailTextType === 'raw' 
                                    ? (darkMode ? 'border-blue-500 bg-blue-900 bg-opacity-20' : 'border-blue-500 bg-blue-50')
                                    : (darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'),
                                !finalTranscript ? 'opacity-50 cursor-not-allowed' : ''
                            ]"
                        >
                            <input 
                                type="radio" 
                                v-model="emailTextType" 
                                value="raw"
                                :disabled="!finalTranscript"
                                class="w-4 h-4"
                            >
                            <div class="flex-1">
                                <div class="font-semibold">📝 Surowy tekst</div>
                                <div class="text-xs" :class="darkMode ? 'text-gray-400' : 'text-gray-600'">
                                    Oryginalny tekst z rozpoznawania mowy ({{ wordCount }} słów)
                                </div>
                            </div>
                        </label>
                        
                        <label class="flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors"
                            :class="[
                                emailTextType === 'corrected' 
                                    ? (darkMode ? 'border-blue-500 bg-blue-900 bg-opacity-20' : 'border-blue-500 bg-blue-50')
                                    : (darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'),
                                !correctedText ? 'opacity-50 cursor-not-allowed' : ''
                            ]"
                        >
                            <input 
                                type="radio" 
                                v-model="emailTextType" 
                                value="corrected"
                                :disabled="!correctedText"
                                class="w-4 h-4"
                            >
                            <div class="flex-1">
                                <div class="font-semibold">✨ Tekst skorygowany przez AI</div>
                                <div class="text-xs" :class="darkMode ? 'text-gray-400' : 'text-gray-600'">
                                    Poprawiony przez Claude AI ({{ correctedWordCount }} słów)
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Recipient Email -->
                <div>
                    <label class="block text-sm font-semibold mb-2">Adres email odbiorcy:</label>
                    <input 
                        type="email" 
                        v-model="emailRecipient"
                        placeholder="adres@email.com"
                        class="w-full px-4 py-2 rounded-lg border transition-colors"
                        :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
                        @input="saveEmailRecipient"
                    >
                </div>

                <!-- Subject (Optional) -->
                <div>
                    <label class="block text-sm font-semibold mb-2">Temat wiadomości (opcjonalnie):</label>
                    <input 
                        type="text" 
                        v-model="emailSubject"
                        placeholder="Zostaw puste dla automatycznego tematu"
                        class="w-full px-4 py-2 rounded-lg border transition-colors"
                        :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
                    >
                </div>

                <!-- Preview -->
                <div>
                    <label class="block text-sm font-semibold mb-2">Podgląd treści:</label>
                    <div 
                        class="w-full h-48 rounded-lg p-3 overflow-y-auto font-mono text-sm border"
                        :class="darkMode ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-gray-50 border-gray-300 text-gray-900'"
                    >
                        {{ emailTextType === 'raw' ? finalTranscript : correctedText }}
                    </div>
                </div>

                <!-- Sending Status -->
                <div v-if="emailSending" class="flex items-center gap-3 p-3 rounded border"
                    :class="darkMode ? 'bg-blue-900 bg-opacity-20 border-blue-700' : 'bg-blue-50 border-blue-300'"
                >
                    <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-blue-600">Wysyłanie emaila...</span>
                </div>

                <!-- Success Message -->
                <div v-if="emailSuccess" class="flex items-center gap-3 p-3 rounded border"
                    :class="darkMode ? 'bg-green-900 bg-opacity-20 border-green-700' : 'bg-green-50 border-green-300'"
                >
                    <span class="text-green-600">✅ Email został wysłany pomyślnie!</span>
                </div>

                <!-- Error Message -->
                <div v-if="emailError" class="flex items-start gap-3 p-3 rounded border"
                    :class="darkMode ? 'bg-red-900 bg-opacity-20 border-red-700' : 'bg-red-50 border-red-300'"
                >
                    <span class="text-red-600">❌ {{ emailError }}</span>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="p-6 border-t flex gap-3" :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
                <button 
                    @click="$emit('close')"
                    class="flex-1 px-4 py-2 rounded-lg font-semibold transition-colors"
                    :class="darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'"
                >
                    Anuluj
                </button>
                <button 
                    @click="sendEmail"
                    :disabled="!emailRecipient || !emailRecipient.includes('@') || (!finalTranscript && !correctedText) || emailSending"
                    class="flex-1 px-4 py-2 rounded-lg font-semibold transition-colors text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                    :class="darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'"
                >
                    📧 Wyślij email
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EmailModal',
    props: {
        darkMode: Boolean,
        show: Boolean,
        finalTranscript: String,
        correctedText: String,
        wordCount: Number,
        correctedWordCount: Number
    },
    data() {
        return {
            emailTextType: 'corrected',
            emailRecipient: localStorage.getItem('emailRecipient') || '',
            emailSubject: '',
            emailSending: false,
            emailSuccess: false,
            emailError: ''
        };
    },
    watch: {
        show(newVal) {
            if (newVal) {
                this.emailSuccess = false;
                this.emailError = '';
                this.emailSubject = '';

                // Auto-select available text type
                if (!this.correctedText && this.finalTranscript) {
                    this.emailTextType = 'raw';
                } else if (!this.finalTranscript && this.correctedText) {
                    this.emailTextType = 'corrected';
                }
            }
        }
    },
    methods: {
        saveEmailRecipient() {
            localStorage.setItem('emailRecipient', this.emailRecipient);
        },

        async sendEmail() {
            this.emailSending = true;
            this.emailSuccess = false;
            this.emailError = '';

            try {
                if (!this.emailRecipient || !this.emailRecipient.includes('@')) {
                    throw new Error('Podaj prawidłowy adres email');
                }

                const textToSend = this.emailTextType === 'raw' ? this.finalTranscript : this.correctedText;

                if (!textToSend || !textToSend.trim()) {
                    throw new Error('Brak treści do wysłania');
                }

                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        recipient: this.emailRecipient,
                        textType: this.emailTextType,
                        text: textToSend,
                        subject: this.emailSubject || undefined
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Błąd wysyłania emaila');
                }

                const data = await response.json();
                console.log('Email sent:', data);

                this.emailSuccess = true;

                setTimeout(() => {
                    this.$emit('close');
                }, 2000);

            } catch (error) {
                console.error('Email error:', error);
                this.emailError = error.message;
            } finally {
                this.emailSending = false;
            }
        }
    }
};
</script>
