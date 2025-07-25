<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />
    <form
      class="flex flex-col gap-4 items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      @submit.prevent="handleSubmit"
    >
      <p class="text-2xl font-medium m-auto">
        <span class="text-indigo-500">User</span> Sign Up
      </p>

      <div class="w-full">
        <p>Name</p>
        <input v-model="name" placeholder="type here" class="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="text" required />
      </div>

      <div class="w-full">
        <p>Email</p>
        <input v-model="email" placeholder="type here" class="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="email" required />
      </div>

      <div class="w-full">
        <p>Password</p>
        <input v-model="password" placeholder="type here" class="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="password" required />
      </div>

      <p>
        Already have an account?
        <router-link to="/login" class="text-indigo-500">Login here</router-link>
      </p>

      <button type="submit" class="bg-indigo-500 hover:bg-indigo-600 text-white w-full py-2 rounded-md">
        Create Account
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuth } from '@/auth/userAuth'
import Alert from '@/components/Alert/ComAlert.vue';

const { login } = useAuth()
const name = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();

// ALERT state
const showAlert = ref(false);
const alertType = ref('success'); // success | error
const alertTitle = ref('');
const alertMessage = ref('');

const showToast = (type, title, message) => {
  alertType.value = type;
  alertTitle.value = title;
  alertMessage.value = message;
  showAlert.value = true;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:4000/api/auth/register", {
      name: name.value,
      email: email.value,
      password: password.value,
      role: 'customer' 
    });

    login(res.data.user, res.data.token)

    showToast('success', 'Đăng ký thành công!', 'Bạn sẽ được chuyển hướng...');
     // đợi 1s cho người dùng đọc rồi chuyển hướng
    setTimeout(() => {
      router.push('/login')
    }, 2000)

  } catch (error) {
    if (error.response && !error.response.data.success) {
        showToast('error', 'Đăng ký thất bại', error.response.data.error)
    }else {
        showToast('error', 'Lỗi hệ thống', 'Vui lòng thử lại sau!')
    }
  }
};
</script>
