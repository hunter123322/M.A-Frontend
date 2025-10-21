<script setup lang="ts">
import { ref } from "vue";
import { myProfileData } from "@/stores/user";
import { isSharing, sharingPost } from "@/stores/post/sharingPost";
import { formatTimeAgo } from "@/script/profile/view.profile";
import { submitSharedPost } from "@/script/post/postSharing";

const caption = ref("");
</script>

<template>
    <section class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-3 h-dvh">
        <div class="w-full max-w-md bg-blue-950 border border-gray-800 rounded-lg p-3 flex flex-col gap-3">
            <!-- Header -->
            <div class="flex items-center gap-3">
                <img :src="`./avatar/Avatar_${myProfileData?.user_avatar}.png`" alt="avatar"
                    class="w-10 h-10 rounded-full border-2 border-purple-800" />
                <div>
                    <span class="block text-sm font-semibold text-gray-100">{{ myProfileData?.user_nickname }}</span>
                    <p class="text-xs text-gray-400">Sharing a post</p>
                </div>
            </div>

            <!-- Caption Input -->
            <textarea v-model="caption" placeholder="Write something about this post..." rows="3"
                class="w-full text-sm text-gray-100 bg-transparent border border-gray-700 rounded-lg p-2 resize-none focus:outline-none focus:border-purple-500"></textarea>

            <!-- Shared Post Preview -->
            <div class="flex flex-col bg-blue-900 border border-gray-700 rounded-lg overflow-hidden">
                <div class="flex items-center gap-3 p-3 bg-gray-800/50">
                    <img :src="`./avatar/Avatar_${sharingPost?.author.avatarUrl}.png`" alt="avatar"
                        class="w-8 h-8 rounded-full border border-purple-700" />
                    <div>
                        <span class="block text-xs font-semibold text-gray-100">{{ sharingPost?.author.username
                            }}</span>
                        <p class="text-[10px] text-gray-400">{{ formatTimeAgo(sharingPost?.createdAt || new Date) }}</p>
                    </div>
                </div>

                <!-- Image (optional, uncomment if needed) -->
                <!-- <img src="/avatar/Avatar_1.png" alt="post image" class="w-full h-auto max-h-[55vh] object-cover" /> -->

                <div class="p-3">
                    <p class="text-xs text-gray-300">
                        {{ sharingPost?.caption }}
                    </p>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-2">
                <button class="text-xs text-gray-400 hover:text-gray-200 transition" @click="isSharing = false">
                    Cancel
                </button>
                <button @click="[submitSharedPost(caption), caption = '']"
                    class="px-3 py-1.5 text-xs font-medium bg-purple-700 hover:bg-purple-600 rounded-md text-white transition">
                    Share
                </button>
            </div>
        </div>
    </section>
</template>
