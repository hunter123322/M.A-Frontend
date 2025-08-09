<script setup lang="ts">
import Auth from '@/components/auth/Auth.vue';
import { ref } from 'vue';
const auth = ref<boolean>(false) 

</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Left side logo -->
    <div class="flex items-center justify-center w-150 bg-blue-500">
      <img src="https://t4.ftcdn.net/jpg/06/53/51/21/360_F_653512188_rMB6cqzvHS5r6Ng40y9BdQyNh0EDYnan.jpg"
        alt="M.A Chat App Logo" class="w-2/3 h-auto rounded-full animate-bounce" />
    </div>

    <!-- Right side content -->
    <div
      class="flex flex-row justify-center items-center w-screen h-auto bg-[url('https://www.iiba.org/contentassets/b50a9d74a6c64f87910ced487fda24d5/mastering-the-art-of-communication-blog-header.jpg')]">
      <div class="flex items-center justify-center bg-blue-500/95 flex-col w-auto h-auto p-4 rounded-xl">
        <h1 class="text-5xl font-bold text-gray-800 mb-6">M.A Chat App</h1>
        <p class="text-lg text-gray-800 mb-8">"Connecting conversations, one message at a time."</p>
        <button @click="auth = !auth" class="px-6 py-3 bg-white text-blue-800 rounded-lg shadow hover:font-bold transition cursor-pointer">
          Get Started
        </button>
      </div>
    </div>
      <Auth :class="auth ? 'flex translate-x-0' : 'hidden translate-x-1/2'" class="ml-auto px-10 duration-300 ease-in"/>
  </div>

</template>
