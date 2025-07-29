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
      <h2 class="text-2xl font-semibold text-center mb-6">Chỉnh sửa danh mục</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="categoryName" class="block text-sm font-medium text-gray-700 mb-1">Tên Danh Mục</label>
          <input
            v-model="Category.categoryName"
            type="text"
            id="categoryName"
            name="categoryName"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Nhập tên danh mục"
          />
        </div>

        <div class="mb-4">
          <label for="categoryDescription" class="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            v-model="Category.categoryDescription"
            id="categoryDescription"
            name="categoryDescription"
            rows="4"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Nhập mô tả"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Ảnh danh mục</label>
          <input
            type="file"
            name="categoryImage"
            @change="handleFileUpload"
            accept="image/*"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div v-if="Category.categoryImage" class="mt-2">
            <img
              :src="`http://localhost:4000/uploads/${Category.categoryImage}`"
              alt="Ảnh hiện tại"
              class="w-32 h-auto border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Cập nhật danh mục
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Alert from '@/components/Alert/ComAlert.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const Category = ref({
  categoryName: '',
  categoryDescription: '',
  categoryImage: ''
})

const selectedFile = ref(null)
const handleFileUpload = (e) => {
  selectedFile.value = e.target.files[0]
}

// ALERT state
const showAlert = ref(false)
const alertType = ref('success')
const alertTitle = ref('')
const alertMessage = ref('')

const showToast = (type, title, message) => {
  alertType.value = type
  alertTitle.value = title
  alertMessage.value = message
  showAlert.value = true
}

// Lấy thông tin danh mục trước khi cập nhật
const fetchCategories = async () => {
  try {
    const res = await axios.get(`http://localhost:4000/api/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (res.data.success) {
      Category.value = res.data.category
    } else {
      showToast('error', 'Lỗi', res.data.error || 'Không thể tải dữ liệu.')
    }
  } catch (error) {
    showToast('error', 'Lỗi', error.response?.data?.error || 'Không thể tải dữ liệu.')
  }
}

// Gửi cập nhật danh mục
const handleSubmit = async () => {
  const formData = new FormData()
  formData.append('categoryName', Category.value.categoryName)
  formData.append('categoryDescription', Category.value.categoryDescription)
  if (selectedFile.value) {
    formData.append('image', selectedFile.value)
  }

  try {
    const res = await axios.put(`http://localhost:4000/api/categories/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (res.data.success) {
      showToast('success', 'Thành công', 'Cập nhật thành công!')
      setTimeout(() => {
        router.push('/admin-dashboard/category')
      }, 2000)
    } else {
      showToast('error', 'Thất bại', res.data.error || 'Cập nhật thất bại.')
    }
  } catch (error) {
    showToast('error', 'Thất bại', error.response?.data?.error || 'Lỗi máy chủ.')
  }
}

onMounted(fetchCategories)
</script>
