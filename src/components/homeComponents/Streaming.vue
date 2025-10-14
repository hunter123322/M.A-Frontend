<script setup lang="ts">
import {
    isCameraOn, isSpeakerOn, isSharingScreen, endCall, isMicOn, callDuration,
    toggleCamera, toggleMic, toggleSpeaker, toggleScreenShare,
    videoRef, localVideoRef
} from '@/stores/streaming';
import { onBeforeUnmount } from 'vue';
import {
    Camera, CameraOff, Mic, MicOff, PhoneOff, Volume, VolumeX, Monitor, MonitorOff
} from 'lucide-vue-next';

// ⏱ Format timer for display (HH:MM:SS)
const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, "0");
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
};

// Stop media when component is destroyed
</script>

<template>
    <section :class="endCall ? 'hidden' : 'relative'" class="h-full w-full bg-black border-blue-900">
        <!-- Remote video (main screen) -->
        <video ref="videoRef" autoplay playsinline class="h-full w-full object-cover"></video>

        <!-- Local video (small, bottom-right) -->
        <video ref="localVideoRef" autoplay muted playsinline
            class="absolute bottom-4 right-4 w-40 h-28 rounded-md border-2 border-white object-cover shadow-lg">
        </video>

        <!-- Call duration -->
        <div v-if="callDuration > 0"
            class="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded">
            {{ formatTime(callDuration) }}
        </div>

        <!-- Controls -->
        <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
            <div class="flex flex-row p-1 font-bold items-center justify-center">

                <div @click="toggleCamera" :class="isCameraOn ? 'bg-red-500' : 'bg-gray-500'"
                    class="flex flex-row justify-center items-center m-1 p-2 rounded-full cursor-pointer">
                    <Camera :size="30" v-if="isCameraOn" />
                    <CameraOff :size="30" v-else />
                </div>

                <div @click="toggleMic" :class="isMicOn ? 'bg-green-500' : 'bg-gray-500'"
                    class="flex flex-row justify-center items-center m-1 p-2 rounded-full cursor-pointer">
                    <Mic :size="30" v-if="isMicOn" />
                    <MicOff :size="30" v-else />
                </div>

                <div @click="toggleSpeaker" :class="isSpeakerOn ? 'bg-blue-500' : 'bg-gray-500'"
                    class="flex flex-row justify-center items-center m-1 p-2 rounded-full cursor-pointer">
                    <Volume :size="30" v-if="isSpeakerOn" />
                    <VolumeX :size="30" v-else />
                </div>

                <div @click="toggleScreenShare" :class="isSharingScreen ? 'bg-indigo-500' : 'bg-gray-500'"
                    class="flex flex-row justify-center items-center m-1 p-2 rounded-full cursor-pointer">
                    <Monitor :size="30" v-if="isSharingScreen" />
                    <MonitorOff :size="30" v-else />
                </div>

                <div @click="() => { endCall = true }"
                    class="flex flex-row justify-center items-center bg-red-700 m-1 p-2 rounded-full cursor-pointer">
                    <PhoneOff :size="30" />
                </div>
            </div>
        </div>
    </section>
</template>
