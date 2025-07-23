<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <form
      class="flex flex-col gap-4 items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      @submit.prevent="handleSubmit"
    >
      <p class="text-2xl font-medium m-auto">
        <span class="text-indigo-500">User</span> Login
      </p>

      <div class="w-full">
        <p>Email</p>
        <input v-model="email" placeholder="type here" class="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="email" required />
      </div>

      <div class="w-full">
        <p>Password</p>
        <input v-model="password" placeholder="type here" class="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="password" required />
      </div>

      <p>
        Don't have an account?
        <router-link to="/register" class="text-indigo-500">Sign up here</router-link>
      </p>

      <button type="submit" class="bg-indigo-500 hover:bg-indigo-600 text-white w-full py-2 rounded-md">
        Login
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuth } from '@/auth/userAuth'

const { login: saveAuthData } = useAuth()
const email = ref('');
const password = ref('');
const router = useRouter();


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:4000/api/auth/login",{
      email: email.value,
      password: password.value
    })
    if (res.data.success) {
      alert("Đăng nhập thành công!")
      saveAuthData(res.data.user, res.data.token);
    }
    if (res.data.user.role === 'admin') {
        router.push('/admin/dashboard');
    } else{
        router.push('/');
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
        alert(error.response.data.error) // ← hiện đúng lỗi từ backend
    }else {
        alert("Đăng nhập thất bại, vui lòng thử lại sau!")
    }
  }
}
</script>
