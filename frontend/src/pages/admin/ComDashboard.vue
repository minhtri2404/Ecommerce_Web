<!-- Dashboard.vue -->
<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <h1 class="text-3xl font-bold mb-2">Bảng Điều Khiển</h1>
    <p class="text-gray-500 mb-6">✨ Xin chào, chúc bạn một ngày làm việc hiệu quả!</p>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <StatsCard title="Khách hàng" value="2" bgColor="bg-blue-500" />
      <StatsCard title="Đơn hàng" value="1" bgColor="bg-purple-500" />
      <StatsCard title="Doanh thu" value="34M đ" bgColor="bg-green-500" />
      <StatsCard title="Sản phẩm" value="1" bgColor="bg-orange-500" />
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
import StatsCard from '@/components/startCart/startCart.vue'
import LineChart from '@/components/lineChart/LineChart.vue'
import PieChart from '@/components/pieChart/PieChart.vue'
</script>
