import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Landing from '@/views/Landing.vue'
import axios from 'axios'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/chat',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      },
    },
    {
      path: "/",
      name: "landing",
      component: Landing,
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      // Call your backend to check if cookie/session is valid
      const res = await axios.get('http://localhost:3000/apiAuthCheck', {
        withCredentials: true // 👈 ensures cookies are sent
      })
      if (res.status === 200) {
        console.log(res.status);
        
        next() // allow access
      } else {
        console.log(123456);

        next('/') // redirect to landing/auth page
      }
    } catch (err) {
      next('/') // on error, redirect
    }
  } else {
    next()
  }
})

export default router
