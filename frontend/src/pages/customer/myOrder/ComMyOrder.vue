<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">🛒 Đơn hàng của tôi</h1>

    <div v-if="loading" class="text-center py-6">
      <span class="text-gray-500">Đang tải...</span>
    </div>

    <div v-else>
      <div v-if="orders.length === 0" class="text-center py-10 text-gray-600">
        Bạn chưa có đơn hàng nào.
      </div>

      <div v-else class="space-y-6">
        <div 
          v-for="order in orders" 
          :key="order._id"
          class="bg-white shadow rounded-lg p-5 border border-gray-200"
        >
          <!-- Header -->
          <div class="flex justify-between items-center mb-4">
            <div>
              <p class="text-sm text-gray-500">Mã đơn: <span class="font-medium">{{ order._id }}</span></p>
              <p class="text-sm text-gray-500">Ngày đặt: {{ new Date(order.createdAt).toLocaleDateString() }}</p>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="relative mb-6 w-full">
            <!-- Line nền -->
            <div class="absolute top-4 left-0 right-0 h-0.5 bg-gray-300 mx-4"></div>
            <!-- Line tiến độ -->
            <div 
                class="absolute top-4 left-0 h-0.5 bg-green-500 transition-all duration-500"
                :style="{ width: (steps.indexOf(order.status) / (steps.length - 1)) * 100 + '%' }"
            ></div>

                <!-- Circles + Labels -->
                <div class="flex items-center justify-between relative">
                    <div v-for="(step, index) in steps" :key="step" class="flex flex-col items-center">
                    <div
                        class="w-8 h-8 rounded-full flex items-center justify-center z-10"
                        :class="{
                        'bg-green-500 text-white': isCompleted(order.status, step),
                        'bg-gray-200 text-gray-500': !isCompleted(order.status, step)
                        }"
                    >
                        {{ index + 1 }}
                    </div>
                    <span
                        class="text-xs mt-2"
                        :class="isCompleted(order.status, step) ? 'text-green-600 font-medium' : 'text-gray-400'"
                    >
                        {{ step }}
                    </span>
                    </div>
                </div>
            </div>

          <!-- Products -->
          <div class="divide-y divide-gray-200">
            <div 
              v-for="item in order.products" 
              :key="item.product" 
              class="flex items-center py-3"
            >
              <img 
                :src="`http://localhost:4000/uploads/product/${item.image}`"
                alt="Ảnh sản phẩm" 
                class="w-16 h-16 object-cover rounded border mr-4"
              />
              <div class="flex-1">
                <p class="font-medium">{{ item.name }}</p>
                <p class="text-sm text-gray-500">
                  SL: {{ item.quantity }} | Giá: {{ item.price.toLocaleString() }}₫
                </p>
              </div>
              <div class="text-right font-semibold">
                {{ (item.price * item.quantity).toLocaleString() }}₫
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div class="text-sm text-gray-500">
              Phương thức: <span class="font-medium uppercase">{{ order.paymentMethod }}</span><br>
              Trạng thái thanh toán: 
              <span
                :class="{
                  'text-yellow-600': order.paymentStatus === 'pending',
                  'text-green-600': order.paymentStatus === 'paid',
                  'text-red-600': order.paymentStatus === 'failed',
                }"
              >
                {{ order.paymentStatus }}
              </span>
            </div>
            <div class="text-lg font-bold text-red-600">
              Tổng: {{ order.totalAmount.toLocaleString() }}₫
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const orders = ref([])
const loading = ref(true)

const steps = ['pending', 'confirmed', 'shipped', 'delivered']

// Kiểm tra step đã hoàn thành chưa
const isCompleted = (currentStatus, step) => {
  const orderFlow = ['pending', 'confirmed', 'shipped', 'delivered']
  if (currentStatus === 'cancelled') return false
  return orderFlow.indexOf(currentStatus) >= orderFlow.indexOf(step)
}

// Gọi API để lấy danh sách đơn hàng của customer
const fetchOrders = async() => {
  try {
    const res = await axios.get("http://localhost:4000/api/orders/my-order", {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    if (res.data.success) {
      orders.value = res.data.orders
    }
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)
</script>
