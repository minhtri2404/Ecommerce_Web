<!-- Dashboard.vue -->
<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />
    <!-- Header -->
    <h1 class="text-3xl font-bold mb-2">Bảng Điều Khiển</h1>
    <p class="text-gray-500 mb-6">✨ Xin chào, chúc bạn một ngày làm việc hiệu quả!</p>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <StatsCard icon="mdi-account-group" title="Khách hàng" :value="starts.customer" bgColor="bg-blue-500" />
      <StatsCard icon="mdi-cart" title="Đơn hàng" :value="starts.order" bgColor="bg-purple-500" />
      <StatsCard icon="mdi-currency-usd" title="Doanh thu" :value="formatCurrency(starts.revenue)" bgColor="bg-green-500" />
      <StatsCard icon="mdi-package-variant-closed" title="Sản phẩm" :value="starts.product" bgColor="bg-orange-500" />
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
      <!-- ép chiều cao chung -->
      <div class="md:col-span-2 h-[400px]">
        <LineChart class="h-full" />
      </div>
      <div class="h-[400px]">
        <PieChart class="h-full" />
      </div>
    </div>
  </div>
</template>


<script setup>
import {ref, onMounted} from "vue"
import axios from "axios"
import StatsCard from '@/components/startCart/startCart.vue'
import LineChart from '@/components/lineChart/LineChart.vue'
import PieChart from '@/components/pieChart/PieChart.vue'
import Alert from '@/components/Alert/ComAlert.vue'

const starts = ref({
  customer: 0,
  order: 0,
  revenue: 0,
  product: 0
})

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

const formatCurrency = (value) => {
  if (!value) return "0 đ"
  return new Intl.NumberFormat("vi-VN").format(value) + " đ"
}

const fetchCart = async() => {
  try {
    const res = await axios.get("http://localhost:4000/api/dashboards/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (res.data.success) {
      starts.value = res.data.data
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      showToast('error', 'Đã xảy ra lỗi khi tải dữ liệu.', error.response.data.error);
    }
  }
}

onMounted(fetchCart)

</script>
