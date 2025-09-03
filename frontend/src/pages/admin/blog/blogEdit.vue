<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />
        <div class="bg-white rounded-lg shadow-lg w-full max-w-3xl">
            <!-- Header -->
            <div class="flex justify-between items-center border-b px-6 py-4">
                <h2 class="text-lg font-semibold">Chỉnh sửa bài viết</h2>
                <button @click="$router.back()" class="text-gray-500 hover:text-gray-700">&times;</button>
            </div>

            <!-- Body -->
            <div  class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <!-- Tiêu đề -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Tiêu đề</label>
                    <input
                        v-model="Blog.title"
                        type="text"
                        placeholder="Nhập tiêu đề..."
                        class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                    />
                </div>

                <!-- Ảnh đại diện -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Hình ảnh</label>
                    <input type="file" @change="onFileChange" class="mt-2" />

                    <!-- Nếu chọn ảnh mới thì hiển thị preview -->
                    <div v-if="previewImage" class="mt-3">
                        <img :src="previewImage" alt="Preview" class="w-24 h-24 object-cover rounded" />
                    </div>

                    <!-- Nếu chưa chọn ảnh mới nhưng trong DB có ảnh cũ thì hiển thị ảnh cũ -->
                    <div v-else-if="Blog.image" class="mt-3">
                        <img
                        :src="`http://localhost:4000/uploads/blog/${Blog.image}`"
                        alt="Ảnh hiện tại"
                        class="w-24 h-24 object-cover rounded"
                        />
                    </div>
                </div>

                <!-- Nội dung -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Nội dung</label>
                    <QuillEditor
                        :content="Blog.content"
                        content-type="html"
                        theme="snow"
                        class="h-60"
                        @update:content="val => Blog.content = val"
                    />
                </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end items-center border-t px-6 py-4 gap-3">
                <button
                    @click="$router.back()"
                    class="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                    Hủy
                </button>

                <button
                    @click="handleSubmit"
                    class="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    Cập nhật
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Alert from '@/components/Alert/ComAlert.vue'

const route = useRoute()
const id = route.params.id

// State blog
const Blog = ref({
    title: '',
    content: '',
    image: null,
    imageUrl: ''
})

// Preview ảnh mới
const previewImage = ref(null)
const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    Blog.value.image = file
    previewImage.value = URL.createObjectURL(file)
  }
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

// Gọi API để lấy thông tin bài viết trước khi cập nhật
const fetchBlog = async() => {
    try {
        const res = await axios.get(`http://localhost:4000/api/blog/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (res.data.success) {
            Blog.value = res.data.blogById
        } else{
            showToast('error', 'Lỗi', res.data.error || 'Không thể tải dữ liệu.')
        }
    } catch (error) {
        if (error.response && !error.response.data.success) {
            showToast('error', 'Đã xảy ra lỗi khi tải dữ liệu.', error.response.data.error);
        }
    }
}

onMounted(fetchBlog)

</script>