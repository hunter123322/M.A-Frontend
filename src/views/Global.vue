<template>
  <div class="flex h-screen w-full flex-col md:flex-row font-sans text-white">
    
    <!-- Desktop Sidebar Navigation -->
    <nav class="hidden md:flex flex-col items-center w-20 bg-gray-900 border-r border-gray-800 py-6 shrink-0">
      <div class="text-pink-500 font-bold text-3xl mb-16">
        <Heart />
      </div>
      <div class="flex flex-col gap-6">
        <RouterLink v-for="item in navItems" :key="item.name" :to="item.path" :class="getNavClass(item.path, 'desktop')">
          <component :is="item.icon" class="h-6 w-6" />
        </RouterLink>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto pb-20 md:pb-0">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg border-t border-gray-800 z-50">
      <div class="flex justify-around items-center h-16">
        <RouterLink v-for="item in navItems" :key="item.name" :to="item.path" :class="getNavClass(item.path, 'mobile')">
          <component :is="item.icon" class="h-7 w-7" />
          <span class="absolute -bottom-3 text-xs font-bold transition-opacity duration-300" :class="route.path === item.path ? 'opacity-100' : 'opacity-0'">.</span>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute, RouterLink, RouterView } from 'vue-router';
import { Home, Bell, MessageSquare, User, Heart } from 'lucide-vue-next';
import { shallowRef } from 'vue';

const route = useRoute();

const navItems = shallowRef([
  { name: 'Home', path: '/', icon: Home },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Messages', path: '/messages', icon: MessageSquare },
  { name: 'Profile', path: '/profile', icon: User },
]);

const getNavClass = (path: string, type: 'mobile' | 'desktop') => {
  const isActive = route.path === path;
  
  const baseClasses = 'relative transition-colors duration-300 flex items-center justify-center';
  const mobileClasses = `w-16 h-16 ${isActive ? 'text-pink-500' : 'text-brand-subtle hover:text-gray-100'}`;
  const desktopClasses = `p-3 rounded-lg ${isActive ? 'bg-pink-500/20 text-pink-500' : 'text-brand-subtle hover:bg-white/10 hover:text-gray-100'}`;
  
  return `${baseClasses} ${type === 'mobile' ? mobileClasses : desktopClasses}`;
};
</script>
