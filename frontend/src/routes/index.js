import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login/ComLogin.vue'
import Register from '@/components/Register/ComRegister.vue'
import Home from '../pages/ComHome.vue'
const routes = [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { hideNavBar: true }
    },

    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { hideNavBar: true }
    },

    {
      path: '/',
      name: 'Home',
      component: Home,
    }

    
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router