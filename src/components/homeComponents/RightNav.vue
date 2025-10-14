<script setup lang="ts">
import {
    Aperture, User,
    VolumeX, UserCircle2,
    Video, Phone, Pin,
    DeleteIcon, BadgeAlert, AtSign,
    Ban,
} from 'lucide-vue-next';
import { useTheme } from '@/stores/theme';
import { isMicOn, endCall, isCameraOn, toggleMic, startTimer } from '@/stores/streaming';

const { isDark } = useTheme();

</script>

<template>
    <div id="right-nav" :class="isDark ? 'bg-blue-300/30' : 'bg-blue-200'"
        class="w-1/3 h-full rounded-lg ml-2 p-2 hidden">
        <div id="contact-person" class="flex flex-col items-center justify-center mt-4 h-auto">
            <Aperture :size="100" :color="isDark ? 'white' : 'black'" />
            <span class="mt-4 font-bold text-2xl mx-1 text-center"></span>
            <span id="status" class="font-semibold text-xl">Active</span>
        </div>

        <div class="w-auto h-0.5 my-4" :class="isDark ? 'bg-blue-300/20' : 'bg-black/20'"></div>

        <div class="flex flex-col space-y-2 ml-3">
            <div class="flex items-center space-x-2 cursor-pointer text-xl font-semibold">
                <span class="text-red-500">Function</span>
                <span>Comming Soon...</span>
            </div>
            <div class="flex items-center space-x-2 cursor-pointer text-xl font-semibold">
                <User :size="20" />
                <span>Nickname</span>
            </div>
            <div class="flex items-center space-x-2 cursor-pointer text-xl font-semibold">
                <VolumeX :size="20" />
                <span>Mute</span>
            </div>
            <div class="flex items-center space-x-2 cursor-pointer text-xl font-semibold">
                <UserCircle2 :size="20" />
                <span>Profile</span>
            </div>
            <div @click="[endCall = false, isMicOn = true, startTimer()]" :class="isCameraOn ? 'text-red-500' : ''"
                class="flex items-center space-x-2 cursor-pointer text-xl font-semibold">
                <Video :size="20" />
                <span>Video</span>
            </div>
            <div @click="[endCall = false, isMicOn = true, startTimer()] " :class="!endCall ? 'text-red-500' : ''"
                class="flex items-center space-x-2 cursor-pointer text-xl font-semibold">
                <Phone :size="20" />
                <span>Call</span>
            </div>
            <div class="flex items-center space-x-2 cursor-pointer text-xl font-semibold">
                <Pin :size="20" />
                <span>Pin</span>
            </div>
        </div>

        <div class="w-auto h-0.5 my-4" :class="isDark ? 'bg-blue-300/20' : 'bg-black/20'"></div>

        <div class="flex flex-col space-y-2 ml-3">
            <div class="flex items-center space-x-2 cursor-pointer text-orange-400 text-xl font-semibold">
                <Ban :size="20" />
                <span>Block</span>
            </div>
            <div class="flex items-center space-x-2 cursor-pointer text-yellow-400 text-xl font-semibold">
                <BadgeAlert :size="20" />
                <span>Report</span>
            </div>
            <div class="flex items-center space-x-2 cursor-pointer text-red-400 text-xl font-semibold">
                <DeleteIcon :size="20" />
                <span>Delete</span>
            </div>
        </div>

        <div class="w-auto h-0.5 my-4" :class="isDark ? 'bg-blue-300/20' : 'bg-black/20'"></div>

        <div class="flex justify-center items-center space-x-2 cursor-pointer text-2xl font-semibold">
            <AtSign :size="30" />
            <span href="#">Aldrin Belardo</span>
        </div>
    </div>
</template>