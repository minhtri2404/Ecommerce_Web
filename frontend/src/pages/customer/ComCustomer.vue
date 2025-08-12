<template>
  <div>
    <NavBar v-if="showNavBar" />
    <HeroSection v-if="isHomePage" /> <!-- 👈 chỉ hiện khi đang ở "/" -->
    <router-view />
    <Footer v-if="showFooter" />

  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import NavBar from '@/components/Nav/ComNav.vue'
import HeroSection from '@/components/Nav/ComHeroSection.vue'
import Footer from '@/components/Footer/ComFooter.vue'
const route = useRoute()

const showNavBar = computed(() => true)
const showFooter = computed(() => true)

// ✅ Kiểm tra nếu đang ở "/"
const isHomePage = computed(() => route.path === '/')

</script>
