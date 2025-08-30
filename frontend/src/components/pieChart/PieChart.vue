<template>
  <div class="bg-white rounded-2xl p-6 shadow-md h-full flex flex-col">
    <h3 class="font-semibold text-lg mb-4">Top Sản Phẩm Bán Chạy Nhất</h3>
    <div class="flex-1 flex items-center justify-center">
      <DoughnutChart v-if="chartData" :data="chartData" :options="chartOptions" class="w-full h-[300px]" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const chartData = ref({
  labels: ['iPhone 16 Pro Max 256GB | Chính hãng VN/A'],
  datasets: [
    {
      label: 'Doanh số',
      data: [100],
      backgroundColor: ['#3b82f6'],
      borderWidth: 2,
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: { size: 14 }
      }
    },
  },
})

const DoughnutChart = Doughnut
</script>
