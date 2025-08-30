<template>
  <div class="bg-white rounded-2xl p-6 shadow-md h-full">
    <h3 class="font-semibold text-lg mb-4">Biểu Đồ Doanh Thu Theo Tháng</h3>
    <p class="text-sm text-gray-500 mb-4">Phân tích chi tiết doanh thu và lợi nhuận</p>
    <LineChart v-if="chartData" :data="chartData" :options="chartOptions" class="w-full h-[300px]" />
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js"
import { Line } from "vue-chartjs"

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const chartData = ref(null)
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: { position: "bottom" }
  },
  scales: {
    y: {
      min: 0,
      max: 6000000, // Lớn hơn giá trị doanh thu cao nhất một chút
      ticks: {
        stepSize: 1000000, // mỗi mốc cách 1 triệu
        callback: function(value) {
          return value.toLocaleString()
        }
      }
    }
  }
})

const LineChart = Line

// Gọi api để hiển thị doanh thu theo tháng
const fetchMonth = async() => {
  try {
    const res = await axios("http://localhost:4000/api/dashboards/revenue-by-month", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (res.data.success) {
        const months = res.data.data.map(item => `T${item._id}`)
        const revenues = res.data.data.map(item => item.totalRevenue)

        chartData.value = {
          labels: months,
          datasets: [
            {
              label: "Doanh thu",
              data: revenues,
              borderColor: "#3b82f6",
              backgroundColor: "#3b82f6",
              fill: false,
            },
            
          ]
        }
    } 
  } catch (error) {
    if (error.response && !error.response.data.success) {
      console.log('error', 'Đã xảy ra lỗi khi tải dữ liệu.', error.response.data.error);
    }
  }
}

onMounted(fetchMonth)

</script>
