<template>
  <div>
    <NavBar v-if="showNavBar" />
    <HeroSection v-if="isHomePage" /> <!-- 👈 chỉ hiện khi đang ở "/" -->
    <router-view />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import NavBar from '@/components/Nav/ComNav.vue'
import HeroSection from '@/components/Nav/ComHeroSection.vue'

const route = useRoute()

// Ẩn NavBar nếu route.meta.hideNavBar = true
const showNavBar = computed(() => {
  return !route.meta.hideNavBar
})

// ✅ Kiểm tra nếu đang ở "/"
const isHomePage = computed(() => route.path === '/')
</script>
