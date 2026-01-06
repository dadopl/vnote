<template>
    <div class="rounded-lg p-4 mb-6 shadow-sm bg-white">
        <label class="block text-sm font-semibold mb-2 text-slate-700">{{ t('audioDevice.label') }}</label>
        <select
            :value="selectedDeviceId"
            @change="$emit('update:selectedDeviceId', $event.target.value)"
            class="w-full md:w-auto px-4 py-2 rounded-lg transition-colors bg-gray-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
            <option value="">{{ t('audioDevice.default') }}</option>
            <option v-for="device in audioDevices" :key="device.deviceId" :value="device.deviceId">
                {{ getDeviceLabel(device) }}
            </option>
        </select>
    </div>
</template>

<script>
import { i18nMixin } from '../i18n/index.js';

export default {
    name: 'AudioDeviceSelector',
    mixins: [i18nMixin],
    props: {
        audioDevices: {
            type: Array,
            required: true
        },
        selectedDeviceId: {
            type: String,
            default: ''
        }
    },
    emits: ['update:selectedDeviceId'],
    methods: {
        getDeviceLabel(device) {
            const typeLabel = this.t(`audioDevice.types.${device.deviceType}`);
            const deviceLabel = device.displayLabel || device.label || `${this.t('audioDevice.microphoneNumber')} ${this.audioDevices.indexOf(device) + 1}`;

            // Dodaj typ urządzenia w nawiasach jeśli to nie jest zwykły mikrofon
            if (device.deviceType !== 'microphone') {
                return `${deviceLabel} [${typeLabel}]`;
            }

            return deviceLabel;
        }
    }
};
</script>

