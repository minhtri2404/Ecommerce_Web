<template>
  <div class="flex-1 py-10 flex flex-col justify-between">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />

    <h2 class="text-2xl font-semibold text-center mb-6">Quản Lý Đơn Hàng</h2>

    <!-- Search -->
    <div class="flex justify-between items-center px-4 mb-8">
      <div class="w-full max-w-xs">
        <input
          v-model="search"
          type="text"
          placeholder="Tìm kiếm theo tên khách hàng hoặc ID"
          class="w-full px-4 py-2 border border-indigo-300 rounded focus:outline-none focus:ring focus:border-indigo-400 shadow-sm"
        />
      </div>
    </div>

    <!-- Order Table -->
    <div class="w-full md:p-10 p-4">
      <div class="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <table class="md:table-auto table-fixed w-full overflow-hidden">
          <thead class="text-gray-900 text-sm text-left">
            <tr>
              <th class="px-4 py-3 font-semibold truncate">STT</th>
              <th class="px-4 py-3 font-semibold truncate">Mã đơn hàng</th>
              <th class="px-4 py-3 font-semibold truncate">Người đặt</th>
              <th class="px-4 py-3 font-semibold truncate">Tổng tiền</th>
              <th class="px-4 py-3 font-semibold truncate">Ngày tạo</th>
              <th class="px-4 py-3 font-semibold truncate">Trạng thái</th>
              <th class="px-4 py-3 font-semibold truncate text-center">Hành động</th>
            </tr>
          </thead>
          <tbody class="text-sm text-gray-500">
            <tr
              v-for="order in paginatedOrders"
              :key="order._id"
              class="border-t border-gray-500/20"
            >
              <td class="px-4 py-3">{{ order.sno }}</td>
              <td class="px-4 py-3">{{ order._id }}</td>
              <td class="px-4 py-3">{{ order.shippingAddress?.fullName || 'Khách vãng lai' }}</td>
              <td class="px-4 py-3">{{ formatPrice(order.totalAmount) }}</td>
              <td class="px-4 py-3">{{ new Date(order.createdAt).toLocaleDateString() }}</td>
              <td class="px-4 py-3">
                <span
                  :class="{
                    'text-yellow-500 font-semibold': order.status === 'pending',
                    'text-blue-500 font-semibold': order.status === 'confirmed',
                    'text-purple-500 font-semibold': order.status === 'shipped',
                    'text-green-600 font-semibold': order.status === 'delivered',
                    'text-red-500 font-semibold': order.status === 'cancelled'
                  }"
                >
                  {{ order.status || 'Chưa cập nhật' }}
                </span>
              </td>

              <td class="px-4 py-3 text-center">
                <router-link
                  :to="`/admin-dashboard/order/${order._id}`"
                  class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Chi tiết
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="mt-6 flex justify-end">
          <div class="flex items-center gap-4 text-gray-500 font-medium">
            <!-- Previous -->
            <button @click="prevPage" :disabled="currentPage === 1" aria-label="prev"
              class="rounded-full bg-slate-200/50 disabled:opacity-50">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z"
                  fill="#475569" stroke="#475569" stroke-width=".078" />
              </svg>
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center gap-2 text-sm font-medium">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :class="[ 'h-10 w-10 flex items-center justify-center aspect-square',
                  currentPage === page
                    ? 'text-indigo-500 border border-indigo-200 rounded-full'
                    : ''
                ]"
              >{{ page }}</button>
            </div>

            <!-- Next -->
            <button @click="nextPage" :disabled="currentPage === totalPages" aria-label="next"
              class="rounded-full bg-slate-200/50 disabled:opacity-50">
              <svg class="rotate-180" width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z"
                  fill="#475569" stroke="#475569" stroke-width=".078" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Loading & Empty -->
        <div v-if="loading" class="p-4 text-center text-gray-500">Loading...</div>
        <div v-if="!loading && filteredOrders.length === 0" class="p-4 text-center text-gray-500">
          Không có đơn hàng nào.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Alert from '@/components/Alert/ComAlert.vue'

const orders = ref([])
const loading = ref(false)
const search = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

// ALERT state
const showAlert = ref(false)
const alertType = ref('success')
const alertTitle = ref('')
const alertMessage = ref('')

const showToast = (type, title, message) => {
  alertType.value = type
  alertTitle.value = title
  alertMessage.value = message
  showAlert.value = true
}

// Lấy danh sách đơn hàng
const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:4000/api/orders', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    if (res.data.success && Array.isArray(res.data.orders)) {
      orders.value = res.data.orders.map((order, index) => ({
        ...order,
        sno: index + 1
      }))
    } else {
      showToast('error', 'Lỗi', res.data.message || 'Không thể tải dữ liệu')
    }
  } catch (error) {
    showToast('error', 'Lỗi', error.response?.data?.error || error.message)
  } finally {
    loading.value = false
  }
}

// Filter search
const filteredOrders = computed(() => {
  if (!search.value) return orders.value
  return orders.value.filter(order =>
    order._id.includes(search.value) ||
    order.shippingAddress?.fullName?.toLowerCase().includes(search.value.toLowerCase())
  )
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage))
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredOrders.value.slice(start, end)
})

const goToPage = page => { if (page >= 1 && page <= totalPages.value) currentPage.value = page }
const prevPage = () => goToPage(currentPage.value - 1)
const nextPage = () => goToPage(currentPage.value + 1)

// Format tiền
const formatPrice = price =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

onMounted(fetchOrders)
</script>
