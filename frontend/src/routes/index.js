import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import CustomerLayout from '../pages/customer/ComCustomer.vue'
import AdminLayout from '../pages/admin/ComAdmin.vue'

// Pages
import Home from '@/pages/ComHome.vue'
import Login from '@/components/Login/ComLogin.vue'
import Register from '@/components/Register/ComRegister.vue'
import Shop from '../pages/ComProduct.vue'
import ProductDetail from '../pages/ComProductDetail.vue'
import Cart from '../pages/ComCart.vue'
import Checkout from '../pages/ComCheckout.vue'
import MyOrder from '../pages/ComMyOrder.vue'
import AdminDashboard from '../pages/admin/ComDashboard.vue' // ✅ Chỉ là page
import CategoryList from '../pages/admin/category/categoryList.vue'
import AddCategory from '../pages/admin/category/categoryAdd.vue'
import EditCategory from '../pages/admin/category/categoryEdit.vue'
import ProductList from '../pages/admin/product/productList.vue'
import AddProduct from '../pages/admin/product/productAdd.vue'
import EditProduct from '../pages/admin/product/productEdit.vue'
import OrderList from '../pages/admin/order/orderList.vue'
import OrderDetail from '../pages/admin/order/orderView.vue'
const routes = [
  {
    path: '/',
    name: 'CustomerLayout',
    component: CustomerLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'login', name: 'Login', component: Login },
      { path: 'register', name: 'Register', component: Register },
      { path: 'shop', name: 'Shop', component: Shop },
      { path: '/product/:id', name: 'ProductDetail', component: ProductDetail},
      { path: 'cart', name: 'Cart', component: Cart},
      { path: 'checkout', name: 'Checkout', component: Checkout},
      { path: 'my-orders', name: 'MyOrder', component: MyOrder}
      // Thêm các route khác của khách hàng tại đây
    ]
  },

  {
    path: '/admin-dashboard',
    component: AdminLayout,
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard }, // ✅ chỉ là page
      { path: 'category', name: CategoryList, component: CategoryList},
      { path: 'add-category', name: AddCategory, component: AddCategory},
      { path: 'category/:id', name: EditCategory, component: EditCategory},
      { path: 'product', name: ProductList, component: ProductList}, 
      { path: 'add-product', name: AddProduct, component: AddProduct},
      { path: 'product/:id', name: EditProduct, component: EditProduct},
      { path: 'order', name: OrderList, component: OrderList},
      { path: 'order/:id', name: OrderDetail, component: OrderDetail},    
 

      // Các trang admin khác
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
