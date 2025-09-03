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
                <h2 class="text-lg font-semibold">Thêm bài viết mới</h2>
                <button @click="$router.back()" class="text-gray-500 hover:text-gray-700">&times;</button>
            </div>

            <!-- Body -->
            <div  class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <!-- Tiêu đề -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Tiêu đề</label>
                    <input
                        v-model="newBlog.title"
                        type="text"
                        placeholder="Nhập tiêu đề..."
                        class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                    />
                </div>

                <!-- Ảnh đại diện -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Hình ảnh</label>
                    <input type="file" @change="onFileChange" class="mt-2" />
                    <div v-if="previewImage" class="mt-3">
                        <img :src="previewImage" alt="Preview" class="w-24 h-24 object-cover rounded" />
                    </div>
                </div>

                <!-- Nội dung -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Nội dung</label>
                    <QuillEditor
                        :content="newBlog.content"
                        content-type="html"
                        theme="snow"
                        class="h-60"
                        @update:content="val => newBlog.content = val"
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
                    Thêm mới
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import {ref} from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';
import Alert from '@/components/Alert/ComAlert.vue';

const router = useRouter();
const newBlog = ref({
    title: '',
    content: '',
    image: null
})

// State hiển thị preview ảnh
const previewImage = ref(null)

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    newBlog.value.image = file
    previewImage.value = URL.createObjectURL(file);
  }
};

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

// Gọi APi để Nhấn thêm bài viết
const handleSubmit = async() => {
    const formData = new FormData()
    formData.append("title", newBlog.value.title);
    formData.append("content", newBlog.value.content);
    formData.append("image", newBlog.value.image);

    console.log("TITLE:", newBlog.value.title);
    console.log("CONTENT:", newBlog.value.content);
    console.log("IMAGE:", newBlog.value.image);

    try {
        const res = await axios.post('http://localhost:4000/api/blog/add', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (res.data.success) {
            showToast('success', 'Thành công', res.data.message)
            setTimeout(() => {
                router.push('/admin-dashboard/blog');
            }, 2000);
        } else{
            showToast('error', 'Thất bại', res.data.message)
        }
    } catch (error) {
        if (error.response && !error.response.data.success) {
            showToast('error', 'Đã xảy ra lỗi khi tải dữ liệu.', error.response.data.error);
        }
    }
}

</script>