<template>
  <div :class="`p-6 rounded-2xl shadow-md text-white ${bgColor}`">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <p class="text-2xl font-bold mt-2">{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({
  title: String,
  value: String,
  bgColor: String
})
</script>
