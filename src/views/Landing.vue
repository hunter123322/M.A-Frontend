<script setup lang="ts">
import Auth from '@/components/auth/Auth.vue';
import { ref } from 'vue';

const auth = ref<boolean>(false);
const isDark = ref<boolean>(true); // dark mode toggle
</script>

<template>
  <div class="flex h-screen transition-colors duration-300 font-sans"
    :class="isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'">
    <!-- Left branding panel -->
    <div class="hidden md:flex flex-col items-center justify-center w-1/3 px-6 transition-colors duration-300"
      :class="isDark ? 'bg-gradient-to-b from-blue-900 to-indigo-800' : 'bg-gradient-to-b from-blue-400 to-blue-600'">
      <img src="https://t4.ftcdn.net/jpg/06/53/51/21/360_F_653512188_rMB6cqzvHS5r6Ng40y9BdQyNh0EDYnan.jpg"
        alt="M.A Chat App Logo" class="w-2/3 h-auto rounded-full shadow-lg ring-4 ring-white/30" />
      <h2 class="mt-6 text-2xl font-semibold tracking-wide">M.A Chat App</h2>
      <p class="mt-2 text-xs opacity-80 text-center">
        Where conversations come alive.
      </p>
    </div>

    <!-- Right hero content -->
    <div class="flex flex-1 items-center justify-center bg-cover bg-center relative"
      :class="isDark
        ? 'bg-[url(https://images.unsplash.com/photo-1531315630201-bc1d0168d82b?auto=format&fit=crop&w=1200&q=80)]'
        : 'bg-[url(https://www.iiba.org/contentassets/b50a9d74a6c64f87910ced487fda24d5/mastering-the-art-of-communication-blog-header.jpg)]'">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/50 transition-colors duration-300"
        :class="isDark ? 'bg-black/60' : 'bg-white/50'"></div>

      <!-- Content card -->
      <div
        class="relative z-10 flex flex-col items-center text-center px-8 py-10 rounded-2xl shadow-2xl backdrop-blur-lg transition-colors duration-300"
        :class="isDark ? 'bg-blue-800/70' : 'bg-white/80'">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
          Connect. Chat. Grow.
        </h1>
        <p class="text-lg mb-6 max-w-md" :class="isDark ? 'text-gray-200' : 'text-gray-700'">
          Build meaningful conversations with M.A Chat App. Your messages,
          your connections, your world.
        </p>

        <div class="flex flex-col gap-3 w-full max-w-xs">
          <button @click="auth = !auth" class="px-6 py-3 rounded-lg font-medium shadow-md transition-all" :class="isDark
            ? 'bg-gray-200 text-blue-900 hover:bg-white'
            : 'bg-blue-600 text-white hover:bg-blue-700'">
            Get Started
          </button>

          <button @click="isDark = !isDark" class="px-6 py-2 rounded-lg border font-medium transition-all" :class="isDark
            ? 'border-gray-400 text-gray-200 hover:bg-gray-700/50'
            : 'border-gray-400 text-gray-800 hover:bg-gray-100'">
            Toggle Dark Mode
          </button>
        </div>
      </div>
    </div>

    <!-- Auth Panel (slide-in) -->
    <Auth :class="auth ? 'flex translate-x-0' : 'hidden translate-x-full'"
      class="fixed top-0 left-0 h-full w-full sm:w-[400px] bg-white shadow-2xl px-10 py-8 transition-transform duration-300 ease-in-out z-50" />
  </div>
</template>
