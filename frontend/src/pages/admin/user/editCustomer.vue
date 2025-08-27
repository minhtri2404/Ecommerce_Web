<template>
    <div class="max-w-xl mx-auto mt-16 px-6">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />
        <div class="bg-white shadow-md rounded-lg p-8">
            <h2 class="text-2xl font-semibold text-center mb-6">Chỉnh sửa thông tin khách hàng</h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Name -->
                <div class="mb-4">
                    <label class="block font-medium mb-1">Tên khách hàng</label>
                    <input
                        v-model="user.name"
                        type="text"
                        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Nhập tên khách hàng"
                    />
                </div>

                <!-- Role -->
                <div>
                    <label class="block font-medium mb-1">Quyền truy cập</label>
                    <select v-model="user.role" class="w-full border rounded px-3 py-2">
                        <option value="admin">Admin</option>
                        <option value="customer">Customer</option>
                    </select>
                </div>

                <!-- Submit -->
                <div class="text-center">
                    <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded">
                        Cập nhật khách hàng
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Alert from '@/components/Alert/ComAlert.vue';

const route = useRoute()
const id = route.params.id

const user = ref({
    name: '',
    role: ''
})

const showAlert = ref(false);
const alertType = ref('success');
const alertTitle = ref('');
const alertMessage = ref('');

const showToast = (type, title, message) => {
  alertType.value = type;
  alertTitle.value = title;
  alertMessage.value = message;
  showAlert.value = true;
};

// Gọi APi để lấy thông tin khách hàng
const fetchCustomers = async() => {
    try {
        const res = await axios.get(`http://localhost:4000/api/customer/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            } 
        })
        if (res.data.success) {
            user.value = res.data.customer
        } else{
            showToast('error', 'Lỗi', res.data.error || 'Không thể tải dữ liệu.')
        }
    } catch (error) {
        showToast('error', 'Lỗi', error.response?.data?.error || 'Không thể tải dữ liệu.')
    }
}


onMounted(fetchCustomers)
</script>