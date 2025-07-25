<template>
  <nav
    class="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all"
  >
    <router-link to="/">
      <h1 class="text-2xl font-bold text-orange-600">LOGO</h1>
    </router-link>

    <!-- Desktop Menu -->
    <div class="hidden sm:flex items-center gap-8">
      <router-link to="/">Trang chủ</router-link>
      <router-link to="/shop">Sản Phẩm</router-link>
      <router-link to="/about">Tin Tức</router-link>
      <router-link to="/contact">Liên Hệ</router-link>

      <!-- Search -->
      <div class="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
        <input
          class="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
          type="text"
          placeholder="Search products"
        />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path clip-rule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- Cart -->
      <div class="relative cursor-pointer">
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#615fff" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <router-link to="/cart">
          <button class="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">3</button>
        </router-link>
      </div>

      <!-- User -->
      <div v-if="isLoggedIn" class="relative">
        <button @click="toggleDropdown" class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-indigo-600">
          👋 {{ userName }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown menu -->
        <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-36 bg-white shadow-md border rounded-md z-50">
          <router-link v-if="!isAdmin" to="/my-orders" class="block px-4 py-2 hover:bg-gray-100 text-sm">🛒 My Orders</router-link>
          <router-link v-if="!isUser" to="/admin-dashboard" class="block px-4 py-2 hover:bg-gray-100 text-sm">🛒 Dashboard</router-link>
          <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">🚪 Logout</button>
        </div>
      </div>

      <!-- Login button -->
      <router-link v-else to="/login">
        <button class="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
          Login
        </button>
      </router-link>
    </div>

    <!-- Mobile Menu Toggle -->
    <button @click="toggleMenu" aria-label="Menu" class="sm:hidden">
      <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="21" height="1.5" rx=".75" fill="#426287" />
        <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
        <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
      </svg>
    </button>

    <!-- Mobile Menu -->
    <div
      :class="[
        open ? 'flex' : 'hidden',
        'absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50'
      ]"
    >
      <router-link to="/">Trang chủ</router-link>
      <router-link to="/shop">Sản Phẩm</router-link>
      <router-link to="/about">Tin Tức</router-link>
      <router-link to="/contact">Liên Hệ</router-link>

      <template v-if="isLoggedIn">
        <!-- Dropdown trigger -->
        <button @click="toggleDropdown" class="font-semibold text-indigo-600 px-4">
          👋 {{ userName }}
        </button>

        <!-- Dropdown content -->
        <div v-if="dropdownOpen" class="flex flex-col gap-2 pl-6">
          <router-link  v-if="!isAdmin" to="/my-orders" class="py-1">🛒 My Orders</router-link>
          <button @click="logout" class="text-left py-1">🚪 Logout</button>
        </div>
      </template>

      <router-link v-else to="/login">
        <button class="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
          Login
        </button>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '@/auth/userAuth'

const open = ref(false)
const dropdownOpen = ref(false)

function toggleMenu() {
  open.value = !open.value
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

const { user, logout } = useAuth()
const isLoggedIn = computed(() => !!user.value)
const isAdmin = computed(() => user.value?.role === 'admin')
const isUser = computed(() => user.value?.role === 'customer')
const userName = computed(() => user.value?.name || 'customer')
</script>
