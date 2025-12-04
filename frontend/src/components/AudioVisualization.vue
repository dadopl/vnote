<template>
    <div class="rounded-lg p-4 mb-6 shadow-sm border" :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <h3 class="text-sm font-semibold mb-3">🎵 Wizualizacja audio</h3>
        
        <!-- Volume Level -->
        <div class="mb-4">
            <div class="flex justify-between items-center mb-1">
                <span class="text-xs" :class="darkMode ? 'text-gray-400' : 'text-gray-600'">Poziom głośności</span>
                <span class="text-xs font-mono" :class="darkMode ? 'text-gray-400' : 'text-gray-600'">{{ volumeLevel }}%</span>
            </div>
            <div class="w-full h-4 rounded-full overflow-hidden" :class="darkMode ? 'bg-gray-700' : 'bg-gray-200'">
                <div 
                    class="h-full transition-all duration-100 rounded-full"
                    :style="{ width: volumeLevel + '%' }"
                    :class="volumeLevel > 80 ? 'bg-red-500' : volumeLevel > 50 ? 'bg-yellow-500' : 'bg-green-500'"
                ></div>
            </div>
        </div>

        <!-- Equalizer -->
        <div class="flex items-end justify-between gap-1 h-24">
            <div 
                v-for="(bar, index) in equalizerBars" 
                :key="index"
                class="flex-1 rounded-t transition-all duration-100"
                :style="{ height: bar + '%' }"
                :class="bar > 80 ? 'bg-red-500' : bar > 50 ? 'bg-yellow-500' : 'bg-green-500'"
            ></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AudioVisualization',
    props: {
        darkMode: Boolean
    },
    data() {
        return {
            volumeLevel: 0,
            equalizerBars: [0, 0, 0, 0, 0, 0, 0],
            audioContext: null,
            analyser: null,
            microphone: null,
            animationFrame: null
        };
    },
    methods: {
        async start(audioStream) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 256;

                this.microphone = this.audioContext.createMediaStreamSource(audioStream);
                this.microphone.connect(this.analyser);

                this.visualize();
            } catch (error) {
                console.error('Error initializing audio visualization:', error);
            }
        },

        visualize() {
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const draw = () => {
                this.animationFrame = requestAnimationFrame(draw);

                this.analyser.getByteFrequencyData(dataArray);

                // Volume level (average)
                const average = dataArray.reduce((a, b) => a + b) / bufferLength;
                this.volumeLevel = Math.min(100, Math.round((average / 255) * 100));

                // Equalizer bars (7 frequency bands)
                const barCount = 7;
                const barWidth = Math.floor(bufferLength / barCount);
                this.equalizerBars = [];

                for (let i = 0; i < barCount; i++) {
                    const start = i * barWidth;
                    const end = start + barWidth;
                    const barData = dataArray.slice(start, end);
                    const barAverage = barData.reduce((a, b) => a + b) / barWidth;
                    this.equalizerBars.push(Math.min(100, Math.round((barAverage / 255) * 100)));
                }
            };

            draw();
        },

        stop() {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }
            if (this.audioContext) {
                this.audioContext.close();
                this.audioContext = null;
            }
            this.volumeLevel = 0;
            this.equalizerBars = [0, 0, 0, 0, 0, 0, 0];
        }
    },
    beforeUnmount() {
        this.stop();
    }
};
</script>
