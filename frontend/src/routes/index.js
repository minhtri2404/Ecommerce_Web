import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import CustomerLayout from '../pages/customer/ComCustomer.vue'

// Pages
import Home from '@/pages/ComHome.vue'
import Login from '@/components/Login/ComLogin.vue'
import Register from '@/components/Register/ComRegister.vue'
import Shop from '../pages/ComProduct.vue'
import AdminDashboard from '../pages/admin/ComAdmin.vue'

const routes = [
  {
    path: '/',
    component: CustomerLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'login', name: 'Login', component: Login, meta: { hideNavBar: true } },
      { path: 'register', name: 'Register', component: Register, meta: { hideNavBar: true } },
      { path: 'shop', name: 'Shop', component: Shop },
      // Thêm các route khác của khách hàng tại đây
    ]
  },

  {
    path: '/admin-dashboard',
    component: AdminDashboard,
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard },
      // Các trang admin khác
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
