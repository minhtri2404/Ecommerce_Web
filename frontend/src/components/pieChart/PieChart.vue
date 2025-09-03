<template>
  <div class="bg-white rounded-2xl p-6 shadow-md h-full flex flex-col">
    <h3 class="font-semibold text-lg mb-4">Thống Kê Thanh Toán</h3>
    <div class="flex-1 flex items-center justify-center">
      <DoughnutChart v-if="chartData" :data="chartData" :options="chartOptions" class="w-full h-[300px]" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from "axios"
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const chartData = ref(null)
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { font: { size: 14 } },
    },
  },
})
const DoughnutChart = Doughnut

const paymentColors = {
  cod: '#3b82f6',  // xanh
  momo: '#f59e0b'  // cam
}

// Gọi API để hiển thị biểu đồ tròn
const fetchTopProduct = async() =>{
  try {
    const res = await axios.get("http://localhost:4000/api/dashboards/payment-stats", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (res.data.success) {
      const data = res.data.data
      chartData.value = {
        labels: data.map(item => item._id),
        datasets: [
          {
            label: 'Doanh số',
            data: data.map(item => item.totalAmount),
            backgroundColor: data.map(item => paymentColors[item._id] || '#ccc'), // fallback màu xám nếu có lỗi
            borderWidth: 2
          }
        ]
      }
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      console.log('error', 'Đã xảy ra lỗi khi tải dữ liệu.', error.response.data.error);
    }
  }
}

onMounted(fetchTopProduct)

</script>
