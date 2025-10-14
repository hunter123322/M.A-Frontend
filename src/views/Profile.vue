<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import {
  Home, Bell, MessageSquare, User, Heart, MessageCircle, Send,
  MessageCircleMore, Phone, Settings, Edit, Image, ChevronRight, CheckCircle, Clock, Plus, Users, Search
} from 'lucide-vue-next';
import Notification from './Notification.vue';
import Main from './Main.vue';
import MyProfile from './MyProfile.vue';
import MessageComponent from '@/components/auth/MessageComponent.vue';
import Message from './Message.vue';
import { isMessageEvent } from '@/stores/message';
import { initProfile } from '@/script/profile/view.profile';


// --- Global Types/Interfaces ---
type Page = 'Home' | 'Notifications' | 'Profile' | 'Messages' | 'Settings';

type NavItem = {
  key: Page;
  icon: any;
  label: string;
};

// --- App State & Navigation ---
const currentPage = ref<Page>('Home');
const navItems: NavItem[] = [
  { key: 'Home', icon: Home, label: 'Discover' },
  { key: 'Notifications', icon: Bell, label: 'Activity' },
  { key: 'Messages', icon: MessageSquare, label: 'Messages' }, // Assumed to exist, styled here
  { key: 'Profile', icon: User, label: 'Me' },
  { key: 'Settings', icon: Settings, label: 'Setting' }
];


const showMessagePopup = ref(false);
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
      console.log('Notif');
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
    <nav 
      :class="isMessageEvent ? 'hidden' : 'fixed'"
      class=" bottom-0 left-0 right-0 z-40 max-w-3xl mx-auto bg-gray-900 border-t border-gray-800/80 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div class="flex justify-around items-center max-h-15">
        <template v-for="item in navItems" :key="item.key">
          <button @click="currentPage = item.key"
            class="flex flex-col items-center justify-center p-1 pb-5 sm:p-2 group transition-all duration-200" :class="{
              'text-pink-400': currentPage === item.key,
              'text-gray-500 hover:text-gray-300': currentPage !== item.key
            }">
            <component :is="item.icon" class="w-6 h-6 transition-all duration-200" :class="{
              'text-pink-400 shadow-glow': currentPage === item.key,
              'group-hover:text-pink-400': currentPage !== item.key
            }" />
            <span class="text-xs mt-1 font-medium hidden sm:block">{{ item.label }}</span>
            <span v-if="currentPage === item.key"
              class="h-0.5 w-6 bg-pink-500 rounded-full mt-1 shadow-md shadow-pink-500/50"></span>
          </button>
        </template>
      </div>
    </nav>

    <!-- Floating Button to Open Popup -->
    <button v-show="!showMessagePopup" @click="showMessagePopup = true"
      class="md:fixed md:flex hidden bottom-4 right-4 md:bottom-6 md:right-6 bg-pink-600 hover:bg-pink-500 text-white p-4 rounded-full shadow-lg z-50">
      💬
    </button>
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
