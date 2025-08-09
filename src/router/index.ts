import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Landing from '@/views/Landing.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/chat',
      name: 'home',
      component: Home,
    },
    {
      path: "/",
      name: "landing",
      component: Landing,
    }
  ],
})

export default router
