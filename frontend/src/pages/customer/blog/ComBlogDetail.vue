<template>
    <div class="max-w-4xl mx-auto px-4 py-8">
        <!-- Alert Toast -->
        <Alert
        v-model="showAlert"
        :type="alertType"
        :title="alertTitle"
        :message="alertMessage"
        :duration="3000"
        />
        <!-- Breadcrumb -->
        <nav class="text-sm text-gray-500 mb-4">
            <p class="text-sm text-gray-600">
                <span>Home</span> / 
                <span>Blog</span> / 
                <span>{{ blog.slug }}</span>
            </p>
        </nav>

        <!-- Tiêu đề -->
        <h1 class="text-3xl font-bold mb-2">{{ blog.title }}</h1>

        <!-- Info -->
        <div class="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span class="flex items-center gap-1">
                <i class="fas fa-calendar"></i> {{ formatDate(blog.createdAt) }}
            </span>
        </div>

        <!-- Hình ảnh -->
        <img
            v-if="blog.image"
            :src="`http://localhost:4000/uploads/blog/${blog.image}`"
            alt="Blog Image"
            class="w-full rounded-lg mb-6"
        />

        <!-- Nội dung -->
        <div 
            class="prose max-w-none text-gray-700 leading-relaxed"
            v-html="blog.content"
        ></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Alert from '@/components/Alert/ComAlert.vue'

const route = useRoute()
const id = route.params.id
const blog = ref({})

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

// Gọi API để lấy chi tiết bài viết
const blogDetail = async() => {
    try {
        const res = await axios.get(`http://localhost:4000/api/blog/${id}`)
        if (res.data.success) {
            blog.value = res.data.blogById
        }
    } catch (error) {
        if (error.response && !error.response.data.success) {
            showToast('error', 'Đã xảy ra lỗi khi tải dữ liệu.', error.response.data.error);
        }
    }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(blogDetail)
</script>