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
      <h2 class="text-2xl font-semibold text-center mb-6">Thêm Danh Mục Mới</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="dep_name" class="block text-sm font-medium text-gray-700 mb-1">Tên Danh Mục</label>
          <input
            v-model="Category.categoryName"
            type="text"
            id="categoryName"
            name="categoryName"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter Category name"
          />
        </div>

        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            v-model="Category.categoryDescription"
            id="categoryDescription"
            name="categoryDescription"
            rows="4"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter description"
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Thêm Danh Mục
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';
import Alert from '@/components/Alert/ComAlert.vue';


const router = useRouter();
const Category = ref({
    categoryName: '',
    categoryDescription: ''
})

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

//Nhấn vào nút Thêm Danh Mục
const handleSubmit = async () => {
    try {
        const res = await axios.post('http://localhost:4000/api/categories/add', Category.value, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (res.data.success) {
            showToast('success', 'Thêm danh mục thành công!');
            setTimeout(() => {
                router.push('/admin-dashboard/category');
            }, 2000); // đợi alert hiển thị một chút
        }
    } catch (error) {
        if (error.response && !error.response.data.success) {
            showToast('error', 'Thêm danh mục thất bại.', error.response.data.error);
        }
    }
}
</script>