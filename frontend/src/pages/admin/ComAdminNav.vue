<template>
  <div class="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
    <h1 class="text-3xl font-bold text-orange-600">LOGO</h1>
    <div class="flex items-center gap-5 text-gray-500">
      <p>Hi! {{ user?.name || 'Admin' }}</p>
      <button @click="logout" class="border rounded-full text-sm px-4 py-1 hover:bg-gray-100">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/auth/userAuth';  // Dùng useAuth để lấy dữ liệu
const { user, logout } = useAuth();  // Lấy user và logout từ useAuth
</script>
