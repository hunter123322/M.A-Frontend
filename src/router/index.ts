import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Landing from '@/views/Landing.vue'
import axios from 'axios'
import Global from '@/views/Global.vue'
import Notification from '@/views/Notification.vue'
import Message from '@/views/Message.vue'
import Profile from '@/views/Profile.vue'
import Main from '@/views/Main.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/chat',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/',
      name: 'landing',
      component: Landing,
    },
    {
      path: '/home',
      component: Global,
      children: [
        { path: '', name: 'Home', component: Main },
        { path: 'notifications', name: 'Notifications', component: Notification },
        { path: 'messages', name: 'Messages', component: Message },
        { path: 'profile', name: 'Profile', component: Profile },
      ],
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
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

      // If request succeeds → continue
      console.log('Authenticated')
      next()
    } catch (err) {
      console.log('Auth check failed:', err)
      localStorage.removeItem('jwt_token')
      next('/')
    }
  } else {
    next()
  }
})

export default router
