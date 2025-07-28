<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />
    <h2 class="text-2xl font-semibold text-center mb-6">Quản lý danh mục</h2>

    <!-- Search & Button -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <input
        v-model="search"
        type="text"
        placeholder="Search by Name"
        class="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
      />
      <router-link to="/admin-dashboard/add-category">
        <button class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded w-full md:w-auto">
          Thêm danh mục mới
        </button>
      </router-link>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full divide-y divide-gray-200 text-left">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-sm font-medium text-gray-600">STT</th>
            <th class="px-6 py-3 text-sm font-medium text-gray-600">Tên danh mục</th>
            <th class="px-6 py-3 text-sm font-medium text-gray-600">Mô tả</th>
            <th class="px-6 py-3 text-sm font-medium text-gray-600 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredCategories"
            :key="item.id"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="px-6 py-4">{{ item.sno }}</td>
            <td class="px-6 py-4">{{ item.categoryName }}</td>
            <td class="px-6 py-4">{{ item.categoryDescription }}</td>
            <td class="px-6 py-4 text-center">
              <button
                class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                @click="editCategory(item.id)"
              >
                Edit
              </button>
              <button
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                @click="deleteCategory(item.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Loading -->
      <div v-if="loading" class="p-4 text-center text-gray-500">Loading...</div>
      <div v-if="!loading && filteredCategories.length === 0" class="p-4 text-center text-gray-500">
        Không tìm thấy danh mục nào.
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
// import {useRouter} from 'vue-router'
import axios from 'axios'
import Alert from '@/components/Alert/ComAlert.vue';

// const router = useRouter()
const categories = ref([])
const loading = ref(false)
const search = ref('')

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

//Gọi API để lấy tất cả danh mục
const fetchCategories = async() =>{
    loading.value = true
    try {
        const res = await axios.get('http://localhost:4000/api/categories', {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (res && res.data && Array.isArray(res.data.categories)) {
            categories.value = res.data.categories.map((category, index) => ({
                id: category._id,
                sno: index + 1,
                categoryName: category.categoryName,
                categoryDescription: category.categoryDescription
            }))
        }
    } catch (error) {
        if (error.response && !error.response.data.success) {
            showToast('error', 'Đã xảy ra lỗi khi tải dữ liệu.', error.response.data.error);
        }
    } finally{
        loading.value = false
    }
}

// Tìm kiếm danh mục theo tên
const filteredCategories = computed(() =>
  categories.value.filter(category =>
    category.categoryName.toLowerCase().includes(search.value.toLowerCase())
  )
)

onMounted(fetchCategories)
</script>