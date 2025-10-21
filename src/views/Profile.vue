<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import {
  Home, Bell, MessageSquare, User, Heart, MessageCircle, Send,
  MessageCircleMore, Phone, Settings, Edit, Image, ChevronRight, CheckCircle, Clock, Plus, Users, Search
} from 'lucide-vue-next';
import Notification from './Notification.vue';
import Main from './Main.vue';
import MyProfile from './MyProfile.vue';
import Message from './Message.vue';
import { isMessageEvent } from '@/stores/message';
import { initProfile } from '@/script/profile/view.profile';
import { notificationCount } from '@/stores/notification/notification.store';
import { notificationHandler } from '@/script/notification/notification.init';



// --- Global Types/Interfaces ---
type Page = 'Home' | 'Notifications' | 'Profile' | 'Messages' | 'Settings';

type NavItem = {
  key: Page;
  icon: any;
  label: string;
};

// --- App State & Navigation ---
const currentPage = ref<Page>('Home');

const messages = ref([
  { id: 1, text: "Hey, how are you?", from: "them", timestamp: "2m ago" },
  { id: 2, text: "All good! You?", from: "me", timestamp: "1m ago" },
]);
const newMessage = ref("");

const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  messages.value.push({
    id: Date.now(),
    text: newMessage.value,
    from: "me",
    timestamp: "just now",
  });
  newMessage.value = "";
};

// --- Refactored Dynamic Component Mapping ---
const currentPageComponent = computed(() => {
  switch (currentPage.value) {
    case 'Home':
      console.log('Home');
      return Main;
    case 'Notifications':
      notificationHandler()
      return Notification;
    case 'Profile':
      console.log('Profile');
      initProfile()
      return MyProfile;
    case 'Messages':
      console.log('Message');
      return Message;
    default:
      return Main;

  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-50 font-sans antialiased">

    <!-- Main Content Area -->
    <main class="w-full max-w-3xl mx-auto overflow-y-auto">
      <component :is="currentPageComponent" />
    </main>

    <!-- Global Navigation Bar -->
    <nav :class="isMessageEvent ? 'hidden' : 'fixed'"
      class="bottom-0 left-0 right-0 z-40 max-w-3xl mx-auto bg-gray-900 border-t border-gray-800/80 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div class="flex justify-around items-center max-h-15">

        <!-- ? Home -->
        <button @click="currentPage = 'Home'"
          class="flex flex-col items-center justify-center p-1 pb-5 sm:p-2 group transition-all duration-200" :class="{
            'text-pink-400': currentPage === 'Home',
            'text-gray-500 hover:text-gray-300': currentPage !== 'Home'
          }">
          <Home class="w-6 h-6 transition-all duration-200" :class="{
            'text-pink-400 shadow-glow': currentPage === 'Home',
            'group-hover:text-pink-400': currentPage !== 'Home'
          }" />
          <span class="text-xs mt-1 font-medium hidden sm:block">Discover</span>
          <span v-if="currentPage === 'Home'"
            class="h-0.5 w-6 bg-pink-500 rounded-full mt-1 shadow-md shadow-pink-500/50"></span>
        </button>

        <!-- ? Notifications -->
        <button @click="currentPage = 'Notifications'"
          class="relative flex flex-col items-center justify-center p-1 pb-5 sm:p-2 group transition-all duration-200"
          :class="{
            'text-pink-400': currentPage === 'Notifications',
            'text-gray-500 hover:text-gray-300': currentPage !== 'Notifications'
          }">
          <!-- Bell Icon with Badge -->
          <div class="relative">
            <Bell class="w-6 h-6 transition-all duration-200" :class="{
              'text-pink-400 shadow-glow': currentPage === 'Notifications',
              'group-hover:text-pink-400': currentPage !== 'Notifications'
            }" />
            <!-- * 🔔 Notification Count Badge -->
            <span v-if="notificationCount" @click="notificationCount = null"
              class="absolute -top-1.5 -right-1.5 bg-red-500 text-[10px] font-bold text-white rounded-full px-1.5 py-0.5 shadow-lg shadow-red-500/50">
              {{ notificationCount }}
            </span>
          </div>

          <!-- Label -->
          <span class="text-xs mt-1 font-medium hidden sm:block">Activity</span>

          <!-- Active underline -->
          <span v-if="currentPage === 'Notifications'"
            class="h-0.5 w-6 bg-pink-500 rounded-full mt-1 shadow-md shadow-pink-500/50"></span>
        </button>

        <!-- ? Messages -->
        <button @click="currentPage = 'Messages'"
          class="relative flex flex-col items-center justify-center p-1 pb-5 sm:p-2 group transition-all duration-200"
          :class="{
            'text-pink-400': currentPage === 'Messages',
            'text-gray-500 hover:text-gray-300': currentPage !== 'Messages'
          }">
          <div class="relative">
            <MessageSquare class="w-6 h-6 transition-all duration-200" :class="{
              'text-pink-400 shadow-glow': currentPage === 'Messages',
              'group-hover:text-pink-400': currentPage !== 'Messages'
            }" />
            <!-- 🔴 Small Red Dot Indicator -->
            <span
              class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_6px_rgba(239,68,68,0.7)]"></span>
          </div>

          <span class="text-xs mt-1 font-medium hidden sm:block">Messages</span>
          <span v-if="currentPage === 'Messages'"
            class="h-0.5 w-6 bg-pink-500 rounded-full mt-1 shadow-md shadow-pink-500/50"></span>
        </button>

        <!-- ? Profile -->
        <button @click="currentPage = 'Profile'"
          class="flex flex-col items-center justify-center p-1 pb-5 sm:p-2 group transition-all duration-200" :class="{
            'text-pink-400': currentPage === 'Profile',
            'text-gray-500 hover:text-gray-300': currentPage !== 'Profile'
          }">
          <User class="w-6 h-6 transition-all duration-200" :class="{
            'text-pink-400 shadow-glow': currentPage === 'Profile',
            'group-hover:text-pink-400': currentPage !== 'Profile'
          }" />
          <span class="text-xs mt-1 font-medium hidden sm:block">Me</span>
          <span v-if="currentPage === 'Profile'"
            class="h-0.5 w-6 bg-pink-500 rounded-full mt-1 shadow-md shadow-pink-500/50"></span>
        </button>

        <!-- ? Settings -->
        <button @click="currentPage = 'Settings'"
          class="flex flex-col items-center justify-center p-1 pb-5 sm:p-2 group transition-all duration-200" :class="{
            'text-pink-400': currentPage === 'Settings',
            'text-gray-500 hover:text-gray-300': currentPage !== 'Settings'
          }">
          <Settings class="w-6 h-6 transition-all duration-200" :class="{
            'text-pink-400 shadow-glow': currentPage === 'Settings',
            'group-hover:text-pink-400': currentPage !== 'Settings'
          }" />
          <span class="text-xs mt-1 font-medium hidden sm:block">Setting</span>
          <span v-if="currentPage === 'Settings'"
            class="h-0.5 w-6 bg-pink-500 rounded-full mt-1 shadow-md shadow-pink-500/50"></span>
        </button>

      </div>
    </nav>
  </div>
</template>


<style>
/* Global CSS for Dark Mode and Font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

#app {
  font-family: 'Inter', sans-serif;
  background-color: #0d0d1a;
  /* Very dark background */
}

/* Custom glow effect for active icons */
.text-pink-400.shadow-glow {
  text-shadow: 0 0 5px rgba(236, 72, 153, 0.5);
  /* Subtle pink glow */
}

/* Hide horizontal scrollbar, just in case */
body {
  overflow-x: hidden;
}
</style>
