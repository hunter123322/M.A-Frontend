<template>
  <div class="max-w-2xl mx-auto p-4 md:p-6 text-white">
    <h1 class="text-2xl font-bold mb-6 text-gray-100">Notifications</h1>
    <div class="space-y-3">
      <div v-if="notifications.length === 0" class="text-center py-12">
        <BellOff class="w-16 h-16 mx-auto text-brand-subtle" />
        <p class="mt-4 text-brand-subtle">No new notifications yet.</p>
      </div>
      <div v-for="notification in notifications" :key="notification.id"
        class="bg-gray-900 p-4 rounded-xl flex items-center gap-4 border border-gray-800 hover:border-pink-500/50 transition-colors">
        <img :src="notification.user.avatarUrl" alt="avatar" class="w-8 h-8 rounded-full shrink-0">
        <div class="flex-grow">
          <p class="text-xs">
            <span class="font-bold">{{ notification.user.username }}</span> {{ notification.action }}
          </p>
          <p class="text-xs text-brand-subtle mt-1">{{ notification.timestamp }}</p>
        </div>
        <ChevronRight class="w-5 h-5 text-brand-subtle shrink-0" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BellOff, ChevronRight } from 'lucide-vue-next';
import type { Notification } from '../types/homepage.type';

const notifications = ref<Notification[]>([
  {
    id: '1',
    user: { id: 'u2', username: 'Jenna', avatarUrl: 'https://placehold.co/100x100/F72585/FFFFFF?text=J' },
    action: 'liked your post',
    timestamp: '15 minutes ago',
  },
  {
    id: '2',
    user: { id: 'u3', username: 'Mike', avatarUrl: 'https://placehold.co/100x100/4CC9F0/FFFFFF?text=M' },
    action: 'started following you',
    timestamp: '1 hour ago',
  },
  {
    id: '3',
    user: { id: 'u4', username: 'Chloe', avatarUrl: 'https://placehold.co/100x100/F2E205/FFFFFF?text=C' },
    action: 'commented on your post',
    timestamp: '3 hours ago',
  }
]);
</script>
