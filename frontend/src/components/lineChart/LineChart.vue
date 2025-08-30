<template>
  <div class="bg-white rounded-2xl p-6 shadow-md h-full">
    <h3 class="font-semibold text-lg mb-4">Biểu Đồ Doanh Thu Theo Tháng</h3>
    <p class="text-sm text-gray-500 mb-4">Phân tích chi tiết doanh thu và lợi nhuận</p>
    <LineChart v-if="chartData" :data="chartData" :options="chartOptions" class="w-full h-[300px]" />
  </div>
</template>


<script setup>
import { ref } from "vue"
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js"
import { Line } from "vue-chartjs"

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

// dùng ref để chartData luôn reactive
const chartData = ref({
  labels: ["T1", "T2", "T3", "T7", "T8", "T9"],
  datasets: [
    {
      label: "Doanh thu",
      data: [0, 0, 0, 20, 36, 0],
      borderColor: "#3b82f6",
      backgroundColor: "#3b82f6",
      fill: false,
    },
    {
      label: "Lợi nhuận",
      data: [0, 0, 0, 15, 27, 0],
      borderColor: "#10b981",
      backgroundColor: "#10b981",
      fill: false,
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: "bottom"
    }
  }
})

const LineChart = Line
</script>
