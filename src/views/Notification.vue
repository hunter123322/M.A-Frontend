<script setup lang="ts">
import { BellOff, ChevronRight } from "lucide-vue-next";
import type { NotificationType } from "@/types/homepage.type";
import { notifications, rawNotifications } from "@/stores/notification/notification.store";
import Post from "@/components/preview/Post.vue";
import { isPostPreview } from "@/stores/profile/post.preview";
import { getNotificationLink } from "@/script/notification/main";


function getAvatarUrl(userID: number) {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${userID}`;
}

function getActionText(n: NotificationType) {
  switch (n.categories) {
    case "like": return "liked your post";
    case "comment": return "commented on your post";
    case "follow": return "started following you";
    case "mention": return "mentioned you in a post";
    case "system": return n.content;
    default: return n.content;
  }
}

function formatDate(date?: string) {
  if (!date) return "Just now";
  return new Date(date).toLocaleString();
}

function handleNotificationClick(ID: string) {
  const index = rawNotifications.value.findIndex(notification => notification._id === ID);
  if (index !== -1) {
    rawNotifications.value[index].read = true;
  }
}

</script>

<template>
  <Post :class="isPostPreview ? '' : 'hidden'" />
  <div class="mx-auto p-4 md:pt-6 md:p-0 text-white">
    <h1 class="text-2xl font-bold mb-6 text-gray-100">Notifications</h1>

    <div class="space-y-3">
      <!-- Empty state -->
      <div v-if="notifications.length === 0" class="text-center py-12">
        <BellOff class="w-16 h-16 mx-auto text-gray-500" />
        <p class="mt-4 text-gray-500">No new notifications yet.</p>
      </div>

      <!-- Notification list -->
      <div v-for="n in notifications" :key="n._id" :class="n.read ? 'bg-gray-900' : 'bg-gray-700'"
        @click="[handleNotificationClick(n._id), getNotificationLink(n)]"
        class="p-2 rounded-xl flex items-center gap-2 border border-gray-800 hover:border-pink-500/50 transition-colors">
        <img :src="getAvatarUrl(n.userID)" alt="avatar" class="w-8 h-8 rounded-full shrink-0" />

        <div class="flex-grow">
          <p class="text-xs">
            <!-- <span class="font-bold">{{ n.actor.username }}</span> -->
            {{ n.content }}
          </p>
          <p class="text-xs text-gray-500 mt-1">
            {{ formatDate(n.createdAt) }}
          </p>
        </div>

        <ChevronRight class="w-5 h-5 text-gray-500 shrink-0" />
      </div>
    </div>
  </div>
</template>
