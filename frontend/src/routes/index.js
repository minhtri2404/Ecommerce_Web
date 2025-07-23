import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login/ComLogin.vue'
import Register from '@/components/Register/ComRegister.vue'

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

    
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router