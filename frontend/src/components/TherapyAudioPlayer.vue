y zachować<template>
    <div v-if="audio && isTherapyMode" class="mb-6 rounded-lg p-4 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-lg">{{ isPlaying ? '⏸' : '▶' }}</span>
                </div>
                <div>
                    <h3 class="font-semibold text-slate-800">{{ t('therapy.audioResponse') }}</h3>
                    <p class="text-xs text-slate-500">{{ audio.filename }}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <button
                    @click="togglePlay"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                    {{ isPlaying ? t('buttons.stop') : t('buttons.play') }}
                </button>
                <button
                    @click="$emit('delete')"
                    class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                >
                    {{ t('buttons.delete') }}
                </button>
            </div>
        </div>
        <audio
            ref="audioPlayer"
            :src="audioUrl"
            @ended="onEnded"
            @play="isPlaying = true"
            @pause="isPlaying = false"
            class="hidden"
        ></audio>
    </div>
</template>

<script>
import { i18nMixin } from '../i18n/index.js';

export default {
    name: 'TherapyAudioPlayer',
    mixins: [i18nMixin],
    props: {
        audio: {
            type: Object,
            default: null
        },
        audioUrl: {
            type: String,
            default: ''
        },
        isTherapyMode: {
            type: Boolean,
            default: false
        },
        autoPlay: {
            type: Boolean,
            default: false
        }
    },
    emits: ['delete', 'ended'],
    data() {
        return {
            isPlaying: false
        };
    },
    watch: {
        audioUrl: {
            immediate: true,
            handler(newUrl) {
                if (newUrl && this.autoPlay) {
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.play();
                        }, 300);
                    });
                }
            }
        }
    },
    methods: {
        togglePlay() {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        },
        play() {
            const audio = this.$refs.audioPlayer;
            if (audio) {
                audio.play().catch(err => {
                    console.error('Error playing therapy audio:', err);
                });
            }
        },
        pause() {
            const audio = this.$refs.audioPlayer;
            if (audio) {
                audio.pause();
            }
        },
        onEnded() {
            this.isPlaying = false;
            this.$emit('ended');
        }
    }
};
</script>

