import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/views/Landing.vue'
import axios from 'axios'
import Profile from '@/views/Profile.vue'
import Main from '@/views/Main.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'landing',
      component: Landing,
    },
    {
      path: '/',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const token = localStorage.getItem('jwt_token')

      if (!token) {
        console.log('No token found')
        next('/')
        return
      }

      // Send token in Authorization header
      await axios.get('http://localhost:3000/apiAuthCheck', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('Authenticated')
      next()
    } catch (err) {
      console.log('Auth check failed:', err)
      localStorage.removeItem('jwt_token')
      next('/auth')
    }
  } else {
    next()
  }
})

export default router
